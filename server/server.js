
const PATH = require("path");
const PINF = require("pinf-for-nodejs");
const EXPRESS = require("express");
const SEND = require("send");
const HTTP = require("http");
const SASS = require("node-sass");

const PORT = process.env.PORT || 8080;

return PINF.main(function(options, callback) {

	var app = EXPRESS();

	app.get(/^\/renderers\/(.+)\/(.+)\.css$/, function (req, res, next) {

		return SASS.render({
		    file: PATH.join(__dirname, "../renderers", req.params[0], req.params[0] + ".scss"),
		    success: function (result) {
//		        console.log(result.stats);
//		        console.log(result.map)

				res.setHeader("Content-Type", "text/css");

		        return res.end(result.css.replace(/__CSS_PREFIX__/g, req.params[1]));
		    },
		    error: function (err) {
		        console.error("message", err.message);
		        console.error("code", err.code);
		        console.error("line", err.line);
		        console.error("column", err.column);
		    	return next(err);
		    },
		    includePaths: [
		    	PATH.join(__dirname, "../renderers")
		    ]
		});
	});

	app.get(/^\/widget\/(.+)$/, function (req, res, next) {
		return SEND(req, req.params[0], {
			root: PATH.join(__dirname, "../widget")
		}).on("error", next).pipe(res);
	});

	app.get(/^\/lib\/pinf-loader-js\/(.+)$/, function (req, res, next) {
		return SEND(req, req.params[0], {
			root: PATH.join(__dirname, "node_modules/pinf-for-nodejs/node_modules/pinf-loader-js")
		}).on("error", next).pipe(res);
	});

	app.get(/^\/(client.+)$/, PINF.hoist(PATH.join(__dirname, "../client/program.json"), options.$pinf.makeOptions({
		debug: true,
		verbose: true,
		PINF_RUNTIME: "",
        $pinf: options.$pinf
    })));

	app.get(/^\/(tests(?:\.js|\/.+))$/, PINF.hoist(PATH.join(__dirname, "../tests/program.json"), options.$pinf.makeOptions({
		debug: true,
		verbose: true,
		PINF_RUNTIME: "",
        $pinf: options.$pinf
    })));

	app.get(/^(\/.*)$/, function (req, res, next) {
		var path = req.params[0];		
		if (path === "/") path = "/index.html";
		return SEND(req, path, {
			root: PATH.join(__dirname, "www")
		}).on("error", next).pipe(res);
	});

	HTTP.createServer(app).listen(PORT)

	// Wait for debug output from `PINF.hoist()` to finish.
	setTimeout(function() {
		console.log("Open browser to: http://localhost:" + PORT + "/");
	}, 2 * 1000);

}, module);
