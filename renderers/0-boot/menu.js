

exports.init = function (context) {

	var Q = context.API.Q;
	var $ = context.API.JQUERY;

	var menuNode = $('<div class="' + context.cssPrefix + '-menu"></div>').appendTo(context.domNode);

	return context.registerApi("menu.add.button", function (args) {

		var buttonNode = $('<button button="' + args.lid + '">' + args.label + '</button>').appendTo(menuNode);
		buttonNode.click(function () {
			args.command();
		});

		return Q.resolve();

	}).then(function () {

		return context.registerApi("menu.close", function (args) {
			menuNode.hide();
			return Q.resolve();
		}).then(function () {
			return context.registerApi("menu.show", function (args) {
				menuNode.show();
				return Q.resolve();
			});
		});

	}).then(function () {

		return context.callApi("menu.add.button", {
			lid: "close-menu",
			label: "Close Menu",
			command: function () {
				context.callApi("menu.close");
			}
		});
	}).then(function () {

		// Triple-click to open menu.
		var timer,          // timer required to reset
		    timeout = 200;  // timer reset in ms
		context.domNode.on("dblclick", function (evt) {
		    timer = setTimeout(function () {
		        timer = null;
		    }, timeout);
		});
		context.domNode.on("click", function (evt) {
		    if (timer) {
		        clearTimeout(timer);
		        timer = null;

		        context.callApi("menu.show");
		    }
		});
	});
}

