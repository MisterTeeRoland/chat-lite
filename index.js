var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(4000, function() {
    console.log("Listening to requests on port 4000.");
});

// Static files (this basically means look in the "public" folder to run the files)
app.use(express.static('public'));

// Socket setup (pass in the server created earlier)
var io = socket(server);

// socket parameter refers to the individual socket between client and server. can be many instances at once.
io.on('connection', function(socket) {
    console.log("Made socket connection", socket.id);

    //if a chat is received, send it to ALL listening sockets
    socket.on("chat", function(data) {
        io.sockets.emit("chat", data);
    });

    //if the user is typing, broadcast to all other listening sockets (that aren't the user's)
    socket.on("typing", function(data) {
        socket.broadcast.emit("typing", data);
    });
});
