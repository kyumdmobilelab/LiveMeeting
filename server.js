/*
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Hello Node.js!\n');
    if ('host' in req.headers) {
        var host = req.headers['host'];
        res.write('Vhost is ' + host.split(':')[0] + '\n');
    } else {
        res.write('No vhost specified\n');
    }
    res.end();
}).listen(process.env.PORT);
*/


// Load required modules
var http   = require("http");     // https server core module
var fs      = require("fs");        // file system core module
var express = require("express");   // web framework external module
var io      = require("socket.io"); // web socket external module
var easyrtc = require("./");   // EasyRTC external module

// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var httpApp = express();
httpApp.use(express.static(__dirname + "/static/"));

// Start Express https server on port 8443
var webServer = http.createServer(httpApp).listen(process.env.PORT);

// Start Socket.io so it attaches itself to Express server
var socketServer = io.listen(webServer, {"log level":1});

// Start EasyRTC server
var rtc = easyrtc.listen(httpApp, socketServer);