
require('shelljs/global');
// @see http://documentup.com/arturadib/shelljs

cd(__dirname + '/..');


rm('-Rf', [
	'demo/.rt',
	'tests/.rt',
	'../harviewer/fireconsole/.rt'
]);

cd('server');
if (exec('node server.js').code !== 0) {
	echo('Error: command failed');
	exit(1);
}
