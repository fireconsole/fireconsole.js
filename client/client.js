
var CONSOLE_WIDGET = require("widget");
var JQUERY = require("widget/jquery");


exports.main = function () {

	try {

		var console1 = new CONSOLE_WIDGET.Widget();

		// TODO: Load jQuery via PINF bundler.
		console1.attach(JQUERY("#console1")).then(function (context) {
			return context.callApi("tests.load").then(function () {

			});
		});

/*
		var console2 = new CONSOLE_WIDGET.Widget();

		// TODO: Load jQuery via PINF bundler.
		console2.attach($("#console2")).then(function (context) {

			return context.callApi("menu.close").then(function () {

				return context.callApi("view.show", {
					name: "graph"
				});
			});
		});
*/
	} catch (err) {

		console.error(err.stack);
	}
}
