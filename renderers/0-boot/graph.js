

exports.init = function (context) {

	var Q = context.API.Q;


	$('<div class="' + context.cssPrefix + '-graph">graph</div>').appendTo(context.domNode);


	return Q.resolve();
}

