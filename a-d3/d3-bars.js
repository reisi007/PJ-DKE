/**
 * Created by Florian on 19.03.2016.
 */
ad3.directive('d3Bar', ['svgTag', function (svgTag) {
    let createDiagram = function ($scope, elem, attrs) {
        const defaultW = 200;
        const defaultH = 200;
        let w = $scope.width = (attrs.width === undefined) ? defaultW : attrs.width;
        let h = $scope.height = (attrs.height === undefined) ? defaultW : attrs.height;
        let data = attrs.d3Data;
        try {
            data = JSON.parse(data);
        } catch (e) {
            console.log(e);
            return;
        }
        svgTag(elem, w, h).then(function (uniqueId) {
            let svg = d3.select('#' + uniqueId);
            //TODO d3 stuff
        });
    };
    return {
        restrict: "E",
        link: function ($scope, elem, attrs) {
            attrs.$observe('d3Data', function () {
                createDiagram($scope, elem, attrs);
            });
            attrs.$observe('width', function () {
                createDiagram($scope, elem, attrs);
            });
            attrs.$observe('height', function () {
                createDiagram($scope, elem, attrs);
            });
        }
    }
}]);
ad3.directive('d3Boxplot', ['svgTag', function (svgTag) {
    let createDiagram = function ($scope, elem, attrs) {
        const defaultW = 200;
        const defaultH = 200;
        let w = $scope.width = (attrs.width === undefined) ? defaultW : attrs.width;
        let h = $scope.height = (attrs.height === undefined) ? defaultW : attrs.height;
        let data = attrs.d3Data;
        try {
            data = JSON.parse(data);
        } catch (e) {
            console.log(e);
            return;
        }
        svgTag(elem, w, h).then(function (uniqueId) {
            let svg = d3.select('#' + uniqueId);
            //TODO d3 stuff
        });
    };
    return {
        restrict: "E",
        link: function ($scope, elem, attrs) {
            attrs.$observe('d3Data', function () {
                createDiagram($scope, elem, attrs);
            });
            attrs.$observe('width', function () {
                createDiagram($scope, elem, attrs);
            });
            attrs.$observe('height', function () {
                createDiagram($scope, elem, attrs);
            });
        }
    }
}]);