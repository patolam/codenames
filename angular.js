const express = require('express');
const http = require('http');
const path = require('path');

const appPath = __dirname + '/dist/apps/codenames';

const app = express();
const port = process.env.PORT || 80;

app.use(express.static(appPath));
app.get('/*', (req, res) => res.sendFile(path.join(appPath + '/index.html')));

const server = http.createServer(app);

server.listen(port, () => console.log(`App running on: http://localhost:${port}`));
