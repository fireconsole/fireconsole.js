#!/bin/sh

# @credit http://stackoverflow.com/a/246128/330439
if [ -n "$BASH_SOURCE" ]; then
	SOURCE="${BASH_SOURCE[0]:-$0}"
else
	SOURCE=""
fi
while [ -h "$SOURCE" ]; do
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE"
done
BASE_PATH="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
if [ -n "$BASH_SOURCE" ]; then
	BASE_PATH="$( dirname "$BASE_PATH" )"
fi
cd $BASE_PATH



. $BASE_PATH/bin/activate.sh



echo "INSTALL IN: `pwd`"
npm install

cd loops
echo "INSTALL IN: `pwd`"
npm install --unsafe-perm
# TODO: Remove this once pinf-it-bundler finds dependency up the tree.
if [ ! -e "node_modules/insight-for-js/node_modules/fp-modules-for-nodejs" ]; then
	ln -s ../../fp-modules-for-nodejs node_modules/insight-for-js/node_modules/fp-modules-for-nodejs
fi
cd ..

cd receivers
echo "INSTALL IN: `pwd`"
npm install
#if [ ! -e "node_modules/wildfire-for-js/node_modules/fp-modules-for-nodejs" ]; then
#	ln -s ../../fp-modules-for-nodejs node_modules/wildfire-for-js/node_modules/fp-modules-for-nodejs
#fi
cd ..

cd server
echo "INSTALL IN: `pwd`"
npm install
cd ..

