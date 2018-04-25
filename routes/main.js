const express = require('express');
const router = express.Router();
const OAuth2Server = require('oauth2-server');
const OAuth2ServerRequest = OAuth2Server.Request;
const OAuth2ServerResponse = OAuth2Server.Response;
const oauth = new OAuth2Server({
    model: require('../models/OAuth2ServerModel'),
    accessTokenLifetime: 4 * 60 * 60,
    allowEmptyState: true
});

router.use(async (req, res, next) => {
    let request = new OAuth2ServerRequest(req);
    let response = new OAuth2ServerResponse(res);
    try {
        await oauth.authenticate(request, response);
    } catch (err) {
        next(err)
    }
    next();
});

router.use('/me', (req, res) => {
    res.statusCode = 200;
    res.json({status: "success", message: "this is me!"})
});

module.exports = router;