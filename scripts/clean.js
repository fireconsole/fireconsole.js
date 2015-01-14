
require('shelljs/global');
// @see http://documentup.com/arturadib/shelljs

cd(__dirname + '/..');


rm('-Rf', [
	'.rt',
	'demo/.rt',
	'tests/.rt',
	'../harviewer/fireconsole/.rt'
]);
