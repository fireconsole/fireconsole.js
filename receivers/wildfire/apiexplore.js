
var MD5 = require("md5");


var Client = module.exports = function (_context, _api) {
	var self = this;

	self._context = _context;
	self.api = _api;

	self.send = _api.wildfire.insight.console.random.send;
}

Client.prototype.context = function (meta, actions, snapshot, options) {
	var self = this;
	options = options || {};
	var contextId = MD5(JSON.stringify(meta));


	// Swap out callbacks as we may cross process boundaries.
	// HACK: Use wildfire or other protocol to communicate events instead of shared memory method.
	if (!window._fireconsole_apiexplorer_callbacks) {
		window._fireconsole_apiexplorer_callbacks = {};
	}
	if (!window._fireconsole_apiexplorer_callbacks[contextId]) {
		window._fireconsole_apiexplorer_callbacks[contextId] = {};
	}
	Object.keys(actions).forEach(function (id) {
		window._fireconsole_apiexplorer_callbacks[contextId][id] = actions[id].command;
		actions[id].command = "window._fireconsole_apiexplorer_callbacks['contextId']['actionId']";
	});


	return self.send(self._context.API.insight.encode({
        __fc_node_id: "apiexplore-context-id-" + contextId,
        __fc_tpl_id: "insight.renderers.default/apiexplore/layer",
        __fc_parent_node_id: options.__fc_parent_node_id || "",
        action: "context",
        contextId: contextId,
		meta: meta,
		actions: actions,
		snapshot: snapshot
	}, {}, {})).then(function () {
		var messageIndex = 0;
		return {
			context: function (meta, actions, snapshot) {
				return self.context(meta, actions, snapshot, {
					__fc_parent_node_id: "apiexplore-context-id-" + contextId
				});
			},
			update: function (snapshot) {
				return self.send(self._context.API.insight.encode({
					__fc_parent_node_id: "apiexplore-context-id-" + contextId,
			        __fc_node_id: "apiexplore-context-id-" + contextId + "-" + (++messageIndex),
			        action: "update",
					snapshot: snapshot
				}, {}, {}))
			},
			request: function (info) {
				var nodeId = "apiexplore-context-id-" + contextId + "-" + (++messageIndex);
				return self.send(self._context.API.insight.encode({
					__fc_parent_node_id: "apiexplore-context-id-" + contextId,
			        __fc_node_id: nodeId,
			        __fc_tpl_id: "insight.renderers.default/apiexplore/request",			        
			        action: "request",
					info: info
				}, {}, {})).then(function () {
					return nodeId;
				});
			},
			response: function (requestId, info) {
				return self.send(self._context.API.insight.encode({
					__fc_parent_node_id: requestId,
			        __fc_node_id: "apiexplore-context-id-" + contextId + "-" + (++messageIndex),
			        __fc_tpl_id: "insight.renderers.default/apiexplore/response",			        
			        action: "response",
			        requestId: requestId,
					info: info
				}, {}, {}))
			},
			destroy: function () {
				delete window._fireconsole_apiexplorer_callbacks[contextId];
				return self.send(self._context.API.insight.encode({
					__fc_parent_node_id: "apiexplore-context-id-" + contextId,
			        __fc_node_id: "apiexplore-context-id-" + contextId + "-" + (++messageIndex),
			        action: "destroy"
				}, {}, {}))
			}
		};
	});
}

