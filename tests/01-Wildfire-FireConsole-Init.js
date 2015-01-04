

exports.run = function (API) {

	return API.fireconsole.callApi("menu.close").then(function () {

//		return API.Q.delay(250).then(function () {
			return API.fireconsole.callApi("menu.show");
//		});
	});

}

