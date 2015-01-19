
require('shelljs/global');
// @see http://documentup.com/arturadib/shelljs

cd(__dirname + '/..');


rm('-Rf', [
	'demo/.rt',
	'tests/.rt',
	'../harviewer/fireconsole/.rt'
]);

/*
POLICY: Invocation of runtime should be done as direct as possible to avoid unnecessary processes.
*/
	require("../server/node_modules/pinf-for-nodejs").main(require("../server/server").main, module);
/*
	i.e. not like this:
	cd('server');
	if (exec('node server.js').code !== 0) {
		echo('Error: command failed');
		exit(1);
	}
*/
