/**
 * Created by Florian on 19.03.2016.
 */
app.directive('d3Graph', ['parseDuration', function (parseDuration) {
    let translateX = 0, translateY = 0, translateScale = 1;
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
        // console.log('nodes', nodes, 'labelType', labelType);
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

        let nodeMap = {};
        const INNER = 'inner', START = 'start', END = 'end', ALL = 'all';
        const colorMap = {};
        colorMap[INNER] = '#787878';
        colorMap[START] = '#0db14c';
        colorMap[END] = '#e50101';
        colorMap[ALL] = '#d4b400';
        nodes.forEach(function (curElem) {
            let exists = nodeMap[curElem.node] !== undefined;
            // console.log(curElem.node, 'exists in', nodeMap, ' ?', exists);
            let nodeType = curElem.nodetype;
            if (!exists) {
                nodeMap[curElem.node] = curElem;
                nodeMap[curElem.node].nodetype = [];
            }
            nodeMap[curElem.node].nodetype.push(nodeType);
        });

        let keys = Object.keys(nodeMap);
        keys.forEach(function (key) {
            let style;
            //  console.log('nodeMap[' + key + ']', nodeMap[key]);
            let noteTypeLength = nodeMap[key].nodetype.length;
            //    console.log('1', nodeMap[key]);
            let innerIndex = nodeMap[key].nodetype.indexOf(INNER);
            //   console.log('1a');
            if (nodeMap[key].nodetype.length == 1) {
                //  console.log('2.1');
                if (innerIndex >= 0) {
                    //      console.log('2.1.1');
                    style = colorMap[INNER];
                } else {
                    //      console.log('2.2');
                    if (nodeMap[key].nodetype.indexOf(START) >= 0) {
                        //     console.log('2.2.1');
                        style = colorMap[START]
                    } else {
                        //     console.log('2.2.1');
                        style = colorMap[END];
                    }
                }
            } else {
                //   console.log('2.3');
                // the node has more than one function
                if (noteTypeLength > 2) {
                    //   console.log('2.3.1');
                    style = colorMap[ALL];
                } else {
                    // console.log('2.3.2');
                    if (nodeMap[key].nodetype.indexOf(START) >= 0) {
                        // console.log('2.3.2.1');
                        style = colorMap[START]
                    } else {
                        // console.log('2.3.2.2');
                        style = colorMap[END];
                    }
                }
            }
            //   console.log('3 style=', style);
            g.setNode(key, {label: key, style: "fill: " + style})
        });

        // console.log('nodeMap', nodeMap);
        links.forEach(function (curLink) {
            let label;
            if (labelType === "Count")
                label = curLink.cnt;
            else if (labelType === "Time")
                label = parseDuration(curLink.deltaSec);
            else
                label = '???';
            //  console.log(curLink, label, 'labeltype=', labelType);
            g.setEdge(curLink.from, curLink.to, {lineInterpolate: 'basis', label: '(' + label + ')'});
        });

        //Kanten der Nodes abrunden
        g.nodes().forEach(function (v) {
            var node = g.node(v);
            node.rx = node.ry = 5;
        });
        let render = new dagreD3.render();
        let svgGroup = svg.append("g");
        render(d3.select("svg g"), g);
        const svgWidth = svg[0][0].scrollWidth;
        const svgHeight = svg[0][0].scrollHeight;
        const graphWidth = g.graph().width;
        const graphHeight = g.graph().height;

        //Zoom & center
        let drag = d3.behavior.drag();
        drag.on('drag', function () {
            console.log(d3.event);
            svg.select('g').attr("transform", "translate(" + ( translateX += d3.event.dx ) + ", " + (translateY += d3.event.dy ) + ")scale(" + translateScale + ")");
            d3.event.sourceEvent.stopPropagation();
        });
        svg.call(drag);
        const zoom = d3.behavior.zoom();
        zoom.size([svgWidth, svgHeight]);
        zoom.center([svgWidth / 2, svgHeight / 2]);

        const neededScale = Math.min(svgWidth / graphWidth, svgHeight / graphHeight, 1);
        svg.call(zoom.on("zoom", function () {
            console.log(d3.event);
            if (translateX === 0 && translateY === 0) {
                translateY = (svgHeight - graphHeight * neededScale) / 2;
                translateX = (svgWidth - graphWidth * neededScale) / 2;
            }
            svg.select("g").attr("transform", "translate(" + translateX + ", " + translateY + ") scale(" + (translateScale = d3.event.scale) + ")");
            d3.event.sourceEvent.stopPropagation();
        }));
        zoom.scale(neededScale);
        zoom.event(svg);

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