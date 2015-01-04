
var Q = require("q");
var RENDERERS = require("renderers");
var RECEIVERS = require("receivers");
var INSIGHT_ENCODER = require("insight/encoder/default");


// TODO: Load via PINF bundler.
var $ = window.$;

// TODO: Uncomment once bundler supports bundling css files
//var WIDGET_CSS = require("./widget.css");

var widgetIndex = 0;

var Widget = exports.Widget = function () {

	var self = this;

	self.domNode = null;


    var insightEncoder = INSIGHT_ENCODER.Encoder();


	self.API = {
		Q: Q,
		console: {
			log: function () {
				var args = Array.prototype.slice.call(arguments);
				return self.logLine(new Error().stack, {}, args);
			}
		},
		// Is set below.
		wildfire: null,
		fireconsole: {
			callApi: function (name, args) {
				return self.API.wildfire.fireconsole.send({
			    	method: "callApi",
			    	args: [
			    		name,
			    		args || undefined
			    	]
			    });
		    }
		},
		insight: {
			encode: insightEncoder.encode.bind(insightEncoder)
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

	var deferred = Q.defer();

	$(window).ready(function () {

		var node = self.domNode = $('<div id="' + self.widgetId + '" class="fc-widget-console"></div>').appendTo(domNode);

		// TODO: Inject CSS into DOM by taking source from WIDGET_CSS
		if (typeof WIDGET_CSS !== "undefined") {
			throw new Error("TODO: Inject CSS into DOM by taking source from WIDGET_CSS");
		}

		return RENDERERS.bootIntoNode({
			API: {
				Q: Q
			},
			widgetIndex: self.widgetIndex,
			domNode: node
		}).then(function (loader) {

			self.loader = loader;

			function loadTests() {
				var deferred = Q.defer();

				console.log("Loading tests ...");

				// TODO: Load from remote URL.
				require.sandbox("/tests.js", function(TESTS_BUNDLE) {

					return TESTS_BUNDLE.main(self.API, function (err) {
						if (err) {
							console.error("Error running tests", err.stack);
							return deferred.reject(err);
						}
						return deferred.resolve();
					});

				}, function (err) {
					console.error("Error loading tests", err.stack);
					deferred.reject(err);
				});
				return deferred.promise;
			}

			return self.loader.callApi("menu.add.button", {
				lid: "load-tests",
				label: "Load Tests",
				command: function () {
					return loadTests();
				}
			}).then(function () {

console.log("self.loader", self.loader);


				return self.loader.registerApi("tests.load", function (args) {
					return loadTests();
				});
			});
		}).then(function () {

			return RECEIVERS.init({
				API: {
					Q: Q
				},
				callApi: self.loader.callApi.bind(self.loader)
			}).then(function (receiversApi) {

				self.API.wildfire = receiversApi.wildfire;

			});

		}).then(function () {
			return deferred.resolve(self.loader);
		}).fail(function (err) {
			console.error(err.stack);
			return deferred.reject(err);
		});
	});

	return deferred.promise;
}

