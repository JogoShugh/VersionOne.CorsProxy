var bodyParser = require('body-parser');
var request = require('request');
var express = require('express');
var app = express();
var cors = require('cors');
    

app.use(bodyParser.text({ type : 'application/xml' }));
//TODO: make it work only with the requestor url
app.use(cors());
//TODO: make this configurable
var port = '1234';

function getUrl(url) {
    //remove the initial slash
    return url.substr(1, url.length - 1);
}

function getHeaders(headers) {
    var result = {};
    for (h in headers) {
        if (h == 'host' || h == 'origin' || h == 'referer' || h == 'accept-encoding')
            continue;
        result[h] = headers[h];
    }
    return result;
}

function addHeaders(response, headers) {
    for (h in headers) {
        response.setHeader(h, headers[h]);
    }
}

app.get('/*', function (req, res, next) {
    var options = {
        url: getUrl(req.url),
        method: 'GET',
        headers: getHeaders(req.headers)
    };
    
    request(options, function (error, response, body) {
        addHeaders(res, getHeaders(response.headers));
        res.end(body);
    });
});

app.post('/*', function (req, res, next) {
    var options = {
        url: getUrl(req.url),
        method: 'POST',
        body: req.body,
        headers: getHeaders(req.headers)
    };
    
    request(options, function (error, response, body) {
        addHeaders(res, getHeaders(response.headers));
        res.status(200).send(body);
    });
    
});

app.listen(port, function () {
    console.log('CORS-enabled web server listening on port ' + port);
});