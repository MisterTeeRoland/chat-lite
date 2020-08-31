

// Make connection
var socket = io.connect();

// Query DOM
var message = document.getElementById("message");
var handle = document.getElementById("handle");
var button = document.getElementById("send");
var output = document.getElementById("output");
var feedback = document.getElementById("feedback");

var user_tz = Intl.DateTimeFormat().resolvedOptions().timeZone;


console.log(user_tz);


// Emit events
button.addEventListener("click", function() {
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
    var timeReceived = moment.utc(data.timeSent).tz(user_tz).format("MMM D 'YY, h:mm a");
    console.log("message received at " + timeReceived);
    output.innerHTML += "<div class='message'><p><strong>" + data.handle + "</strong>: " + data.message + "</p><small>"+timeReceived+"</small></div>";
});

socket.on("typing", function(data) {
    //update the feedback if another user is typing a message
    feedback.innerHTML = "<p><em>" + data + " is typing...</em></p>";
});


function sendMessage() {
    //if the message is not empty, send it to the server and reset the field
    if (message.value != "") {
        var user_time = moment.utc();
        socket.emit("chat", {
            message: message.value,
            handle: handle.value,
            timeSent: user_time,
        });
        message.value = "";
    }
}
