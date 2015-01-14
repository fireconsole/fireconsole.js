
require('shelljs/global');
// @see http://documentup.com/arturadib/shelljs

cd(__dirname + '/..');


rm('-Rf', 'client/.rt');
cd('client');
if (exec('../server/node_modules/.bin/pinf bundle').code !== 0) {
	echo('Error: command failed');
	exit(1);
}
cd('..');


rm('-Rf', 'tests/.rt');
cd('tests');
if (exec('../server/node_modules/.bin/pinf bundle').code !== 0) {
	echo('Error: command failed');
	exit(1);
}
cd('..');
