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
mkdir node_modules || true
# TODO: Remove this once smi can install given an existing packages map. i.e. if package is found by id in map we link it instead of installing it.
if [ -d "/opt/services/domplate/live/install" ]; then
	ln -s /opt/services/domplate/live/install node_modules/domplate
elif [ -d "../../domplate" ]; then
	ln -s ../../../domplate node_modules/domplate
fi
if [ -d "/opt/services/insight-for-js/live/install" ]; then
	ln -s /opt/services/insight-for-js/live/install node_modules/insight-for-js
elif [ -d "../../insight-for-js" ]; then
	ln -s ../../../insight-for-js node_modules/insight-for-js
fi
if [ -d "/opt/services/insight.renderers.default/live/install" ]; then
	ln -s /opt/services/insight.renderers.default/live/install node_modules/insight.renderers.default
elif [ -d "../../insight.renderers.default" ]; then
	ln -s ../../../insight.renderers.default node_modules/insight.renderers.default
fi
if [ -d "/opt/services/fp-modules-for-nodejs/live/install" ]; then
	ln -s /opt/services/fp-modules-for-nodejs/live/install node_modules/fp-modules-for-nodejs
elif [ -d "../../../2-fp/fp-modules-for-nodejs" ]; then
	ln -s ../../../../2-fp/fp-modules-for-nodejs node_modules/fp-modules-for-nodejs
fi
npm install --unsafe-perm
# TODO: Remove this once pinf-it-bundler finds dependency up the tree.
if [ ! -e "node_modules/insight-for-js/node_modules/fp-modules-for-nodejs" ]; then
	ln -s ../../fp-modules-for-nodejs node_modules/insight-for-js/node_modules/fp-modules-for-nodejs
fi
cd ..

cd receivers
echo "INSTALL IN: `pwd`"
mkdir node_modules || true
# TODO: Remove this once smi can install given an existing packages map. i.e. if package is found by id in map we link it instead of installing it.
if [ -d "/opt/services/wildfire-for-js/live/install" ]; then
	ln -s /opt/services/wildfire-for-js/live/install node_modules/wildfire-for-js
elif [ -d "../../../2-io.firenode/wildfire-for-js" ]; then
	ln -s ../../../../2-io.firenode/wildfire-for-js node_modules/wildfire-for-js
fi
npm install
#if [ ! -e "node_modules/wildfire-for-js/node_modules/fp-modules-for-nodejs" ]; then
#	ln -s ../../fp-modules-for-nodejs node_modules/wildfire-for-js/node_modules/fp-modules-for-nodejs
#fi
cd ..

cd server
echo "INSTALL IN: `pwd`"
mkdir node_modules || true
# TODO: Remove this once smi can install given an existing packages map. i.e. if package is found by id in map we link it instead of installing it.
if [ -d "/opt/services/pinf-for-nodejs/live/install" ]; then
	ln -s /opt/services/pinf-for-nodejs/live/install node_modules/pinf-for-nodejs
elif [ -d "../../../2-org.pinf/pinf-for-nodejs" ]; then
	ln -s ../../../../2-org.pinf/pinf-for-nodejs node_modules/pinf-for-nodejs
fi
npm install
cd ..

