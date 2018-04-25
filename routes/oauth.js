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

router.post('/token', async (req, res, next) => {
    let request = new OAuth2ServerRequest(req);
    let response = new OAuth2ServerResponse(res);
    try {
        let token = await oauth.token(request, response);
        res.json(token);
    } catch (err) {
        next(err)
    }
});

router.post('/authorize', async (req, res, next) => {
    let request = new OAuth2ServerRequest(req);
    let response = new OAuth2ServerResponse(res);
    try {
        let code = await oauth.authorize(request, response);
        res.json(code);
    } catch (err) {
        next(err)
    }
});

router.get('/authorize', (req, rets, next) => {
    // TODO : get the Client from client_id and redirect_uri
    res.statusCode = 200;//send the appropriate status code
    res.json({status: "success", message: "GET oauth/authorize"})
});

module.exports = router;