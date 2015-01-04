
const Q = require("q");


function runTest (API, name) {
	console.log("Running test '" + name + "' ...")
	var deferred = Q.defer();

	function loadModule (callback) {
		if (name === "01-Wildfire-FireConsole-Init") {
			return callback(null, require("./01-Wildfire-FireConsole-Init"));
		} else
		if (name === "02-Wildfire-Insight-Console-Random") {
			return callback(null, require("./02-Wildfire-Insight-Console-Random"));
		} else {
			return callback(new Error("Action: You need to add 'require(\"./" + name + "\")' to this module!"));
		}
		// TODO: Use async loading once fixed in bundler (pinf-it-bundler)
		/*
		return require.async("./" + name, function (MODULE_API) {
			return callback(null, MODULE_API);
		}, function (err) {
			console.log("Error loading test '" + name + "'", err.stack);
			return callback(err);
		});
		*/
	}

	loadModule(function (err, MODULE_API) {
		if (err) throw err;

		return MODULE_API.run(API).then(function () {
			console.log("Test '" + name + "' done!")
			return deferred.resolve();
		}).fail(function (err) {
			console.error("Error running test '" + name + "'", err.stack);
			return deferred.reject(err);
		});
	});
	return deferred.promise;
}


exports.main = function (API, callback) {

	var done = Q.resolve();

	console.log("Running tests ...");

	[
		"01-Wildfire-FireConsole-Init",
		"02-Wildfire-Insight-Console-Random"
	].forEach(function (name) {
		return done = Q.when(done, function () {
			return runTest(API, name);
		});
	});

	return Q.when(done).then(function () {

		console.log("Tests done!");

	}).then(function () {
		return callback(null);
	}, callback);
}

