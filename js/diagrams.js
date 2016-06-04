/**
 * Created by Florian on 19.03.2016.
 */

app.directive('ajsBar', [function () {
    return {
        restrict: 'E',
        templateUrl: 'barChart.html',
        scope: {
            data: '=chartData'
        }
    }
}]);
app.directive('ajsCoverage', [function () {
    return {
        restrict: 'E',
        templateUrl: 'coverageChart.html',
        scope: {
            data: '=chartData'
        }
    }
}]);
app.controller('CoverageController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.getActiveClass = function (routeId) {
        return ($scope.data.selectedIds.indexOf(routeId) == -1 ? 'in' : '') + 'active';
    };
    $scope.getWidth = function (base) {
        let max = $scope.data.routestats[0].coverage; // with id 1
        let result = 100 * (Math.sqrt(base / max) );
        // console.log(base, 'width in %', result);
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
            $rootScope.$broadcast('addRoute', routeId);
        } else {
            $rootScope.$broadcast('removeRoute', routeId);
        }
    }
}]);