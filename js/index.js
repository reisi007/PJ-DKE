"use strict";
/**
 * Created by Florian on 12.03.2016.
 */

let app = angular.module('PjDke', []);
app.controller('MainController', ['$scope', 'api', function ($scope, api) {
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
            selectedIds: rawData.ids,
            routestats: rawData.routestat
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

    $scope.$on('addRoute', function (event, args) {
        // console.log('Add ' + args);
        let ids = $scope.rawData.ids;
        console.log(ids);
        let zeroIndex = ids.indexOf('0');
        if (zeroIndex >= 0) {
            ids.splice(zeroIndex, 1, args);
        } else {
            ids.push(args);
        }
        let s;
        s = ids.join(',');
        setTextFieldValue(s);
    });
    $scope.$on('removeRoute', function (event, args) {
        // console.log('Remove ', args);
        let ids = $scope.rawData.ids;
        ids.splice(ids.indexOf(args), 1);

        if (ids.length === 0)
            ids.push(0); // No ID with value 0 exists (ID start with 1)

        setTextFieldValue(ids.join(','));
    });
    /**
     *
     * @param {string} val
     */
    function setTextFieldValue(val) {
        //  console.log('Change ID textfield to "', val, '"', Object.prototype.toString.call(val), ' (needs to be [object String])');
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
            //console.log('Cache hit', type, dataId, 'result:', cacheResult);
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
                // console.log('Added cahce entry for', type, dataId, 'with value', res);
            }
            onSuccess(angular.copy(res));

            // +console.log('Cache object', cache)
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
    const data = [
        {key: 'years', value: 31556736},
        {key: 'months', value: 2592000},
        {key: 'weeks', value: 604800},
        {key: 'days', value: 86400},
        {key: 'hours', value: 3600},
        {key: 'minutes', value: 60}
    ];
    return function (sec) {
        if (sec == 0)
            return 'Immediately';
        for (let i = 0; i < data.length; i++) {
            let cur = data[i];
            let x = sec / cur.value;
            if (x >= 1) {
                x = parseFloat(Math.round(x * 100) / 100).toFixed(2);
                return x + ' ' + cur.key;
            }
        }
        return sec + ' sec';
    };
});