/**
 * Created by Florian on 19.03.2016.
 */
ad3.directive('d3Force', ['svgTag', function (svgTag) {
    let createDiagram = function ($scope, elem, attrs) {
        let data = attrs.d3Data;
        try {
            data = JSON.parse(data);
        } catch (e) {
            console.log(e);
            return;
        }
        if (data.length === 0) return;
        /*console.log("d3Force");
         console.log(data);*/
        let nodes = data.nodes, links = data.links, labelType = data.labelType;
        if (nodes.length === 0 || links.length === 0) {
            return;
        }

        const defaultW = 960;
        const defaultH = 500;
        const defaultCharge = 200;
        const defaultLinkDist = 40;
        let w = $scope.width = (attrs.width === undefined) ? defaultW : attrs.width;
        let h = $scope.height = (attrs.height === undefined) ? defaultW : attrs.height;
        let c = -defaultCharge;
        if (attrs.charge !== undefined) {
            let tmp = parseFloat(attrs.charge);
            if (!isNaN(tmp)) {
                c = -tmp;
            }
        }
        let d = defaultLinkDist;
        if (attrs.distance !== undefined) {
            let tmp = parseFloat(attrs.distance);
            if (!isNaN(tmp)) {
                d = tmp;
            }
        }

        let labelDistance = 0;
        svgTag(elem, w, h).then(function (uniqueId) {
            let svg = d3.select('#' + uniqueId);
        })
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
            attrs.$observe('charge', function () {
                createDiagram($scope, elem, attrs);
            });
            attrs.$observe('distance', function () {
                createDiagram($scope, elem, attrs);
            });
        }
    }
}]);