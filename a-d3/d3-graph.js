/**
 * Created by Florian on 19.03.2016.
 */
app.directive('d3Graph', ['filterFilter', function (filterFilter) {
    let createDiagram = function ($scope, elem, attrs) {
        let data = attrs.d3Data;
        let id = attrs.id;
        try {
            data = JSON.parse(data);
        } catch (e) {
            console.log(e);
            return;
        }
        if (data.length === 0 || data.nodes === undefined) return;
        let nodes = data.nodes, links = data.links, labelType = data.labelType;
        if (nodes.length === 0 || links.length === 0) {
            return;
        }
        let svg = d3.select('#' + id);

        svg.selectAll("*").remove();

        g = new dagreD3.graphlib.Graph()
            .setGraph({})
            .setDefaultEdgeLabel(function () {
                return {};
            });
//TODO Oliver
        nodes.forEach(function (d) {
            let returnedData = filterFilter(nodes, function (element) {
                console.log(element.node, d.node, element, d);
                return element.node === d.node;
            });
            console.log("returnedData", returnedData, "nodes", nodes);
            //Farben nach Knotentyp zuordnen
            if (returnedData.length > 1) {
                g.setNode(d.type, {label: d.type + " (" + d.cnt + ")", style: "fill: #FA9393"});
            }//Wenn ein Typ Inner & End ist (evtl extra Farbe einführen: #EEC591)
            else if (returnedData[0].nodetype == "start") {
                g.setNode(d.type, {label: d.type + " (" + d.cnt + ")", style: "fill: #93FA97"});
            }
            else if (returnedData[0].nodetype == "end") {
                g.setNode(d.type, {label: d.type + " (" + d.cnt + ")", style: "fill: #FA9393"});
            }
            else if (returnedData[0].nodetype == "inner") {
                g.setNode(d.type, {label: d.type + " (" + d.cnt + ")"});
            }
        });

        links.forEach(function (d) {
            if (labelType == "cnt")
                g.setEdge(d.from, d.to, {lineInterpolate: 'basis', label: d.cnt});
            else if (labelType == "sec")
                g.setEdge(d.from, d.to, {lineInterpolate: 'basis', label: d.deltaSec});
        });

        //Kanten der Nodes abrunden
        g.nodes().forEach(function (v) {
            var node = g.node(v);
            node.rx = node.ry = 5;
        });
        let render = new dagreD3.render();
        let svgGroup = svg.append("g");
        render(d3.select("svg g"), g);


        //Zentrieren
        let offset = (svg.attr("width") - g.graph().width) / 2;
        svgGroup.attr("transform", "translate(" + offset + ", 50)");


        //Zoomen
        d3.select("svg")
            .call(d3.behavior.zoom().on("zoom", function () {
                svg.select("g")
                    .attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
            }));
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
}]);