
const Q = require("q");


exports.run = function (API) {

    function logSomeData () {

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
    }


    return logSomeData().then(function () {

        API.console.log("Hello World");
    });
}
