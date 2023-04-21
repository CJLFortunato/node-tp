import http from 'http';
import dotenv from 'dotenv';

import {
    handleRoutes
} from './routes.js';

dotenv.config()

const server = http.createServer((req, res) => {
    console.log(req.url);
    handleRoutes(req, res);

});

server.listen(process.env.APP_PORT, () => {
    console.log('Le serveur est en écoute sur le port 5000');
});