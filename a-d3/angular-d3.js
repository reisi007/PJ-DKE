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
            elem.append("<svg id='" + id + '\'' + (width !== undefined ? ( " width='" + width) : '') + (height !== undefined ? ("' height='" + height) : '') + "'></svg>");
            randomID.resolve(id);
        } else {
            randomID.resolve(svg[0].id);
        }
        return randomID.promise;
    };
}]);
ad3.factory('divTag', ['uniqueId', '$q', function (uniqueId, $q) {
    return function (elem, onCreate, onUpdate) {
        let div = angular.element(elem).find("div");
        if (div.length == 0) {
            let id = "rand" + uniqueId();
            elem.append("<div id='" + id + "'></div>");
            onCreate(id);
        } else {
            let id = (div[0].id);
            onUpdate(id);
        }
    };
}]);
