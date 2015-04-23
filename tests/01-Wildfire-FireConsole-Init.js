

exports.run = function (API) {

	return API.fireconsole.callApi("menu.close").then(function () {

//		return API.Q.delay(250).then(function () {
			return API.fireconsole.callApi("menu.show");
//		});
	}).then(function() {

		return API.console.log("01-Wildfire-FireConsole-Init");		
	});

}
