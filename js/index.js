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
    $scope.labeltype = 'Count';

    $scope.reset = function () {
        location.reload();
    };
    let oldVariant = null, oldPercentage = null;
    $scope.update = function () {
        console.log('Update (nocheck)');
        if (!$scope.rawData) return;
        let performUpdate = function (rawData) {
            //TODO
            const labelType = $scope.labeltype;
        };
        let variant = $scope.variant;
        if (variant) {
            if (variant !== oldVariant) {
                oldVariant = variant;
                oldPercentage = null;
                api.widthIds(variant, performUpdate);
            }
        } else {
            let percentage = $scope.minCoverage;
            if (percentage !== oldPercentage) {
                oldVariant = null;
                oldPercentage = percentage;
                api.withPerc(percentage, performUpdate)
            }
        }
        performUpdate($scope.rawData);
    };

    $scope.$watch('rawData', watchUpdate);
    $scope.$watch('labeltype', watchUpdate);
    $scope.$watch('minCoverage', watchUpdate);

    $scope.update();

    function watchUpdate(newV, oldV) {
        $scope.update();
    }
}]);


app.factory('api', ['$http', function ($http) {
    function call(data) {
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
        })
    }

    let percentage = function (percentage, onSuccess) {
        call({percentage: percentage}).then(function (res) {
            console.log('Response');
            console.log(res);
            onSuccess(res);
        }, function (res) {
            console.log('Error: ' + JSON.stringify(res));
        })
    };
    let withIds = function (idString, onSuccess) {
        call({id: idString}).then(function (res) {
            console.log('Response');
            console.log(res);
            onSuccess(res);
        }, function (res) {
            console.log('Error: ' + JSON.stringify(res));
        });
    };
    return {
        withPerc: percentage,
        widthIds: withIds
    }
}]);