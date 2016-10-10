#!/bin/bash
# Source https://github.com/bash-origin/bash.origin
if [ -z "${BO_VERSION_NVM_NODE}" ]; then
		export BO_VERSION_NVM_NODE=5
fi
if [ -z "${BO_LOADED}" ]; then
    . "$HOME/.bash.origin"
fi
function init {
		eval BO_SELF_BASH_SOURCE="$BO_READ_SELF_BASH_SOURCE"
		BO_deriveSelfDir ___TMP___ "$BO_SELF_BASH_SOURCE"
		local __BO_DIR__="$___TMP___"


		BO_ensure_node


		if [ -z "$npm_config_argv" ]; then

				# We are NOT being called via 'npm'

				BO_resetLoaded

				pushd "$__BO_DIR__" > /dev/null
						BO_format "$VERBOSE" "HEADER" "Install fireconsole.js (`pwd`) ..."
						npm install
						BO_format "$VERBOSE" "FOOTER"
				popd > /dev/null

		else

				# We are being called via 'npm'

				pushd "$__BO_DIR__/loops" > /dev/null
						BO_format "$VERBOSE" "HEADER" "Install fireconsole.js loops (`pwd`) ..."
						npm install --unsafe-perm
						BO_format "$VERBOSE" "FOOTER"
				popd > /dev/null

				pushd "$__BO_DIR__/receivers" > /dev/null
						BO_format "$VERBOSE" "HEADER" "Install fireconsole.js receivers (`pwd`) ..."
						npm install
						BO_format "$VERBOSE" "FOOTER"
				popd > /dev/null

				pushd "$__BO_DIR__/server" > /dev/null
						BO_format "$VERBOSE" "HEADER" "Install fireconsole.js server (`pwd`) ..."
						npm install
						BO_format "$VERBOSE" "FOOTER"
				popd > /dev/null


				pushd "$__BO_DIR__" > /dev/null
						if [ ! -e ".deps" ]; then
								mkdir ".deps"
						fi
						pushd ".deps" > /dev/null
								BO_format "$VERBOSE" "HEADER" "Install fireconsole.js .deps (`pwd`) ..."
								function ensureDep {
										if [ ! -e "$2" ]; then
												git clone "$1" "$2"
										fi
										pushd "$2" > /dev/null
												npm install
										popd > /dev/null
										rm -Rf "../node_modules/$3" || true
										ln -s "../.deps/$2" "../node_modules/$3"
										deps=("${deps[@]}" "$3")
								}
								ensureDep "git@github.com:pinf-it/pinf-it-package-insight.git" "github.com~pinf-it~pinf-it-package-insight" "pinf-it-package-insight"
								ensureDep "git@github.com:pinf-it/pinf-it-program-insight.git" "github.com~pinf-it~pinf-it-program-insight" "pinf-it-program-insight"
								ensureDep "git@github.com:pinf-it/pinf-it-bundler.git" "github.com~pinf-it~pinf-it-bundler" "pinf-it-bundler"
								ensureDep "git@github.com:pinf/pinf-for-nodejs.git" "github.com~pinf~pinf-for-nodejs" "pinf-for-nodejs"
								ensureDep "git@github.com:pinf/pinf-loader-js.git" "github.com~pinf~pinf-loader-js" "pinf-loader-js"
								ensureDep "git@github.com:insight/insight.renderers.default.git" "github.com~insight~insight.renderers.default" "insight.renderers.default"
								ensureDep "git@github.com:insight/insight-for-js.git" "github.com~insight~insight-for-js" "insight-for-js"

								BO_format "$VERBOSE" "FOOTER"
						popd > /dev/null

						for name in "${deps[@]}"; do
								rm -Rf */"node_modules/$name"
								rm -Rf */*/"node_modules/$name"
						done

				popd > /dev/null

		fi
}
init "$@"
