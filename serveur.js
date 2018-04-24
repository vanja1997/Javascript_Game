var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var compteur = 0;
var nReady = 0;
var nPlayer = 2;
var test = 1000;
var idTurn = 0;
var firstTimestamp;
var secondTimestamp;
var test;
app.use(express.static('public'));

app.get ('/', function(req, res) {
        res.sendFile(__dirname + "/index.html");
});

io.sockets.on('connection', function (socket) {

    socket.on('newClient', function(pseudo) {
        socket.emit('nId', compteur);
        compteur++;
        socket.pseudo = pseudo;
    });

    socket.on('Ready', function(pseudo) {
        //socket.emit('Le joueur' + pseudo + 'est prêt');
        nReady++;
        //socket.broadcast.emit('wait');
        socket.emit('wait');
        if (nReady == nPlayer){
            socket.broadcast.emit('start');
            socket.emit('start');
            nReady=0;
            compteur=0;
        }
    });

    socket.on('timer', function(){
        if (test >= 1000){
            firstTimestamp = new Date().getTime();
            idTurn++;
        }
        secondTimestamp = new Date().getTime();
        test = secondTimestamp - firstTimestamp;
        if (idTurn >= nPlayer)
            idTurn = 0;
        socket.broadcast.emit('turn',idTurn);
    });

    /*broadcast id de celui qui à appuyé*/
    socket.on ('taff', function(id) {
        var target = id;
        socket.broadcast.emit('taff',target);
        socket.emit('taff',target);
    });

    socket.on ('end', function(id) {
        var idWin = id;
        socket.broadcast.emit('end',idWin);
        socket.emit('end',idWin);
    });

});


server.listen(8081);

