/**
 * Created by Florian on 19.03.2016.
 */

ad3.directive('d3Bar', ['divTag', function (divTag) {
    return {
        restrict: 'E',
        templateUrl: 'barchart.html',
        scope: {
            data: '=d3Data'
        }
    }
}]);
ad3.directive('d3Range', ['svgTag', function (svgTag) {
    return {
        restrict: 'E',
        templateUrl: 'rangeChart.html',
        scope: {
            data: '=d3Data'
        }
    }
}]);
ad3.controller('RangeController', ['$scope', function ($scope) {
    $scope.$watch('data', function (o, n) {
        console.log(n);
    });
    $scope.getActiveClass = function (routeId) {
        return ($scope.data.selectedIds.indexOf(routeId) == -1 ? 'in' : '') + 'active';
    };
    $scope.getWidth = function (base) {
        return Math.sqrt(base * 50000) + 'px';
    }
}]);