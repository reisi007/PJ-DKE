/**
 * Created by Florian on 19.03.2016.
 */
app.directive('d3Graph', function () {
    let createDiagram = function ($scope, elem, attrs) {
        let data = attrs.d3Data;
        let id = attrs.id;
        try {
            data = JSON.parse(data);
        } catch (e) {
            console.log(e);
            return;
        }
        if (data.length === 0) return;
        let nodes = data.nodes, links = data.links, labelType = data.labelType;
        if (nodes.length === 0 || links.length === 0) {
            return;
        }
        /*TODO d3
         * nodes -> Array of nodes
         * links -> Array of links
         * */
    };
    return {
        restrict: "A",
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
});