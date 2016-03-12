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
ad3.directive('d3Force', ['uniqueId', function (uniqueId) {
  return {
    restrict: "A",
    link: function ($scope, elem, attrs) {
      attrs.$observe('d3Force', function (data) {
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

        let svg = angular.element(elem).find("svg");
        let randomID = "rand" + uniqueId();
        if (svg.length == 0) {
          svg = elem.append("<svg id='" + randomID + "' width='" + w + "' height='" + h + "'></svg>");
          svg = angular.element(elem).find("svg");
        } else {
          svg = svg[0];
        }
        let d3nodeMap = d3.map();
        $scope.links = data.links;
        data.nodes.forEach(function (node) {
          d3nodeMap.set(node.id, node);
        });
        data.links.forEach(function (link) {
          link.source = d3nodeMap.get(link.source);
          link.target = d3nodeMap.get(link.target);
        });
        force.nodes(data.nodes).links(data.links).start();
        svg = d3.select("svg#" + randomID);
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
            return d.id;
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
    }
  }
}]);