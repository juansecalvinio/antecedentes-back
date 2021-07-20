const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const jwt = require('jsonwebtoken');
const { config } = require('../config');

const { OAuth2Client } = require('google-auth-library');
const authClient = new OAuth2Client(config.googleClientId);

function getGoogleAuthURL() {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: config.redirectURL,
        client_id: config.googleClientId,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    }

    return `${rootUrl}?${querystring.stringify(options)}`;
}

function getTokens({ code, clientId, clientSecret }) {
    const url = "https://oauth2.googleapis.com/token";

    const values = { 
        code, 
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: config.redirectURL,
        grant_type: "authorization_code"
    }

    return axios.post(url, querystring.stringify(values), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    })
    .then(res => res.data)
    .catch(error => {
        throw new Error(error.message);
    })
}

function googleAuthApi(app) {
    const router = express.Router();
    app.use('/api/auth/google', router);

    router.get("/url", (req, res) => {
        return res.send(getGoogleAuthURL());
    });

    router.get("/", async (req, res) => {
        // const code = req.query.code;

        // const { id_token, access_token } = await getTokens({
        //     code,
        //     clientId: config.googleClientId,
        //     clientSecret: config.googleClientSecret,
        //     redirectUri: config.redirectURL,
        // });

        // const googleUser = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        // {
        //     headers: {
        //         Authorization: `Bearer ${id_token}`
        //     }
        // })
        // .then(response => response.data)
        // .catch(error => {
        //     throw new Error(error.message);
        // });

        // // const token = jwt.sign(googleUser, config.authJwtSecret);

        // res.cookie('google_user', googleUser, {
        //     maxAge: 900000,
        // })

        // res.redirect(config.frontendURL);

        const { token } = req.body;

        const ticket = await authClient.verifyIdToken({
            idToken: token,
            audience: config.googleClientId
        });

        const { name, email, picture } = ticket.getPayload();

        const user = { name, email, picture }; 

        res.json(user);
    })

    router.get("/me", (req, res) => {
        try {
            const user = req.session.user;
            if(typeof user !== "undefined") {
                return res.status(200).json(user);
            } else {
                return res.status(404).json({ error: 404, message: 'No se encontraron datos' });
            }
        } catch (err) {
            return res.status(500).json({ error: 500, message: 'Internal server error' });
        }
    });
}

module.exports = googleAuthApi;