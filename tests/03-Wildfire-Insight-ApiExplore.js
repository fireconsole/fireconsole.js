
const Q = require("q");


exports.run = function (API) {


    function testApiExplorer () {

        var api = API.wildfire.fireconsole.apiexplorer;

        var meta1 = {
            "label": "Init"
        };
        var data1 = {};
        var context1 = null;


        var meta2 = {
            "label": "Authenticated"
        };
        var data2 = {};
        var context2 = null;


        data1 = {
            sid: "fake-session-id"
        };

        return api.context(meta1, {
            "login": {
                label: "Login",
                docsUrl: "https://github.com/fireconsole/widget.console",
                shouldShow: function (snapshot) {
                    return (!snapshot.uid);
                },
                command: function () {

                    return context1.request({
                        uri: "user/login",
                        data: "user/login/getData"
                    }).then(function(requestId) {

                        console.log("Login");

                        data1.uid = "user-id";
                        data1.data = {
                            that: {
                                id: {
                                    deep: true
                                }
                            }
                        };

                        return context1.response(requestId, {
                            data: {
                                uid: data1.uid
                            }
                        }).then(function() {

                            return context1.update(data1).then(function () {

                                return context1.context(meta2, {
                                    "get-user-data": {
                                        label: "Get User Data",
                                        command: function () {
                                            console.log("Get User Data!");

                                            return context2.request({
                                                uri: "get/user/data/request",
                                                data: {
                                                    userId: "userId/value"
                                                }
                                            }).then(function(requestId) {

                                                data2.userData = "user-data-" + Date.now();

                                                return context2.response(requestId, {
                                                    data: {
                                                        userData: data2.userData
                                                    }
                                                }).then(function() {

                                                    return context2.update(data2);
                                                });
                                            });
                                        }
                                    },
                                    "failed-request": {
                                        label: "Failed Request",
                                        command: function () {
                                            console.log("Failed Request!");

                                            return context2.request({
                                                uri: "failed/request",
                                                data: {
                                                    userId: "userId/value"
                                                }
                                            }).then(function(requestId) {

                                                return context2.response(requestId, {
                                                    error: 500,
                                                    data: {
                                                        error: "error/info"
                                                    }
                                                }).then(function() {

                                                    return context2.update(data2);
                                                });
                                            });
                                        }
                                    }
                                }, data2).then(function (context) {
                                    context2 = context;
                                });
                            });
                        });
                    });
                }
            },
            "logout": {
                label: "Logout",
                shouldShow: function (snapshot) {
                    return (!!snapshot.uid);
                },
                command: function () {

                    return context1.request({
                        uri: "user/logout"
                    }).then(function(requestId) {

                        console.log("Logout");

                        delete data1.uid;

                        return context1.response(requestId).then(function() {

                            return context1.update(data1).then(function () {

                                return context2.destroy();

                            });
                        });
                    });
                }
            }
        }, data1).then(function (context) {
            context1 = context;
        });
    }


    return testApiExplorer();
}
