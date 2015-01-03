
var UTIL = require("modules/util"),
    JSON = require("modules/json"),
    DOM = require("./util/dom"),
    ENCODER = require("insight/encoder/default"),
    DECODER = require("insight/decoder/default"),
    DOMPLATE_UTIL = exports.DOMPLATE_UTIL = require("domplate/util"),
    Q = require("modules/q"),
    RESOURCE = require("modules/resource");

var RELOADING = false;

var LOADER = null;
exports.setLoader = function(inst) { LOADER = inst; }

var templatePacks = {
	list: [],
	byid: {}
};

var modules = {};

var renderWrappers = {};

var externalBravoJS = null;
exports.setBravoJS = function(inst) {
	externalBravoJS = inst;
}
function getBravoJS() {
	if (externalBravoJS !== null)
		return externalBravoJS;
	return bravojs;
}

// TODO: Keep this on a supervisor level in the future
var injectedCss = {};



var Supervisor = exports.Supervisor = function() {
	this.groupStack = [];
	this.messageWrapper = null;
	this._appendMessageToNode__queue = false;
	this.on = {};
};
Supervisor.prototype.ensureCssForDocument = function(document)
{
	for (var id in injectedCss)
		DOM.importCssString(injectedCss[id], document, "devcomp-insight-css-" + id);
}
Supervisor.prototype.resetGroupStack = function()
{
	this.groupStack = [];
}
Supervisor.prototype.setMessageWrapper = function(wrapper)
{
    this.messageWrapper = wrapper;
}
Supervisor.prototype.appendMessageToNode = function(domNode, message)
{
	if (this._appendMessageToNode__queue === false)
	{
		this._appendMessageToNode__queue = [];
		doSynchronizedappendMessageToNode(this, domNode, message);
	}
	else
	if (this._appendMessageToNode__queue !== false)
		this._appendMessageToNode__queue.push([domNode, message]);
}

function doSynchronizedappendMessageToNode(supervisor, domNode, message)
{
	if(supervisor.groupStack.length>0) {
		domNode = supervisor.groupStack[supervisor.groupStack.length-1];
	    if(!domNode) {
	        throw new Error("domNode is null!");
	    }
	}

	exports.appendMessageToNode(domNode, message, {
		supervisor: supervisor,
        view: ["summary"],
        wrapper: supervisor.messageWrapper,
        on: {
            inspectMessage: function(message)
            {
            	if (typeof supervisor.on.inspectMessage !== "undefined")
            		supervisor.on.inspectMessage(message);
            },
            inspectNode: function(message, args)
            {
            	if (typeof supervisor.on.inspectNode !== "undefined")
            		supervisor.on.inspectNode(message, args);
            },
            inspectFile: function(message, args)
            {
            	if (typeof supervisor.on.inspectFile !== "undefined")
            		supervisor.on.inspectFile(message, args);
            }
        },
        callback: function(domNode)
        {
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
        }
    });
}


function ensureTemplatePacks()
{
    var PACK;

    PACK = require("templates/php/pack");
    if (!templatePacks.byid["php"])
    {
    	templatePacks.byid["php"] = PACK;
        templatePacks.list.push(PACK);
    }

    PACK = require("templates/insight/pack");
    if (!templatePacks.byid["insight"])
    {
    	templatePacks.byid["insight"] = PACK;
        templatePacks.list.push(PACK);
    }
}

