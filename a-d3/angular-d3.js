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
    let force = d3.layout.force().charge(c).linkDistance(d).size([w, h]);

    let d3nodeMap = {};
    $scope.links = data.links;
    data.nodes.forEach(function (node) {
      d3nodeMap[node.id] = node;
    });
    data.links.forEach(function (link) {
      link.source = d3nodeMap[link.source];
      link.target = d3nodeMap[link.target];
    });
    force.nodes(data.nodes).links(data.links).start();


    svgTag(elem, w, h).then(function onComplete(uniqueId) {
      let svg = d3.select("svg#" + uniqueId);
      let link = svg.selectAll(".link")
        .data(data.links)
        .enter().append("line")
        .attr("class", "link");

      let node = svg.selectAll(".node")
        .data(data.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 6)
        .style("fill", function (d) {
          return d.color;
        })
        .call(force.drag);
      force.on("tick", function () {
        link.attr("x1", function (d) {
            return d.source.x;
          })
          .attr("y1", function (d) {
            return d.source.y;
          })
          .attr("x2", function (d) {
            return d.target.x;
          })
          .attr("y2", function (d) {
            return d.target.y;
          });

        node.attr("cx", function (d) {
            return d.x;
          })
          .attr("cy", function (d) {
            return d.y;
          });
      });
    });
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