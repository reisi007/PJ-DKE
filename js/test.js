/**
 * Created by Florian on 13.03.2016.
 */
"use strict";
ad3.directive('d3ForceLabel', ['svgTag', function (svgTag) {
  let createDiagram = function ($scope, elem, attrs) {
    let data = attrs.d3ForceLabel;
    if (data === undefined)return;
    data = JSON.parse(data);
    if (data.nodes === undefined)
      return;
    let w = 960, h = 500;
    let labelDistance = 0;
    svgTag(elem, w, h).then(function (uniqueId) {
      let svg = d3.select("#" + uniqueId);
      let nodes = data.nodes;
      let labelAnchors = [];
      let labelAnchorLinks = [];
      let links = data.links;

      nodes.forEach(function (node) {
        if (node.label === undefined) {
          node.label = "No label";
        }

        labelAnchors.push({
          node: node
        }, {
          node: node
        });
      });

      for (let i = 0; i < links.length; i++) {
        if (links[i].weight === undefined) {
          links[i].weight = 1;
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        labelAnchorLinks.push({
          source: i * 2,
          target: i * 2 + 1,
          weight: 1
        });
      }

      var force = d3.layout.force().size([w, h]).nodes(nodes).links(links).gravity(1).linkDistance(50).charge(-3000).linkStrength(function (x) {
        return x.weight * 10
      });

      console.log("Original items");
      console.log({nodes: nodes, links: links});
      console.log("Label items");
      console.log({anchors: labelAnchors, anchorsLinks: labelAnchorLinks});
      force.start();

      var force2 = d3.layout.force().nodes(labelAnchors).links(labelAnchorLinks).gravity(0).linkDistance(0).linkStrength(8).charge(-100).size([w, h]);
      force2.start();

      var link = svg.selectAll("line.link").data(links).enter().append("svg:line").attr("class", "link").style("stroke", "#CCC");

      var node = svg.selectAll("g.node").data(force.nodes()).enter().append("svg:g").attr("class", "node");
      node.append("svg:circle").attr("r", 5).style("fill", function (d) {
        return d.color;
      }).style("stroke", "#FFF").style("stroke-width", 3);
      node.call(force.drag);


      var anchorLink = svg.selectAll("line.anchorLink").data(labelAnchorLinks)//.enter().append("svg:line").attr("class", "anchorLink").style("stroke", "#999");

      var anchorNode = svg.selectAll("g.anchorNode").data(force2.nodes()).enter().append("svg:g").attr("class", "anchorNode");
      anchorNode.append("svg:circle").attr("r", 0).style("fill", "#FFF");
      anchorNode.append("svg:text").text(function (d, i) {
        return i % 2 == 0 ? "" : d.node.label
      }).style("fill", "#555").style("font-family", "Arial").style("font-size", 12);

      var updateLink = function () {
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

      var updateNode = function () {
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
    restrict: "A",
    link: function ($scope, elem, attrs) {
      attrs.$observe('d3ForceLabel', function () {
        createDiagram($scope, elem, attrs);
      });
    }
  }
}]);