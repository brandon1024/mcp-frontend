/* Retrieve Router Handler */
const express = require('express');
const router = express.Router();
const https = require('https');

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
    router.get('/ledger', authenticate, function(req, res, next) {
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
                    res.status(200).send(JSON.parse(rawData));
                } catch (e) {
                    res.status(500);
                }
            });
        }).on('error', (e) => {
            res.status(500);
        });
    });

    /* Register Router */
    app.use('/dashboard', router);
};
