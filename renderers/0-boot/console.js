
var RENDERER = require("../renderer");


exports.init = function (context) {

	var Q = context.API.Q;

	var menuNode = $('.' + context.cssPrefix + '-menu', context.domNode);

	var viewportNode = $('<div class="' + context.cssPrefix + '-console"></div>').appendTo(context.domNode);
	var panelNode = $('<div class="' + context.cssPrefix + '-console-panel"></div>').appendTo(viewportNode);


	function redraw() {

		// TODO: Ignore multiple render calls within x time.
		// TODO: Wait a short while before issuing render.
		// TODO: Cascade render event (for resize) down the tree.

		var height = context.domNode.parent().height();

		if (menuNode.is(":visible")) {
			viewportNode.css("top", menuNode.css("height"));
			height = height - menuNode.height() - 4;
		} else {
			viewportNode.css("top", "0px");
		}

		viewportNode.height(height);

		return Q.resolve();
	}


	function logMessageToPanelNode (message) {
		try {

			RENDERER.appendMessageToNode(panelNode[0], message, {
				supervisor: {
// TODO: implement
				},
		        view: ["summary"],
		        wrapper: {
				    id: "github.com/insight/insight.renderers.default/",
				    module: "insight/wrappers/console"
				},
		        on: {
		            inspectMessage: function(message) {
		            	console.log("inspectMessage", message);
		            },
		            inspectNode: function(message, args) {
		            	console.log("inspectNode", message, args);
		            },
		            inspectFile: function(message, args) {
		            	console.log("inspectFile", message, args);
		            }
		        },
		        callback: function(domNode) {

console.log("render done", domNode);
/*
		        	// TODO: Relocate all this into domNode.templateObject.postRender();
					if(typeof message.meta["group.start"] != "undefined") {
					    // get reference to body of last added console row
					    var node = DOMPLATE_UTIL.getElementByClass(domNode, "body");

					    // insert further messages into group
					    supervisor.groupStack.push(node);
					    // expand group if requested
					    if(typeof message.meta["group.expand"] && message.meta["group.expand"]==message.meta["group"] && node.parentNode) {
					        node.parentNode.setAttribute("expanded", "true");
					    }
					}
					if(typeof message.meta["group.end"] != "undefined") {
					    var count = message.meta["group.end"];
					    if(count===true) {
					        count = 1;
					    }
					    for( var i=0 ; i<count ; i++ ) {
					        var groupStartNode = supervisor.groupStack.pop();
							if(groupStartNode.parentNode.templateObject) {
								groupStartNode.parentNode.templateObject.setCount(groupStartNode.parentNode, groupStartNode.children.length);
							}
					    }
					}
					if(typeof message.meta["expand"] != "undefined" && message.meta["expand"]) {
					    var node = DOMPLATE_UTIL.getElementByClass(domNode, "body");
					    if(node.parentNode && node.parentNode.templateObject) {
					        node.parentNode.templateObject.expandForMasterRow(node.parentNode, node);
					    }
					    else
					    	console.error("NYI - expand for message - in " + module.id);
					}
					if(typeof message.meta["actions"] != "undefined" && message.meta["actions"] == false) {
					    var node = DOMPLATE_UTIL.getElementByClass(domNode, "actions");
					    if (node)
					    	node.style.display = "none";
					}

					try {
						if (
		                    domNode.children[0] &&
		                    domNode.children[0].templateObject &&
		                    domNode.children[0].templateObject.postRender
		                ) {
							domNode.children[0].templateObject.postRender(domNode.children[0]);
		                }
					} catch(e) {
						console.warn("Error during template postRender", e, e.stack);
					}

					if (supervisor._appendMessageToNode__queue.length > 0)
					{
						doSynchronizedappendMessageToNode.apply(null, [supervisor].concat(supervisor._appendMessageToNode__queue.shift()));
					}
					else
						supervisor._appendMessageToNode__queue = false;
*/
		        }
		    });


		} catch (err) {
			console.error("Error rendering message to panel node: " + err, err.stack);
		}
	}

	return context.registerApi("console.clear", function (args) {

		panelNode.html("");

		return Q.resolve();
	}).then(function () {
		return context.registerApi("console.log", function (args) {

//			$('<div>' + JSON.stringify(args.args) + '</div>').appendTo(panelNode);

			logMessageToPanelNode({
				meta: {},
				og: args.args
			});

			return Q.resolve();
		});
	}).then(function () {
		return context.callApi("menu.add.button", {
			lid: "clear",
			label: "Clear",
			command: function () {
				return context.callApi("console.clear");
			}
		});
	}).then(function () {

		$(window).resize(function() {
			return redraw();
		});
		$(window).ready(function () {
			return setTimeout(function () {
				return redraw();
			}, 100);
		});

		viewportNode.on("show", function () {
			return setTimeout(function () {
				return redraw();
			}, 100);
		});
		menuNode.on("show", function () {
			return setTimeout(function () {
				return redraw();
			}, 100);
		});
		menuNode.on("hide", function () {
			return setTimeout(function () {
				return redraw();
			}, 100);
		});
	});

}


