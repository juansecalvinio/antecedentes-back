const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const jwt = require('jsonwebtoken');

const { config } = require('../config');

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

function getTokens({ code, clientId, clientSecret, redirectUri }) {
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
        console.error("Failed to get Google Auth Tokens");
        throw new Error(error.message);
    })
}

function googleAuthApi(app) {
    const router = express.Router();
    app.use('/api/auth/google', router);

    router.get("/url", (req, res, next) => {
        return res.send(getGoogleAuthURL());
    });

    router.get("/", async (req, res, next) => {
        const code = req.query.code;

        const { id_token, access_token } = await getTokens({
            code,
            clientId: config.googleClientId,
            clientSecret: config.googleClientSecret,
            redirectUri: config.redirectURL,
        });

        const googleUser = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
            headers: {
                Authorization: `Bearer ${id_token}`
            }
        })
        .then(response => response.data)
        .catch(error => {
            console.error("Failed to get Google User");
            throw new Error(error.message);
        });

        const token = jwt.sign(googleUser, config.authJwtSecret);

        res.cookie('google_user', googleUser, {
            maxAge: 900000,
            httpOnly: false,
            secure: true,
            sameSite: 'none',
        })

        res.redirect(config.frontendURL);
    })

    router.get("/me", (req, res, next) => {
        try {
            const user = req.cookies['google_user'];
            if(typeof user !== "undefined") {
                return res.status(200).json(JSON.parse(user));
            } else {
                return res.send(null);
            }
        } catch (err) {
            console.error(err);
            return res.send(null);
        }
    });
}

module.exports = googleAuthApi;