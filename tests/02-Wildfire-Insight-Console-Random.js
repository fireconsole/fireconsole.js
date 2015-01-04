
exports.run = function (API) {

    var subData = {
        name: "value"
    };

    var data = {
        name: "value",
        func: function testFunction(arg)
        {
            return {
                key: "value"
            };
        },
        subData: JSON.stringify(subData)
    };

    var og = API.insight.encode(data, {}, {});

	return API.wildfire.insight.console.random.send(og);


//	console.log("Running hello world main!");
//	API.console.log("Hello World");
}
