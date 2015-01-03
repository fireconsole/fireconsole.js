
var WILDFIRE = require("wildfire");
var JSON = require("modules/json");
var UTIL = require("modules/util");
var HTTP_CLIENT = require("modules/http-client");
var Q = require("modules/q");
var URI = require("modules/uri");


exports.init = function (context) {

    var channel = WILDFIRE.PostMessageChannel();
    channel.setPostMessageSender(function (part) {
       console.log("post message sender message part", part);

       channel.parseReceivedPostMessage(part);
    });
    channel.addReceiver(require("./wildfire/fireconsole").getWildfireReceiver({}));


    var dispatcher = WILDFIRE.Dispatcher();
    dispatcher.setChannel(channel);
    dispatcher.setProtocol('http://registry.pinf.org/cadorn.org/wildfire/@meta/protocol/component/0.1.0');
    dispatcher.setSender("internal");
    dispatcher.setReceiver("http://github.com/fireconsole/@meta/receivers/wildfire/fireconsole/0");


    var message = WILDFIRE.Message();
    message.setData(JSON.encode({
    	my: "message"
    }));
    dispatcher.dispatch(message);

    console.log("sent message!");


    return context.API.Q.resolve();
}
