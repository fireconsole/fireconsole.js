
require('shelljs/global');
// @see http://documentup.com/arturadib/shelljs

cd(__dirname + '/..');


if (exec('node_modules/.bin/pinf-publish').code !== 0) {
	echo('Error: command failed');
	exit(1);
}
