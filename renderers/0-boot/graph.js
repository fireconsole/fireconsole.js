
var HARVIEWER = require("harviewer");


exports.init = function (context) {

	var Q = context.API.Q;
	var $ = context.API.JQUERY;


	var menuNode = $('.' + context.cssPrefix + '-menu', context.domNode);
	var graphNode = $('<div id="content" previewcols="url status size timeline" class="' + context.cssPrefix + '-graph">graph</div>').appendTo(context.domNode);


	HARVIEWER.init(graphNode[0]);


	function redraw() {

		// TODO: Ignore multiple render calls within x time.
		// TODO: Wait a short while before issuing render.
		// TODO: Cascade render event (for resize) down the tree.

		var height = context.domNode.parent().height();

		if (menuNode.is(":visible")) {
			graphNode.css("top", menuNode.css("height"));
			height = height - menuNode.height() - 4;
		} else {
			graphNode.css("top", "0px");
		}

		graphNode.height(height);

		return Q.resolve();
	}


	$(window).resize(function() {
		return redraw();
	});
	$(window).ready(function () {
		return setTimeout(function () {
			return redraw();
		}, 100);
	});

	graphNode.on("show", function () {
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


	return Q.resolve();
}

