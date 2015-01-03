
var WILDFIRE = require("wildfire/wildfire");
var JSON = require("modules/json");


exports.getWildfireReceiver = function(context) {
    var receiver = WILDFIRE.Receiver();
    receiver.setId("http://github.com/fireconsole/@meta/receivers/wildfire/fireconsole/0");
    receiver.addListener(WildfireListener);
    return receiver;
}

var requests = {};

var WildfireListener = {

    onChannelOpen: function(request) {

console.log("onChannelOpen request", request);

    },
    
    onMessageReceived: function(request, message) {

        try {

    		var data = JSON.decode(message.getData());

console.log("data", data);

        } catch (err) {
            console.error(err);
        }
    },

    onChannelClose: function(request) {

console.log("onChannelClose request", request);
    }
}
