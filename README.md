widget.console
==============

Initial implementation of a dynamic console widget leveraging the [PINF JavaScript Loader](https://github.com/pinf/pinf-loader-js) to load all program components.


Demo
----

[fireconsole.github.io/widget.console](http://fireconsole.github.io/widget.console/)


Usage
-----

### Install

    bin/install.sh

### Enter Workspace

    source bin/activate.sh
    # TODO: Document env (i.e. available commands, dependency versions etc...)
    # TODO: Launch workspace editor

### Run

    npm start
    open http://localhost:8080/

### Publish to [GiHub Pages](https://pages.github.com/)

    npm run-script publish

### Other

    npm run-script build
    npm run-script clean


Directory Structure
-------------------

Upon running the *demo server*, sources from the following directorie are automatically assembled into bundles using the [pinf-it-bundler](https://github.com/pinf-it/pinf-it-bundler) build system. These bundles are then loaded and booted in the client by the [PINF JavaScript Loader](https://github.com/pinf/pinf-loader-js).

  * `/demo` - Full demo of the widget that loads the full test suite.
  * `/tests` - Full test suite of all officially supported features.
  * `/widget` - The *shell* of the widget that instructs the `/loops` to boot for a specific DOM context.
  * `/loops` - The actual implementation of the widget.
  * `/receivers` - Modules that deal with receiving data in various formats and forwarding it to the widget.
  * `/server` - Demo server for local development.
  * `/scripts` - Project toolchain scripting.
  * `/bin` - Workspace commands.


Legal
=====

  * Code: [MIT License](http://opensource.org/licenses/mit-license.php)

