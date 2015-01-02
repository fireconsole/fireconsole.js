
const Q = require("q");


exports.run = function (API) {

	console.log("Running hello world main!");

	API.fireconsole.log("Hello World");

	return Q.resolve();
}

