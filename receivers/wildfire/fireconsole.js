
var WILDFIRE = require("wildfire/wildfire");
var JSON = require("modules/json");


exports.getWildfireReceiver = function(context) {
    var receiver = WILDFIRE.Receiver();
    receiver.setId("http://github.com/fireconsole/@meta/receivers/wildfire/fireconsole/0");
    receiver.addListener({
        
        onMessageReceived: function(request, message) {

            try {

                var data = JSON.decode(message.getData());

                if (data.method = "callApi") {

                    return context.callApi(data.args[0], data.args[1] || {});

                } else {
                    throw new Error("Method '" + data.method + "' not found!");
                }

            } catch (err) {
                console.error(err);
            }
        }

    });
    return receiver;
}

