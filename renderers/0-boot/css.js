

exports.init = function (context) {

	var Q = context.API.Q;
	var $ = context.API.JQUERY;

	return context.registerApi("css.load", function (args) {

		var id = args.uri + '/' + args.cssPrefix;

		var source = args.source.replace(/__CSS_PREFIX__/g, args.cssPrefix);

		var existingStylesheetNode = $('HEAD > STYLE[fcwid="' + id + '"]');

		if (existingStylesheetNode.length === 0) {
//			existingStylesheetNode = $('<link fcwid="' + id + '" rel="stylesheet" href="/renderers/' + id + '.css"/>').appendTo("HEAD");
			existingStylesheetNode = $('<style fcwid="' + id + '"></style>').appendTo("HEAD");
			existingStylesheetNode.html(source);
		} else {
			// TODO: Ensure CSS has not changed. If it has reload it.
		}

	});
}

