#!/bin/bash
# Source https://github.com/cadorn/bash.origin
. "$HOME/.bash.origin"
function init {
	eval BO_SELF_BASH_SOURCE="$BO_READ_SELF_BASH_SOURCE"
	BO_deriveSelfDir ___TMP___ "$BO_SELF_BASH_SOURCE"
	local __BO_DIR__="$___TMP___"


	BO_checkVerbose "VERBOSE" "$@"


	pushd "$__BO_DIR__/.." > /dev/null
		BO_log "$VERBOSE" "Install using npm in: `pwd`"
		npm install
	popd > /dev/null


	pushd "$__BO_DIR__/../loops" > /dev/null
		BO_log "$VERBOSE" "Install using npm in: `pwd`"
		mkdir node_modules || true

# TODO: Use 'smi-for-npm' to install (which will link found dependencies)

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
	popd > /dev/null

	pushd "$__BO_DIR__/../receivers" > /dev/null
		BO_log "$VERBOSE" "Install using npm in: `pwd`"
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
	popd > /dev/null

	pushd "$__BO_DIR__/../server" > /dev/null
		BO_log "$VERBOSE" "Install using npm in: `pwd`"
		mkdir node_modules || true
		# TODO: Remove this once smi can install given an existing packages map. i.e. if package is found by id in map we link it instead of installing it.
		if [ -d "/opt/services/pinf-for-nodejs/live/install" ]; then
			ln -s /opt/services/pinf-for-nodejs/live/install node_modules/pinf-for-nodejs
		elif [ -d "../../../2-org.pinf/pinf-for-nodejs" ]; then
			ln -s ../../../../2-org.pinf/pinf-for-nodejs node_modules/pinf-for-nodejs
		fi
		npm install
	popd > /dev/null

}
init $@
