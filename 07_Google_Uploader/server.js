import express from 'express';
import url from 'url';
import fs from 'fs';
import { google } from 'googleapis';

const app = express();
const port = 3000;
const TOKEN_PATH = 'token.json';

app.get('/', (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    if (queryObject.code) {
        const { client_id, client_secret, redirect_uris } = JSON.parse(fs.readFileSync('credentials.json')).web;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        oAuth2Client.getToken(queryObject.code, (err, token) => {
            if (err) {
                res.send('Error retrieving access token');
                return console.error('Error retrieving access token', err);
            }
            oAuth2Client.setCredentials(token);
            fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
            res.send('Authentication successful! You can close this window.');
        });
    } else {
        res.send('No code found in URL');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
