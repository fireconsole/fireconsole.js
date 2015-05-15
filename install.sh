#!/bin/bash
# Source https://github.com/cadorn/bash.origin
. "$HOME/.bash.origin"
function init {
	eval BO_SELF_BASH_SOURCE="$BO_READ_SELF_BASH_SOURCE"
	BO_deriveSelfDir ___TMP___ "$BO_SELF_BASH_SOURCE"
	local __BO_DIR__="$___TMP___"


	BO_checkVerbose "VERBOSE" "$@"


#	pushd "$__BO_DIR__/.." > /dev/null
#		BO_log "$VERBOSE" "Install using npm in: `pwd`"
#		npm install
#	popd > /dev/null


	pushd "$__BO_DIR__/loops" > /dev/null
		BO_log "$VERBOSE" "Install using npm in: `pwd`"
		npm install --unsafe-perm
	popd > /dev/null

	pushd "$__BO_DIR__/receivers" > /dev/null
		BO_log "$VERBOSE" "Install using npm in: `pwd`"
		npm install
	popd > /dev/null

	pushd "$__BO_DIR__/server" > /dev/null
		BO_log "$VERBOSE" "Install using npm in: `pwd`"
		npm install
	popd > /dev/null

}
init $@
