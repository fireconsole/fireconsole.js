
const Q = require("q");


exports.run = function (API) {

    var api = API.wildfire.fireconsole.columnexplorer;

    return api.column("Databases", {
		"db1": "DB 1",
		"db2": {
			"label": "DB 2",
			"summary": {
				"summaryKey": "Summary Value"
			},
			"context": {
				"contextId": "contextValue"
			}
		},
		"db3": "DB 3"
    }, function (rowId, context) {

console.log("Clicked on db row id:", rowId, context);

	    return this.column("Tables", {
			"id1": "Table 1",
			"id2": "Table 2"
	    }, function (rowId) {

	console.log("Clicked on table row id:", rowId);

			return this.column("Queries", {
	    		"count": "Count",
	    		"all": "All"
		    }, function (rowId) {

	console.log("Clicked on queries row id:", rowId);

				return this.column("Row", {
		    		"item": {
		    			"label": {
		    				"key": {
		    					"obj": "val"
		    				}
		    			}
		    		}
			    });
		    });
	    });
    });

}
