

exports.init = function (context) {

	var Q = context.API.Q;

	return context.registerApi("css.load", function (args) {

		var id = args.uri + '/' + args.cssPrefix;

		var existingStylesheetNode = $('HEAD > STYLE[fcwid="' + id + '"]');

		if (existingStylesheetNode.length === 0) {
			existingStylesheetNode = $('<link fcwid="' + id + '" rel="stylesheet" href="/renderers/' + id + '.css"/>').appendTo("HEAD");
		} else {
			// TODO: Ensure CSS has not changed. If it has reload it.
		}

	});
}

