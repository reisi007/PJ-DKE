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
ad3.factory('svgTag', ['uniqueId', function (uniqueId) {
    return function (elem, onCreate, onUpdate, width, height) {
        let svg = angular.element(elem).find("svg");
        if (svg.length === 0) {
            let id = "rand" + uniqueId();
            elem.append("<svg id='" + id + '\'' + (width !== undefined ? ( " width='" + width) : '') + (height !== undefined ? ("' height='" + height) : '') + "'></svg>");
            onCreate(id);
        } else {
            let id = svg[0].id;
            onUpdate(id);
        }
    };
}]);

