
var CONSOLE_WIDGET = require("widget");

exports.main = function () {

	try {

		var console1 = new CONSOLE_WIDGET.Widget();

		// TODO: Load jQuery via PINF bundler.
		console1.attach($("#console1"));


		var console2 = new CONSOLE_WIDGET.Widget();

		// TODO: Load jQuery via PINF bundler.
		console2.attach($("#console2"));

	} catch (err) {

		console.error(err.stack);
	}
}
