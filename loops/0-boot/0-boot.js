

exports.init = function (context) {

	var Q = context.API.Q;

	var done = Q.resolve();
	[
		require("./css"),
		require("./sandbox")
	].forEach(function (renderer) {
		done = Q.when(done, function () {
			return renderer.init(context);
		});
	});
	return done;
}

