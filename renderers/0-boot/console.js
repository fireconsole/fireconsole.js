

exports.init = function (context) {

	var Q = context.API.Q;


	var linesNode = $('<div class="' + context.cssPrefix + '-console">lines<br>lines<br>lines<br>lines<br>lines<br>lines<br>lines<br>lines<br>lines<br>lines<br>lines<br>lines<br>lines<br></div>').appendTo(context.domNode);


	return context.registerApi("console.clear", function (args) {

		linesNode.html("");

		return Q.resolve();
	}).then(function () {
		return context.registerApi("console.log", function (args) {

			$('<div>' + JSON.stringify(args.args) + '</div>').appendTo(linesNode);

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
	});

}

