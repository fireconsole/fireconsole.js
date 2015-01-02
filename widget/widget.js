
var Q = require("q");
var RENDERERS = require("renderers");

// TODO: Load via PINF bundler.
var $ = window.$;

// TODO: Uncomment once bundler supports bundling css files
//var WIDGET_CSS = require("./widget.css");

var widgetIndex = 0;

var Widget = exports.Widget = function () {

	var self = this;

	self.domNode = null;

	console.log("init fireconsole console widget");

	self.API = {
		fireconsole: {
			log: function () {
				var args = Array.prototype.slice.call(arguments);
				return self.logLine(new Error().stack, {}, args);
			}
		}
	};

	self.loader = null;

	self.widgetIndex = (widgetIndex = widgetIndex + 1);
	self.widgetId = "fcwid_" + self.widgetIndex;
}

Widget.prototype.logLine = function (source, context, args) {
	return this.loader.callApi("console.log", {
		source: source,
		context: context,
		args: args
	});
}

Widget.prototype.clearAllLines = function () {
	return this.loader.callApi("console.clear");
}

Widget.prototype.attach = function (domNode) {

	var self = this;

	$(window).ready(function () {

		var node = self.domNode = $('<div id="' + self.widgetId + '" class="fc-widget-console"></div>').appendTo(domNode);

		// TODO: Inject CSS into DOM by taking source from WIDGET_CSS
		if (typeof WIDGET_CSS !== "undefined") {
			throw new Error("TODO: Inject CSS into DOM by taking source from WIDGET_CSS");
		}

		var html = [];

		html.push('<div class="fc-widget-console-viewport">');
			html.push('<div class="fc-widget-console-panel">');
			html.push('</div>');
		html.push('</div>');

		node.html(html.join("\n"));


		var menuNode = $(".fc-widget-console-menu", node);
		var viewportNode = $(".fc-widget-console-viewport", node);
		var panelNode = $(".fc-widget-console-panel", node);

		return RENDERERS.bootIntoNode({
			API: {
				Q: Q
			},
			widgetIndex: self.widgetIndex,
			domNode: panelNode
		}).then(function (loader) {

			self.loader = loader;

			return self.loader.callApi("menu.add.button", {
				lid: "load-tests",
				label: "Load Tests",
				command: function () {

					console.log("Loading tests ...");

					// TODO: Load from remote URL.
					return require.sandbox("/tests.js", function(TESTS_BUNDLE) {

						return TESTS_BUNDLE.main(self.API, function (err) {
							if (err) {
								console.error("Error running tests", err.stack);
								return;
							}
							return;
						});

					}, function (err) {
						console.error("Error loading tests", err.stack);
					});
				}
			}).then(function () {

				function redraw() {
					viewportNode.height(domNode.height() - menuNode.height() - 4);
				}
				$(window).resize(function() {
					return redraw();
				});
				return redraw();
			});
		}).fail(function (err) {
			console.error(err.stack);
		});
	});
}

