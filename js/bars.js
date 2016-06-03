/**
 * Created by Florian on 19.03.2016.
 */

app.directive('d3Bar', [function () {
    return {
        restrict: 'E',
        templateUrl: 'barchart.html',
        scope: {
            data: '=d3Data'
        }
    }
}]);
app.directive('d3Range', [function () {
    return {
        restrict: 'E',
        templateUrl: 'rangeChart.html',
        scope: {
            data: '=d3Data'
        }
    }
}]);
app.controller('RangeController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.getActiveClass = function (routeId) {
        return ($scope.data.selectedIds.indexOf(routeId) == -1 ? 'in' : '') + 'active';
    };
    $scope.getWidth = function (base) {
        let max = $scope.data.routestats[0].coverage; // with id 1
        let result = 10 * Math.sqrt(100 * base / max); //100 * base / max;
        //console.log('width in %', result);
        return result + '%';
    };
    let init = true;
    $scope.$watch('data.routestats', function () {
        if (init) {
            componentHandler.upgradeDom();
        } else {
            unregister();
        }
    });
    $scope.clicked = function (routeId) {
        // console.log('clicked', routeId);
        if ($scope.data.selectedIds.indexOf(routeId) == -1) {
            $rootScope.$broadcast('addPath', routeId);
        } else {
            $rootScope.$broadcast('removePath', routeId);
        }
    }
}]);