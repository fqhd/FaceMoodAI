import express from 'express';
import fs from 'fs';
import https from 'https';
const privateKey = fs.readFileSync('sslcert/server.key', 'utf8');
const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('client'));
app.use(express.json({limit: '1mb'}));
app.post('/sendData', (request, response) => {
    console.log(request.body);
    response.json({status:'successful'});
});

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT);

