#!/bin/sh

# @credit http://stackoverflow.com/a/246128/330439
SOURCE="${BASH_SOURCE[0]:-$0}"
while [ -h "$SOURCE" ]; do
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE"
done
BASE_PATH="$( cd -P "$( dirname "$SOURCE" )" && pwd )"

BASE_PATH="$( dirname "$BASE_PATH" )"
cd $BASE_PATH



. $BASE_PATH/bin/activate.sh



# Only initialize once in the beginning.
if [ ! -d "node_modules" ]; then
	echo "Init submodules ..."
	git submodule update --init --recursive --rebase
else
	echo "Skip init submodules."
fi



echo "INSTALL IN: `pwd`"
npm install

cd lib/insight.renderers.default
echo "INSTALL IN: `pwd`"
npm install
cd ../..

cd loops
echo "INSTALL IN: `pwd`"
npm install
cd ..

cd receivers
echo "INSTALL IN: `pwd`"
npm install
cd ..

cd server
echo "INSTALL IN: `pwd`"
npm install
cd ..

cd widget
echo "INSTALL IN: `pwd`"
npm install
cd ..

