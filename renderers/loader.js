
var INSIGHT_RENDERERS_DEFAULT = require("insight.renderers.default");
var RENDERER = require("./renderer");

console.log("INSIGHT_RENDERERS_DEFAULT", INSIGHT_RENDERERS_DEFAULT);
console.log("RENDERER", RENDERER);


// @see http://stackoverflow.com/a/19525797
(function ($) {
  $.each(['show', 'hide'], function (i, ev) {
    var el = $.fn[ev];
    $.fn[ev] = function () {
      this.trigger(ev);
      el.apply(this, arguments);
    };
  });
})(jQuery);


exports.bootIntoNode = function (context) {

	var loader = new Loader(context);

	return loader.load("0-boot/0-boot").then(function (context) {
		return loader.callApi("css.load", {
			uri: "0-boot",
			cssPrefix: context.cssPrefix
		}).then(function () {
			return loader;
		});
	});
}


var Loader = function(context) {
	var self = this;

	self.API = context.API;
	self.domNode = context.domNode;
	self.widgetIndex = context.widgetIndex;

	self.api = {};
}

Loader.prototype.callApi = function (id, args) {
	var self = this;
	if (!self.api[id]) {
		return self.API.Q.reject(new Error("API for id '" + id + "' not registered!"));
	}
	try {
		return self.API.Q.when(self.api[id](args));
	} catch (err) {
		return self.API.Q.reject(err);
	}
}

Loader.prototype.load = function (id) {
	var self = this;

	// TODO: Load renderers dynamically.

	return self.API.Q.resolve((function () {

		if (id === "0-boot/0-boot") {
			return require("./0-boot/0-boot");
		}

		throw new Error("ACTION: Add condition for id '" + id + "'!");

	})()).then(function (renderer) {
		try {
			var context = {
				API: self.API,
				domNode: self.domNode,
				cssPrefix: "_fcw_" + id.split("/")[0].replace(/\//g, "_"),
				registerApi: function (id, handler) {
					if (self.api[id]) {
						return self.API.Q.reject(new Error("API for id '" + id + "' already registered!"));
					}
					self.api[id] = handler;
					return self.API.Q.resolve();
				},
				callApi: function (id, args) {
					return self.callApi(id, args);
				}
			};
			return renderer.init(context).then(function () {
				return context;
			});
		} catch (err) {
			throw err;
		}
	});
}

