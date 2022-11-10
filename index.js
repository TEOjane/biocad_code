var express = require('express');
const path = require('path');
var application = express();
var server = require('http').createServer(application);
var io = require('socket.io')(server);
var html_to_pdf = require('html-pdf-node');

server.listen(3000);

application.use(express.static(path.join(__dirname, 'public')));

application.get('/', function(request, respons) {

    respons.sendFile(__dirname + '/public/main.html');

});

application.get('/analytics.html', function(request, respons) {

    application.use(express.static(path.join(__dirname, 'public')));
    respons.sendFile(__dirname + '/public/analytics.html');

});

application.get('/main.html', function(request, respons) {

    application.use(express.static(path.join(__dirname, 'public')));
    respons.sendFile(__dirname + '/public/main.html');

});

application.get('*', function(request, respons) {

    application.use(express.static(path.join(__dirname, 'public')));
    respons.sendFile(__dirname + '/public/error.html');

});


io.sockets.on('connection', function(socket) {
    console.log("Подключились");

    socket.on('create PDF', function() {
        let options = { format: 'A4' };

        let file = { url: "http://localhost:3000/analytics.html" };
        html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
            console.log("PDF Buffer:-", pdfBuffer);
        });
    });

    socket.on('disconnect', function(socket) {
        console.log("Отключились");
    });
});




