
var WILDFIRE = require("wildfire/wildfire");
var JSON = require("modules/json");


exports.getWildfireReceiver = function(context) {
    var receiver = WILDFIRE.Receiver();
    receiver.setId("http://github.com/fireconsole/@meta/receivers/wildfire/insight/console/random/0");
    receiver.addListener({
        
        onMessageReceived: function(request, message) {

            try {

                var data = message.getData();

//console.log("RANDOM CONSOLE DATA", data);
//console.log("context", context);

                context.callApi("console.log", {
                    source: "source",
                    context: {},
                    args: data
                }).fail(function (err) {
                    throw err;
                });

            } catch (err) {
                console.error(err);
            }
        }

    });
    return receiver;
}

