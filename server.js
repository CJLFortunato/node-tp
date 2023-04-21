import http from 'http';
import fs from 'fs';
import dotenv from 'dotenv';
import ejs from 'ejs';
import {
    parse
} from 'querystring';
import dayjs from 'dayjs';

import {
    USERS
} from './Data/users.js'

dotenv.config()

const users = USERS.map(user => ({
    ...user,
    birth: dayjs(user.birth).format('DD/MM/YYYY')
}))

const server = http.createServer((req, res) => {
    console.log(req.url);
    switch (req.url) {
        case '/Assets/CSS/style.css':
            const cssFile = fs.readFileSync('Assets/CSS/style.css', 'utf8');
            res.writeHead(200, {
                'Content-Type': 'text/css'
            });
            res.write(cssFile);
            res.end();
        case '/':
            const homeTemplate = fs.readFileSync('View/home.ejs', 'utf8');
            const homeRendered = ejs.render(homeTemplate);
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(homeRendered);
            res.end();
            break;
        case '/users':
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
                // console.log('test');
                // console.log(body)
            });
            req.on('end', () => {
                const formData = parse(body);
                console.log(formData);
                if (formData.name) users.push({
                    ...formData,
                    birth: dayjs(formData.birth).format('DD/MM/YYYY')
                });
                const usersTemplate = fs.readFileSync('View/users.ejs', 'utf8');
                const usersRendered = ejs.render(usersTemplate, {
                    users
                });
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.write(usersRendered);
                res.end();
            });
            break;
        case '/user/':
            console.log(req.url);
    }
});

server.listen(process.env.APP_PORT, () => {
    console.log('Le serveur est en écoute sur le port 5000');
});