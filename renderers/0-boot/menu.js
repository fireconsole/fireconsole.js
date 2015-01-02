

exports.init = function (context) {

	var Q = context.API.Q;

	var menuNode = $('<div class="' + context.cssPrefix + '-menu"></div>').appendTo(context.domNode);

	return context.registerApi("menu.add.button", function (args) {

		var buttonNode = $('<button button="' + args.lid + '">' + args.label + '</button>').appendTo(menuNode);
		buttonNode.click(function () {
			args.command();
		});

		return Q.resolve();
	});
}

