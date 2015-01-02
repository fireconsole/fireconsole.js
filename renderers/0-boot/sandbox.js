

exports.init = function (context) {

	var Q = context.API.Q;

	var sandboxNode = $('<div class="' + context.cssPrefix + '-sandbox"></div>').appendTo(context.domNode);


	var ctx = {};
	for (var name in context) {
		ctx[name] = context[name];
	}
	ctx.domNode = sandboxNode;


	var currentView = false;
	function showView (name) {
		if (currentView) {
			$('DIV.' + context.cssPrefix + '-sandbox > DIV.' + context.cssPrefix + '-' + currentView, ctx.domNode.parent()).hide();
		}
		currentView = name;
		$('DIV.' + context.cssPrefix + '-sandbox > DIV.' + context.cssPrefix + '-' + name, ctx.domNode.parent()).show();
		return Q.resolve();
	}
	function addView (name, renderer) {
		return renderer.init(ctx).then(function () {
			$('DIV.' + context.cssPrefix + '-sandbox > DIV.' + context.cssPrefix + '-' + name, ctx.domNode.parent()).hide();
			return context.callApi("menu.add.button", {
				lid: "view-" + name,
				label: "View: " + name,
				command: function () {
					return showView(name);
				}
			});
		}).then(function () {
			return showView("console");
		});
	}



	var done = Q.resolve();
	[
		require("./menu")
	].forEach(function (renderer) {
		done = Q.when(done, function () {
			return renderer.init(ctx);
		});
	});
	return Q.when(done, function () {

		return addView("console", require("./console")).then(function () {

			return addView("graph", require("./graph"));

		}).then(function () {

			return showView("console");
		});
	});
}

