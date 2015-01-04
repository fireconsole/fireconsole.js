

exports.run = function (API) {

	return API.fireconsole.callApi("menu.close").then(function () {

		return API.Q.delay(250).then(function () {

			return API.fireconsole.callApi("menu.show");
		});
	});

//	console.log("Running hello world main!");
//	API.console.log("Hello World");
/*
	API.wildfire.fireconsole.send({
    	my: "message"
    });
*/
}
