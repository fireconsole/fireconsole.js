
var MD5 = require("md5");


var Client = module.exports = function (_context, _api) {
	var self = this;

	self._context = _context;
	self.api = _api;

	self.send = _api.wildfire.insight.console.random.send;
}

Client.prototype.column = function (meta, rows, handlers, options) {
	var self = this;
	options = options || {};
	options.depth = options.depth || 0;

	var contextId = MD5(self._context.API.id + ":" + JSON.stringify(meta));

	if (!self.contextId) {
		self.contextId = contextId;
	}

	var api = {
		column: function (meta, rows, handlers) {
			return self.column(meta, rows, handlers, {
				__fc_parent_node_id: "columnexplore-context-id-" + self.contextId,
				depth: options.depth + 1
			});
		}
	};


	// Swap out callbacks as we may cross process boundaries.
	// HACK: Use wildfire or other protocol to communicate events instead of shared memory method.
	if (!window._fireconsole_columnexplorer_callbacks) {
		window._fireconsole_columnexplorer_callbacks = {};
	}
	if (!window._fireconsole_columnexplorer_callbacks[contextId]) {
		window._fireconsole_columnexplorer_callbacks[contextId] = {};
	}
	window._fireconsole_columnexplorer_callbacks[contextId] = function (rowId) {
		try {
			if (!handlers) return;
			return handlers.call(api, rowId, (typeof rows[rowId] === "object" && rows[rowId].context) || null);
		} catch (err) {
			console.error("Error calling handler", err.stack);
			throw err;
		}
	};

	return self.send(self._context.API.insight.encode({
        __fc_node_id: "columnexplore-context-id-" + contextId,
        __fc_tpl_id: "insight.renderers.default/columnexplore/layout",
        __fc_parent_node_id: options.__fc_parent_node_id || "",
		action: "column",
        columnId: contextId,
        depth: options.depth,
        clickHandler: "window._fireconsole_columnexplorer_callbacks['columnId']",
		meta: meta,
		rows: rows
	}, {}, {})).then(function () {
		var messageIndex = 0;
		return api;
	});
}
