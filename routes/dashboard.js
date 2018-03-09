/* Retrieve Router Handler */
const express = require('express');
const router = express.Router();
const https = require('https');
const knex = require('../config/db/bookshelf').knex;

/* Debugger */
const debug = require('debug')('route-home');

module.exports = (app, passport) => {
    function authenticate(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/login')
    }

    /* Views */
    router.get('/', authenticate, function(req, res, next) {
        res.render('dashboard', {
            authenticated: req.isAuthenticated()
        });
    });


    /* API Endpoints */
    router.get('/ledger', authenticate, (req, res, next) => {
        let host = "https://7066414.pythonanywhere.com";
        let path = "/mcp/get_ledger?token=78b9a29078a60441508d28c2f67a7ebb";

        https.get(host + path, function (resp) {
            const { statusCode } = resp;
            const contentType = resp.headers['content-type'];

            let error;
            if (statusCode !== 200)
                error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
            else if (!/^application\/json/.test(contentType))
                error = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`);

            if(error) {
                console.error(error.message);
                // consume response data to free up memory
                res.status(500);
                return;
            }

            resp.setEncoding('utf8');

            let rawData = '';
            resp.on('data', (chunk) => {
                rawData += chunk;
            });

            resp.on('end', () => {
                try {
                    res.status(200).send(JSON.parse(rawData)['ledger']);
                } catch (e) {
                    res.status(500);
                }
            });
        }).on('error', (e) => {
            res.status(500);
        });
    });

    router.post('/logs', (req, res, next) => {
        if(!req.body)
            return res.status(400).send('No request body.');

        let log = req.body['log'];
        if(!log)
            return res.status(400).send('No log file');

        knex('logs').insert({log: log}).then(() => {
            return res.status(200).send('Log saved.');
        }).catch((err) => {
            debug(err);
            return res.status(400).send('Internal Server Error.');
        });
    });

    router.get('/logs', (req, res, next) => {
        knex('logs').select('log').then((logs) => {
            return res.status(200).send(logs);
        }).catch((err) => {
            debug(err);
            return res.status(400).send('Internal Server Error.');
        });
    });

    /* Register Router */
    app.use('/dashboard', router);
};