var commonHelpers = {
	helpers: null,
    // NOTE: This should only be called once or with an ID to replace existing
    importCssString: function(id, css, document)
    {
    	injectedCss[id] = css;
        DOM.importCssString(css, document, "devcomp-insight-css-" + id);
    },
    util: UTIL.copy(DOMPLATE_UTIL),
    getTemplateForId: function(id)
    {
console.error("NYI - commonHelpers.getTemplateForid (in " + module.id + ")");    	
        throw new Error("NYI - commonHelpers.getTemplateForid (in " + module.id + ")");
    },
    getTemplateModuleForNode: function(node)
    {
    	try {
	        ensureTemplatePacks();
	        var found;

	        var og = node.getObjectGraph(),
	        	ogNode = og.origin,
	        	meta = og.meta;

	        // Match message-based renderers
	        if (node === ogNode && meta && meta.renderer)
	        {
        		if (!node.meta) node.meta = {};
	        	var pack = false;
	        	var id = "http://registry.pinf.org/cadorn.org/renderers/packages/insight/0";
	        	if (meta.renderer.substring(0, id.length+1) === id + ":")
	        	{
	        		if (node === node.getObjectGraph().getOrigin())
	        			node.meta.renderer = meta.renderer.substring(id.length+1);
	        		pack = "insight";
	        	}
	        	if (pack)
	        		found = templatePacks.byid[pack].getTemplateForNode(node);
	        	else
	        		console.warn("Unknown renderer: " + meta.renderer);
	        }

	        // Match message-based language primitives
	        if (!found && meta && meta["lang.id"])
	        {
	        	if (meta["lang.id"] == "registry.pinf.org/cadorn.org/github/renderers/packages/php/master")
	        	{
	        		found = templatePacks.byid["php"].getTemplateForNode(node);
	        		if (!found)
	        		{
	        			// lookup in default language pack
	            		found = templatePacks.byid["insight"].getTemplateForNode(node);
	        		}
	        	}
	        	else
	        		throw new Error("Unknown language ID: " + meta["lang.id"]);
	        }
	        else
	    	if (!found)
	        {
		        for (var i=templatePacks.list.length-1 ; i>=0 ; i--)
		        {
		            if (typeof templatePacks.list[i].getTemplateForNode == "function" &&
		                (found = templatePacks.list[i].getTemplateForNode(node)))
		                break;
		        }
	        }
	        if (!found)
	        {
	            console.error("ERROR: Template for node '" + node.type + "' not found! (in " + module.id + ")", node);
	            return false;
	        }
	        return found;
    	} catch(e) {
    		console.error("Error getting template for node", e, node);
    	}
    },
    getTemplateForNode: function(node)
    {
        var template = commonHelpers.getTemplateModuleForNode(node);
        if(!template)
            return false;
        try {
        	return template.getTemplate(this.helpers);
        } catch(e) {
        	console.warn("Error getting template", e);
        }
    },
    getResourceBaseUrl: function(module)
    {
    	var bravojs = getBravoJS();
    	if (/^memory:\/\//.test(bravojs.url))
    	{
    		var pathId = module._id.split("@/")[0];		// TODO: Don't use _id here
    		
    		var m = pathId.match(/devcomp\/data\/packages\.jar!\/(.*)$/),
    			url;
    		if (m)
    		{
    			// we are bundled    		    
    			url = "resource://" + LOADER.getAPI().ENV.platformOptions.jetpackID.replace("@", "-at-") + "-i-packages" + "/" + m[1] + "/resources/";
    		} else
    		if (pathId.charAt(0) === "/") {
    			// we are in dev
    			url = "file://" + pathId + "/resources/";
    		} else
    			throw new Error("Cannot get URL for: " + module.pkgId);
    		return url;
    	}
    	else
    	{
            return RESOURCE.forPackage(module).getResourceBaseUrl();//bravojs.url.match(/^(\w*:\/)\//)[1] + pkgId + "@/resources/";
    	}
    },
    logger: {
        log: function()
        {
            console.log.apply(console, arguments);            
        },
        error: function()
        {
            console.error.apply(console, arguments);            
        }
    }
};
commonHelpers.util.merge = function(obj1, obj2)
{
    if(!obj1) return obj2;
    if(!obj2) return obj1;
    return UTIL.update(obj1, obj2);
}


exports.replaceMessageForNode = function(node, message, options)
{
	try {
		return renderMessage(node, message, options, "replace");
	} catch(e) {
		console.error("Error rendering message", e);
		throw e;
	}
}

exports.appendMessageToNode = function(node, message, options)
{
	try {
		return renderMessage(node, message, options, "append");
	} catch(e) {
		console.error("Error rendering message", e);
		throw e;
	}
}

exports.replaceNodeForNode = function(domNode, node, options)
{
	try {
		return renderMessage(domNode, {
			node: node
		}, options, "replace");
	} catch(e) {
		console.error("Error rendering message", e);
		throw e;
	}
}

function renderMessage(domNode, message, options, mode)
{
    options = options || {};
    options.view = options.view || ["summary"];
    options.on = options.on || {};

    var helpers = UTIL.copy(commonHelpers);
    helpers.helpers = helpers;
    helpers.document = domNode.ownerDocument;
    helpers.dispatchEvent = function(name, args)
    {
        if (typeof options.on[name] != "undefined")
            options.on[name](args[1].message, args[1].args);
    };

    message = UTIL.copy(message);

    if (typeof message.meta == "string")
        message.meta = JSON.decode(message.meta);

    if (typeof message == "string")
    {
        if (mode == "append")
        {
            var div = domNode.ownerDocument.createElement("div");
            div.setAttribute("class", "message");
            div.innerHTML = message;
            domNode.appendChild(div);
        }
        else
        if (mode == "replace")
        {
        	domNode.innerHTML = message;
        }
        else
            throw new Error("NYI");
        return;
    }

    if (typeof message.og == "undefined" && typeof message.node == "undefined")
    {
        if (typeof message.data != "undefined")
        {
            // we have data set but no template. try and determine which template to use.
            var encoder = ENCODER.Encoder();
            message.og = encoder.encode(message.data, {}, {});
        }
        else
            throw new Error("NYI");
    }

    if (typeof message.og == "string")
    {
    	message.originalOg = message.og;
        message.og = DECODER.generateFromMessage({
        	meta: message.meta,
            data: message.og
        }, DECODER.EXTENDED);
        message.meta = message.og.getMeta();
    }

    if (typeof message.og == "object")
    {
    	message.og.setMeta(message.meta);
    	message.og.message = message;
    }

    if (typeof message.ogPath !== "undefined")
    {
    	return renderMessage(domNode, {
			node: message.og.nodeForPath(message.ogPath)
		}, options, "replace");
    }
    
    if (typeof message.template == "undefined")
    {
        if (typeof message.og == "object")
        {
            var template = helpers.getTemplateModuleForNode(message.og.getOrigin());
            if (!template)
                throw new Error("Unable to locate template for ObjectGraph!");
            message.template = template.getTemplateLocator();
        }
        else
        if (typeof message.node != "undefined")
        {
            var template = helpers.getTemplateModuleForNode(message.node);
            if (!template)
                throw new Error("Unable to locate template for node!");
            message.template = template.getTemplateLocator();
        }
        else
            throw new Error("NYI");
    }

    if (typeof message.template != "undefined")
    {
        // ASSUMPTION: module.mappings["templates"] resolves to 'github.com/pinf/insight-renderer-templates/' package
        // TODO: Arbitrary template loading via authorization callback
        if (typeof message.template.id != "undefined" && message.template.id != "github.com/pinf/insight-renderer-templates/")
            throw new Error("Only templates from 'github.com/pinf/insight-renderer-templates/' are supported at this time!");

        function render(template)
        {
            var div;

            if (mode == "append")
            {
                div = domNode.ownerDocument.createElement("div");
                div.setAttribute("class", "message");
            }
            else
            if (mode == "replace")
            {
                div = domNode;
                div.innerHTML = "";
            }
            else
                throw new Error("NYI");

            function renderWrapped(div, view)
            {
            	// Nothing to render for groups. Child nodes have already been inserted.
            	// TODO: Maybe do not insert child nodes until expanding?
            	if (message.meta && typeof message.meta["group.start"] !== "undefined" && message.meta["group.start"])
            		return;

            	options = UTIL.copy(options);
                if (typeof view != "undefined")
                    options.view = view;

                if (typeof options.view != "array")
                    options.view = [options.view];

                if (typeof message.og != "undefined")
                {
                    if (typeof template.renderObjectGraphToNode == "undefined")
                        throw new Error("Template module '" + message.template.module + "' from '" + message.template.id + "' does not export 'renderObjectGraphToNode'!");
                    template.renderObjectGraphToNode(message.og.getOrigin(), div, options, helpers);
                }

/*
                else
                if (typeof message.data != "undefined")
                {
                    if (typeof template.renderDataToNode == "undefined")
                        throw new Error("Template module '" + message.template.module + "' from '" + message.template.id + "' does not export 'renderDataToNode'!");
                    template.renderDataToNode(message.data, div, options, helpers);
                }
*/
                else
                    throw new Error("NYI");
            }

            if (mode == "append")
            {
            	domNode.appendChild(div);
            }
            
            if (typeof options.wrapper != "undefined")
            {
                if (options.wrapper.id != "github.com/pinf/insight-renderer-templates/")
                    throw new Error("Only wrappers from 'github.com/pinf/insight-renderer-templates/' are supported at this time!");

                function doRenderWrapped(id)
                {
                	message.render = renderWrapped;
                	try {
                		message.template = template.getTemplate(helpers);
                	} catch(e) {
                		console.warn("Error getting template", e);
                	}
                	message.meta = message.meta || {};

                	try {
                		require(id).renderMessage(message, div, options, helpers);
                	} catch(e) {
                		console.warn("Error rendering message", e);
                	}

                	if (typeof options.callback === "function")
                    	options.callback(div);
                }

                var wrapperId = require.id("templates/" + options.wrapper.module, true);

                if (renderWrappers[wrapperId] && Q.isPromise(renderWrappers[wrapperId]))
                {
					Q.when(renderWrappers[wrapperId], doRenderWrapped);
                }
                else
                if (renderWrappers[wrapperId] || require.isMemoized(wrapperId))
            	{
                	doRenderWrapped(wrapperId);
            	}
                else
                {
                	var result = Q.defer();                	
                    module.load("templates/" + options.wrapper.module, function(id)
                    {
                    	doRenderWrapped(id);
                    	renderWrappers[wrapperId] = true;
                    	result.resolve(id);
                    });
                    renderWrappers[wrapperId] = result.promise;
                }
            }
            else
                renderWrapped(div);
        }

        if (typeof message.template.getTemplate == "function")
        {
            render(message.template.getTemplate());
            return;
        }

        var tplId = message.template.id + "|" + message.template.module;
        
        if (modules[tplId] && RELOADING)
        {
            // TODO: This can probably move down to remove modules right after included as in "comm"
            // remove all modules for this template from previous loads
            modules[tplId][0].forEach(function(id)
            {
                delete getBravoJS().pendingModuleDeclarations[id];
                delete getBravoJS().requireMemo[id];
            });
            delete modules[tplId];
        }

        if (!modules[tplId])
        {
            modules[tplId] = [Object.keys(getBravoJS().pendingModuleDeclarations).concat(Object.keys(getBravoJS().requireMemo))];

            module.load("templates/" + message.template.module, function(id)
            {
            	var template = modules[tplId][1] = require(id);

                if (typeof template.getTemplatePack == "function")
                {
                    var templatePack = template.getTemplatePack();
                    if (templatePacks.list.indexOf(templatePack) === -1)
                        templatePacks.list.push(templatePack);
                }

                render(template);

                // compute all newly added modules
                modules[tplId][0] = Object.keys(getBravoJS().pendingModuleDeclarations).concat(Object.keys(getBravoJS().requireMemo)).filter(function(id)
                {
                    return (modules[tplId][0].indexOf(id) === -1);
                });
            });
        }
        else
            render(modules[tplId][1]);
    }
    else
        throw new Error("NYI");
}
