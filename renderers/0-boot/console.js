

exports.init = function (context) {

	var Q = context.API.Q;

	var menuNode = $('.' + context.cssPrefix + '-menu', context.domNode);

	var viewportNode = $('<div class="' + context.cssPrefix + '-console"></div>').appendTo(context.domNode);
	var panelNode = $('<div class="' + context.cssPrefix + '-console-panel"></div>').appendTo(viewportNode);


	function redraw() {

		// TODO: Ignore multiple render calls within x time.
		// TODO: Wait a short while before issuing render.
		// TODO: Cascade render event (for resize) down the tree.

		var height = context.domNode.parent().height();

		if (menuNode.is(":visible")) {
			viewportNode.css("top", menuNode.css("height"));
			height = height - menuNode.height() - 4;
		} else {
			viewportNode.css("top", "0px");
		}

		viewportNode.height(height);

		return Q.resolve();
	}

	return context.registerApi("console.clear", function (args) {

		panelNode.html("");

		return Q.resolve();
	}).then(function () {
		return context.registerApi("console.log", function (args) {

			$('<div>' + JSON.stringify(args.args) + '</div>').appendTo(panelNode);

			return Q.resolve();
		});
	}).then(function () {

		return context.callApi("menu.add.button", {
			lid: "clear",
			label: "Clear",
			command: function () {
				return context.callApi("console.clear");
			}
		});
	}).then(function () {

		$(window).resize(function() {
			return redraw();
		});
		$(window).ready(function () {
			return setTimeout(function () {
				return redraw();
			}, 100);
		});

		viewportNode.on("show", function () {
			return setTimeout(function () {
				return redraw();
			}, 100);
		});
		menuNode.on("show", function () {
			return setTimeout(function () {
				return redraw();
			}, 100);
		});
		menuNode.on("hide", function () {
			return setTimeout(function () {
				return redraw();
			}, 100);
		});
	});

}

