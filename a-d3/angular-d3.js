/**
 * Created by Florian on 12.03.2016.
 */
"use strict";
let ad3 = angular.module('D3js', []);
ad3.factory('uniqueId', function () {
  let id = 0;
  return function () {
    return (id++);
  }
});
ad3.factory('svgTag', ['uniqueId', '$q', function (uniqueId, $q) {
  return function (elem, width, height) {
    let svg = angular.element(elem).find("svg");
    let randomID = $q.defer();
    if (svg.length == 0) {
      let id = "rand" + uniqueId();
      elem.append("<svg id='" + id + "' width='" + width + "' height='" + height + "'></svg>");
      randomID.resolve(id);
    } else {
      randomID.resolve(svg[0].id);
    }
    return randomID.promise;
  };
}]);
ad3.directive('d3Force', ['svgTag', function (svgTag) {
  let createDiagram = function ($scope, elem, attrs) {
    let data = attrs.d3Force;
    if (data === undefined)return;
    data = JSON.parse(data);
    if (data.nodes === undefined)
      return;
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
      let nodes = data.nodes;
      let labelAnchors = [];
      let labelAnchorLinks = [];
      let links = data.links;

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
    restrict: "A",
    link: function ($scope, elem, attrs) {
      attrs.$observe('d3Force', function () {
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