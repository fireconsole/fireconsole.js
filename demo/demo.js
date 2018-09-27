
const CONSOLE_WIDGET = require("widget");
const JQUERY = require("widget/jquery");
const CSS = require("./style.css");
const Q = require("q");
const MD5 = require("md5");


exports.main = function (domNodeId) {

	try {

		JQUERY("<style></style>").appendTo("HEAD").html(CSS);

		if (domNodeId === null && typeof domNodeId !== "undefined") {

			return Q.resolve({
				API: {
					JQUERY: JQUERY,
					Q: Q,
					MD5: MD5
				},
				FireConsoleWidget: CONSOLE_WIDGET.Widget
			});

		} else
		if (domNodeId) {

			// We have a user that wants to do their own thing.
			var consoleWidget = new CONSOLE_WIDGET.Widget();

			return consoleWidget.attach(JQUERY("#" + domNodeId));

		} else {
			// We run the default demo.
			var consoleWidget1 = new CONSOLE_WIDGET.Widget();

			return consoleWidget1.attach(JQUERY("#console1")).then(function (context) {
				return context.fireconsole.callApi("tests.load").then(function () {

				});
			}).then(function () {
/*
				var consoleWidget2 = new CONSOLE_WIDGET.Widget();

				// TODO: Load jQuery via PINF bundler.
				return consoleWidget2.attach(JQUERY("#console2")).then(function (context) {

					return context.fireconsole.callApi("tests.load").then(function () {

					});
*/
/*
					return context.fireconsole.callApi("menu.close").then(function () {
						return context.fireconsole.callApi("view.show", {
							name: "graph"
						});
					});
*/
//				});

				return null;
			});
		}

	} catch (err) {

		console.log(err.stack);
	}
}
