
var WILDFIRE = require("wildfire");


exports.init = function (context) {


    var receiverChannel = WILDFIRE.PostMessageChannel();
    receiverChannel.addReceiver(require("./wildfire/fireconsole").getWildfireReceiver(context));
    receiverChannel.addReceiver(require("./wildfire/insight/console/random").getWildfireReceiver(context));


    var senders = {
    	"wildfire/fireconsole": {
    		receiver: "http://github.com/fireconsole/@meta/receivers/wildfire/fireconsole/0"
    	},
    	"wildfire/insight/console/random": {
    		receiver: "http://github.com/fireconsole/@meta/receivers/wildfire/insight/console/random/0"
    	}
    };
    Object.keys(senders).forEach(function (senderId) {
		var channel = senders[senderId].channel = WILDFIRE.PostMessageChannel();
	    channel.setPostMessageSender(function (part) {
			receiverChannel.parseReceivedPostMessage(part);       
	    });

	    var dispatcher = senders[senderId].dispatcher = WILDFIRE.Dispatcher();
	    dispatcher.setChannel(channel);
	    dispatcher.setProtocol('http://registry.pinf.org/cadorn.org/wildfire/@meta/protocol/component/0.1.0');
	    dispatcher.setSender("internal");
	    dispatcher.setReceiver(senders[senderId].receiver);
    });
    function makeSendForSenderId (senderId) {
		return function (obj) {
			var deferred = context.API.Q.defer();
			var message = WILDFIRE.Message();
			message.setData( (typeof obj === "object") ? JSON.stringify(obj) : obj);
			deferred.resolve(senders[senderId].dispatcher.dispatch(message));
			return deferred.promise;
		};
    }


    return context.API.Q.resolve({
    	wildfire: {
    		fireconsole: {
	    		send: makeSendForSenderId("wildfire/fireconsole")
	    	},
			insight: {
				console: {
					random: {
			    		send: makeSendForSenderId("wildfire/insight/console/random")
			    	}
		    	}
	    	}
    	}
    });
}