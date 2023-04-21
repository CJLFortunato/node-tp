import fs from 'fs';
import ejs from 'ejs';
import {
    parse
} from 'querystring';
import dayjs from 'dayjs';

import {
    USERS
} from './Data/users.js'

let users = USERS.map(user => ({
    ...user,
    birth: dayjs(user.birth).format('DD/MM/YYYY')
}))

export const handleRoutes = ((req, res) => {
    if (req.url === '/Assets/CSS/style.css') {
        const cssFile = fs.readFileSync('Assets/CSS/style.css', 'utf8');
        res.writeHead(200, {
            'Content-Type': 'text/css'
        });
        res.write(cssFile);
        res.end();
    } else if (req.url === '/') {
        const homeTemplate = fs.readFileSync('View/home.ejs', 'utf8');
        const homeRendered = ejs.render(homeTemplate);
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write(homeRendered);
        res.end();
    } else if (req.url.includes('/users')) {
        let body = '';
        const name = req.url.split('/')[2];
        console.log('test');
        console.log(name);
        console.log(req.method);
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
    } else if (req.url.includes('/delete/')) {
        console.log('test');
        console.log(req.url);
        const name = req.url.split('/')[2];
        console.log(name);
        req.on('data', chunk => {
            body += chunk.toString();
            console.log(body)
        });
        req.on('end', () => {
            users = users.filter(user => user.name !== name)
            const deletedTemplate = fs.readFileSync('View/deleted.ejs', 'utf8');
            const deletedRendered = ejs.render(deletedTemplate, {
                name
            });
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(deletedRendered);
            res.end();
        });
    }
    return;
})