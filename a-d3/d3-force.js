/**
 * Created by Florian on 19.03.2016.
 */
ad3.directive('d3Force', ['svgTag', function (svgTag) {
    let createDiagram = function ($scope, elem, attrs) {
        let nodes = attrs.d3Nodes, links = attrs.d3Links;
        try {
            nodes = JSON.parse(nodes);
            links = JSON.parse(links);
        } catch (e) {
            console.log(e);
            return;
        }
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
            let svg = d3.select("#" + uniqueId);
            let labelAnchors = [];
            let labelAnchorLinks = [];

            nodes.forEach(function (node) {
                if (node.label === undefined) {
                    node.label = "";
                }

                labelAnchors.push({
                    node: node
                }, {
                    node: node
                });
            });

            for (let i = 0; i < nodes.length; i++) {
                labelAnchorLinks.push({
                    source: i * 2,
                    target: i * 2 + 1,
                    weight: 1
                });
            }
            let force = d3.layout.force().charge(c).linkDistance(d).size([w, h]).nodes(nodes).links(links);
            force.start();

            let force2 = d3.layout.force().nodes(labelAnchors).links(labelAnchorLinks).gravity(0).linkDistance(0).linkStrength(8).charge(-100).size([w, h]);
            force2.start();

            let link = svg.selectAll("line.link").data(links).enter().append("svg:line").attr("class", "link").style("stroke", "#CCC");

            let node = svg.selectAll("g.node").data(force.nodes()).enter().append("svg:g").attr("class", "node");
            node.append("svg:circle").attr("r", 6).style("fill", function (d) {
                return d.color;
            });
            node.call(force.drag);


            let anchorLink = svg.selectAll("line.anchorLink").data(labelAnchorLinks);

            let anchorNode = svg.selectAll("g.anchorNode").data(force2.nodes()).enter().append("g");
            anchorNode.append("circle").attr("r", 0).attr("class", "anchorNode");
            anchorNode.append("text").text(function (d, i) {
                return i % 2 == 0 ? "" : d.node.label
            });

            let updateLink = function () {
                this.attr("x1", function (d) {
                    return d.source.x;
                }).attr("y1", function (d) {
                    return d.source.y;
                }).attr("x2", function (d) {
                    return d.target.x;
                }).attr("y2", function (d) {
                    return d.target.y;
                });

            };

            let updateNode = function () {
                this.attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

            };


            force.on("tick", function () {

                force2.start();

                node.call(updateNode);

                anchorNode.each(function (d, i) {
                    if (i % 2 == 0) {
                        d.x = d.node.x;
                        d.y = d.node.y;
                    } else {
                        var b = this.childNodes[1].getBBox();

                        var diffX = d.x - d.node.x;
                        var diffY = d.y - d.node.y;

                        var dist = Math.sqrt(diffX * diffX + diffY * diffY);

                        var shiftX = b.width * (diffX - dist) / (dist * 2);
                        shiftX = Math.max(-b.width, Math.min(0, shiftX));
                        var shiftY = 5;
                        this.childNodes[1].setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
                    }
                });


                anchorNode.call(updateNode);

                link.call(updateLink);
                anchorLink.call(updateLink);

            });
        })
    };
    return {
        restrict: "E",
        link: function ($scope, elem, attrs) {
            attrs.$observe('d3Nodes', function () {
                createDiagram($scope, elem, attrs);
            });
            attrs.$observe('d3Links', function () {
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