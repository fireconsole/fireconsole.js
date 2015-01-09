

exports.init = function (context) {

	var Q = context.API.Q;
	var $ = context.API.JQUERY;


	var node = $('<div id="content" previewcols="url status size timeline" class="' + context.cssPrefix + '-harviewer"></div>').appendTo(context.domNode);

	// TODO: Add layout management code to allow har viewer to be expanded, put into new window etc...

	// Load and boot harviewer plugin.
	require.sandbox("/plugins/harviewer/plugin.js", function (sandbox) {
		sandbox.main(node[0]);
	}, function (err) {
		console.error("Error loading plugin!", err.stack);
	});


	return Q.resolve();
}

