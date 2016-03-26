"use strict";
/**
 * Created by Florian on 12.03.2016.
 */

let app = angular.module('PjDke', ['D3js']);
app.controller('TestController', ['$scope', 'api', function ($scope, api) {
    $scope.rawData = undefined;
    $scope.graphData = [];
    $scope.boxplotData = [];
    $scope.barchartData = [];
    $scope.labeltype = 'Count';

    $scope.reset = function () {
        location.reload();
    };
    let oldVariant = null, oldPercentage = null, oldLabel = null;
    $scope.update = function () {
        let performUpdate = function (rawData) {
            const labelType = $scope.labeltype;
            if (labelType === undefined || rawData === undefined) return;
            $scope.graphData = {
                nodes: rawData.nodes,
                links: rawData.links,
                labelType: labelType
            };
            $scope.barchartData = rawData.nodestat;
            $scope.boxplotData = {
                selectedIds: rawData.ids,
                routestats: rawData.routestat
            }
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
            if (percentage !== undefined && percentage !== oldPercentage) {
                oldVariant = null;
                oldPercentage = percentage;
                api.withPerc(percentage, performUpdate)
            }
        }
        let labelType = $scope.labeltype;
        if (labelType !== oldLabel) {
            performUpdate($scope.rawData);
            oldLabel = labelType;
        }
    };

    $scope.$watch('rawData', watchUpdate);
    $scope.$watch('variant', watchUpdate);
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
        call({percentage: percentage}).then(function onSucc(res) {
            onSuccess(res.data);
        }, function (res) {
            console.log('Error: ' + JSON.stringify(res));
        })
    };
    let withIds = function (idString, onSuccess) {
        call({id: idString}).then(function onSuc(res) {
            onSuccess(res.data);
        }, function onErr(res) {
            console.log('Error: ');
            console.log(res);
        });
    };
    return {
        withPerc: percentage,
        widthIds: withIds
    }
}]);