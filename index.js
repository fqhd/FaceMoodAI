import express from 'express';
import fs from 'fs';
import https from 'https';
import base64Img from 'base64-img';
import Database from 'nedb';
const privateKey = fs.readFileSync('./sslcert/server.key', 'utf8');
const certificate = fs.readFileSync('./sslcert/server.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};
const app = express();
const PORT = process.env.PORT || 3000;

const database = new Database('database.db');
database.loadDatabase();
let index = 0;
database.find({}, function(err, data){
    index = data.length;
});

app.use(express.static('client'));
app.use(express.json({limit: '1mb'}));
app.post('/sendData', (request, response) => {
    index++;
    const data = request.body;
    // Download the image
    base64Img.img(data.img64, './images', 'image' + index.toString(), function(error, path){
        if(error){
            console.log('there has been a problem');
        }else{
            console.log('file saved at ' + path);
        }
    });
    const dataEntry = {
        keyword: data.keyword,
        imagePath: 'images/image' + index.toString() + '.png'
    };
    database.insert(dataEntry);
    response.json({status:'successful'});
});

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT);

