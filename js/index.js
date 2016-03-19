"use strict";
/**
 * Created by Florian on 12.03.2016.
 */

let app = angular.module('PjDke', ['D3js']);
app.controller('TestController', ['$scope', 'api', function ($scope, api) {
    $scope.rawData = undefined;
    $scope.nodes = [];
    $scope.links = [];
    //TODO fill those
    $scope.boxplotData = [];
    $scope.barchartData = [];
    api({variant: 0}).then(function onComplete(res) {
        $scope.rawData = res;
    }, function onError(res) {
        console.log(JSON.stringify(res))
    });

    $scope.reset = function () {
        //TODO
        console.log("RESET");
        const raw = $scope.rawData;
        $scope.nodes = raw.nodes;
        $scope.links = raw.links;
    }
}]);
app.factory('api', ['$http', function ($http) {
    return function (data) {
        let url = 'data.php';
        return $http({
            method: 'POST',
            url: url,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function (obj) {
                let str = [];
                for (let p in data)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: data
        }).then(function (res) {
            console.log('Respnse');
            console.log(res.data);
        });
    };
}]);