
const PATH = require("path");
const FS = require("fs");


require('shelljs/global');
// @see http://documentup.com/arturadib/shelljs

cd(__dirname + '/..');


rm('-Rf', [
	'demo/.rt',
	'tests/.rt',
	'../harviewer/fireconsole/.rt'
]);

process.env.PINF_LOOKUP_CEILING = PATH.dirname(__dirname);

/*
POLICY: Invocation of runtime should be done as direct as possible to avoid unnecessary processes.
*/

if (FS.existsSync(PATH.join(__dirname, "../server/node_modules/pinf-for-nodejs"))) {
		require("../server/node_modules/pinf-for-nodejs").main(require("../server/server").main, module);
} else {
		require("pinf-for-nodejs").main(require("../server/server").main, module);
}
/*
	i.e. not like this:
	cd('server');
	if (exec('node server.js').code !== 0) {
		echo('Error: command failed');
		exit(1);
	}
*/
