/* Retrieve Router Handler */
const express = require('express');
const router = express.Router();
const http = require('http');

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
    router.get('/leger', authenticate, function(req, res, next) {
        res.status(200).send({"ledger":[
                {
                    "week": 0,
                    "item": "startup",
                    "credit": 175.0,
                    "debit": 0.0
                }
            ],"status":0, "description":""});
    });

    /* Register Router */
    app.use('/dashboard', router);
};
