
require('shelljs/global');
// @see http://documentup.com/arturadib/shelljs

cd(__dirname + '/..');


if (exec('node scripts/build.js').code !== 0) {
	echo('Error: command failed');
	exit(1);
}

// TODO: Only install if not exists.
if (exec('npm install pinf-to-github-pages').code !== 0) {
	echo('Error: command failed');
	exit(1);
}

if (exec('node_modules/.bin/pinf-publish').code !== 0) {
	echo('Error: command failed');
	exit(1);
}
