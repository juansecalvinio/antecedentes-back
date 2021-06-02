const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const jwt = require('jsonwebtoken');

const { config } = require('../config');

const redirectURL = "https://antecedentes-back.herokuapp.com/api/auth/google";

function getGoogleAuthURL() {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: redirectURL,
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
        redirect_uri: redirectUri,
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
    app.use('/api/auth', router);

    router.get("/google/url", (req, res, next) => {
        return res.send(getGoogleAuthURL());
    });

    router.get("/google", async (req, res, next) => {
        const code = req.query.code;

        const { id_token, access_token } = await getTokens({
            code,
            clientId: config.googleClientId,
            clientSecret: config.googleClientSecret,
            redirectUri: redirectURL
        });

        const googleUser = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
            {
                headers: {
                    Authorization: `Bearer ${id_token}`
                }
            }
        )
        .then(res => res.data)
        .catch(error => {
            console.error("Failed to get Google User");
            throw new Error(error.message);
        });

        const token = jwt.sign(googleUser, config.authJwtSecret);

        res.cookie("googleToken", token, {
            maxAge: 90000,
            httpOnly: true,
            secure: false,
        })

        // Acá lo manejo como un sign-in o sign-up normal, de auth.js
        return res.status(200).json({
            data: googleUser,
            message: "Acceso autorizado por Google"
        })
    })




}

module.exports = googleAuthApi;