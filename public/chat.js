// Make connection
var socket = io.connect("http://localhost:4000");

// Query DOM
var message = document.getElementById("message");
var handle = document.getElementById("handle");
var btn = document.getElementById("send");
var output = document.getElementById("output");
var feedback = document.getElementById("feedback");

// Emit events
btn.addEventListener("click", function() {
    sendMessage();
});

message.addEventListener("keypress", function(e) {

    //Show that the user is typing, but only if there is data present
    if (message.value != "") {
        socket.emit("typing", handle.value);
    }

    // Try to send message on Enter key press
    if (e.keyCode == 13) {
        sendMessage();
    }
});

// Listen for events
socket.on("chat", function(data) {
    //remove any feedback and add the message
    feedback.innerHTML = "";
    output.innerHTML += "<p><strong>" + data.handle + "</strong>: " + data.message + "</p>";
});

socket.on("typing", function(data) {
    //update the feedback if another user is typing a message
    feedback.innerHTML = "<p><em>" + data + " is typing...</em></p>";
});


function sendMessage() {
    //if the message is not empty, send it to the server and reset the field
    if (message.value != "") {
        socket.emit("chat", {
            message: message.value,
            handle: handle.value
        });
        message.value = "";
    }
}
