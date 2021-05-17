const credentials = require('../credentials/client_secret.json').web;

const https = require('https');
const express = require('express');
const querystring = require('querystring');

const {OAuth2Client} = require('google-auth-library');

const router = express.Router();

const client = new OAuth2Client(credentials.client_id);


generateAuthParams = (credentials) => {
    return querystring.stringify({
        client_id: credentials.client_id,
        redirect_uri: credentials.redirect_uris[0],
        response_type: 'code',
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
    });
}

generateAuthUri = (credentials) => {
    return `${credentials.auth_uri}?${generateAuthParams(credentials)}`;
}


/* GET home page. */
router.get('/login', function (req, res, next) {
    res.redirect(generateAuthUri(credentials));
});

router.get('/redirect', (req, res) => {
    let token = '';

    const code = req.query.code;
    const data = querystring.stringify({
        code: code,
        client_id: credentials.client_id,
        client_secret: credentials.client_secret,
        redirect_uri: credentials.redirect_uris[0],
        grant_type: 'authorization_code'
    });
    const request = https.request({
        hostname: 'oauth2.googleapis.com',
        port: 443,
        path: '/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            // 'Content-Length': data.length
        }
    }, response => {
        response.on('data', data => {
            token += data;
        });
        response.on('end', () => {
            res.redirect(`http://localhost:4200?token=${token}`)
        });
    });

    request.on('error', err => {
        res.send(err);
    });
    request.write(data);
    request.end();
})

router.get('/info', (req, res) => {
    const token = req.query.token;
    const result = JSON.parse(token);

    client.verifyIdToken({
        idToken: result.id_token,
        audience: credentials.client_id
    }).then(ticket => {
        const payload = ticket.getPayload();
        const userId = ticket.getUserId();
        const attributes = ticket.getAttributes();
        const envelope = ticket.getEnvelope();
        res.send({
            email: payload.email,
            given_name: payload.given_name,
            family_name: payload.family_name,
            picture: payload.picture
        })
    }).catch(err => {
        res.send(err);
    });
})

module.exports = router;
