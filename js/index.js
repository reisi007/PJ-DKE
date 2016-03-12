"use strict";
/**
 * Created by Florian on 12.03.2016.
 */

let app = angular.module('PjDke', ['D3js']);
app.controller('TestController', ['$scope', '$http', function ($scope, $http) {
  $scope.graphData = {};
  $http({
    method: 'GET',
    url: 'test.json'
  }).then(function onComplete(res) {
    $scope.graphData = res.data;
  }, function onError(res) {
    console.log(JSON.stringify(res))
  });
}]);