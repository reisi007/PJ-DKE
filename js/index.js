"use strict";
/**
 * Created by Florian on 12.03.2016.
 */

let app = angular.module('PjDke', []);
app.controller('TestController', ['$scope', 'api', function ($scope, api) {
    $scope.rawData = undefined;
    $scope.graphData = [];
    $scope.boxplotData = [];
    $scope.barchartData = [];
    $scope.labeltype = 'Count';
    let performUpdate = function (rawData) {
        $scope.rawData = rawData;
        //console.log(rawData);
        const labelType = $scope.labeltype;
        if (labelType === undefined || rawData === undefined) return;
        $scope.graphData = {
            nodes: rawData.nodes,
            links: rawData.links,
            labelType: labelType
        };
        $scope.barchartData = rawData.nodestat;
        $scope.boxplotData = {
            selectedIds: angular.copy(rawData.ids),
            routestats: angular.copy(rawData.routestat)
        }
    };

    $scope.reset = function () {
        api.withPerc(0, performUpdate);
        setTextFieldValue('');
    };
    let oldVariant = null, oldPercentage = null, oldLabel = null;
    $scope.update = function () {
        let variant = $scope.variant;
        if (variant) {
            if (variant !== oldVariant) {
                oldVariant = variant;
                oldPercentage = null;
                api.widthIds(variant, performUpdate);
            }
        } else {
            let percentage = $scope.minCoverage;
            if (percentage !== undefined && percentage !== oldPercentage) {
                oldVariant = null;
                oldPercentage = percentage;
                api.withPerc(percentage, performUpdate)
            }
        }
        let labelType = $scope.labeltype;
        if (labelType !== oldLabel) {
            performUpdate($scope.rawData);
            oldLabel = labelType;
        }
    };

    $scope.$watch('rawData', watchUpdate);
    $scope.$watch('variant', watchUpdate);
    $scope.$watch('labeltype', watchUpdate);
    $scope.$watch('minCoverage', function () {
        //console.log('Reset Textfield');
        setTextFieldValue('');
        watchUpdate();
    });

    $scope.update();

    $scope.$on('addPath', function (event, args) {
        //console.log('Add ' + args, $scope.rawData);
        let ids = $scope.rawData.ids;
        let max = $scope.rawData.routestat.length;
        let maxIndex = ids.indexOf(max);
        if (maxIndex >= 0) {
            ids.splice(maxIndex, 1);
        }
        ids.push(args);
        let s;
        s = ids.join(',');
        setTextFieldValue(s);
    });
    $scope.$on('removePath', function (event, args) {
        //console.log('Remove ' + args, $scope.rawData);
        let ids = $scope.rawData.ids;
        ids.splice(ids.indexOf(args), 1);
        let s;
        if (ids.length === 0)
            s = $scope.rawData.routestat.length;
        s = ids.join(',');
        setTextFieldValue(s);
    });

    function setTextFieldValue(val) {
        let textfield = document.getElementById('textInput');
        textfield = textfield.MaterialTextfield;
        if (textfield) {
            textfield.change(val);
            $scope.variant = val;
        }
    }

    $scope.updatePercentUI = function () {
        if ($scope.rawData === undefined)
            return 0;
        let percentage = $scope.rawData.selectedPercentage[0].percentage;
        if ($scope.minCoverage === 0) {
            $scope.minCoverage = percentage;
        }
        //console.log('minCoverage', $scope.minCoverage);
        let slider = document.getElementById('slider');
        if (slider !== undefined && slider.MaterialSlider !== undefined) {
            slider.MaterialSlider.change(percentage);
        }
        return percentage;
    };

    function watchUpdate() {
        $scope.update();
    }
}]);


app.factory('api', ['$http', function ($http) {
    const PERCENTAGE = 'percentage', IDS = 'id';
    let cache = {};
    cache[PERCENTAGE] = {};
    cache[IDS] = {};
    function call(data, onSuccess) {
        let type = null;
        if (data[PERCENTAGE] !== undefined)
            type = PERCENTAGE;
        else if (data[IDS] !== undefined) {
            type = IDS;
        }
        if (type === null)
            return;
        //Test for cache hit
        let dataId = data[type];
        let cacheResult = cache[type][dataId];
        if (cacheResult !== undefined) {
            console.log('Cache hit', type, dataId, 'result:', cacheResult);
            onSuccess(angular.copy(cacheResult));
            return;
        }
        const url = 'data.php';
        $http({
            method: 'POST',
            url: url,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function (obj) {
                let str = [];
                for (let p in data)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: data
        }).then(function (res) {
            //Add element to cache if not empty
            if (res.data.nodes.length > 0) {
                cache[type][dataId] = res;
                //   console.log('Added cahce entry for', type, dataId, 'with value', res);
            }
            onSuccess(res);
        }, function (res) {
            console.log('Error: ' + JSON.stringify(res))
        });
    }

    let percentage = function (percentage, onSuccess) {
        call({percentage: percentage}, function (res) {
            onSuccess(res.data);
        });
    };

    let withIds = function (idString, onSuccess) {
        call({id: idString}, function (res) {
            onSuccess(res.data);
        });
    };
    return {
        withPerc: percentage,
        widthIds: withIds
    }
}]);
/**
 * Returns a beautiful string based. Input -> Seconds
 */
app.factory('parseDuration', function () {
    const yearSec = 31536000, monthSec = 2592000, daySec = 86400;
    let second = function (sec, string) {
        if (sec === 0) {
            if (string.length > 0)
                return string;
            return ' Immediately ';
        }
        else
            return string + ' ' + Math.round(sec * 100) / 100 + ' sec ';
    }, minute = function (sec, string) {
        let min = Math.floor(sec / 60);
        let text;
        if (min === 0) {
            text = '';
        }
        else {
            text = ' ' + min + ' min';
        }
        return second(sec - 60 * min, string + text);
    }, hour = function (sec, string) {
        let hr = Math.floor(sec / 3600);
        let text;
        if (hr === 0) {
            text = '';
        }
        else {
            text = ' ' + hr + ' h';
        }
        return minute(sec - 3600 * hr, string + text);
    }, day = function (sec, string) {
        let day = Math.floor(sec / daySec);
        let text;
        if (day === 0) {
            text = '';
        }
        else {
            text = ' ' + day + ' d';
        }
        return hour(sec - daySec * day, string + text);
    }, month = function (sec, string) {
        let months = Math.floor(sec / monthSec);
        let text;
        if (months === 0) {
            text = '';
        }
        else {
            text = ' ' + months + ' months';
        }
        return day(sec - monthSec * months, string + text)
    }, year = function (sec, string) {
        let years = Math.floor(sec / yearSec);
        let text;
        if (years === 1) {
            text = ' 1 yr';
        }
        else if (years === 0) {
            text = '';
        }
        else {
            text = ' ' + years + ' yrs';
        }
        return month(sec - yearSec * years, string + text)
    };
    return function (sec) {
        return year(sec, '');
    };
});