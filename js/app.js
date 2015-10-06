/*global angular, $filter*/

var app = angular.module('myApp', ['ngRoute'])
        .config(function ($routeProvider) {
            "use strict";
            
            $routeProvider
                .when('/', {
                    templateUrl: 'js/views/home.html'
                }).when('/away', {
                    templateUrl: 'js/views/away.html'
                }).otherwise({ redirectTo: '/' });
            // use the HTML5 History API
            // $locationProvider.html5Mode(true);
        })
        .filter('lnumber', function ($filter) {
            "use strict";
            return function (number, fractionSize) {
                if (number === null) { return null; }
                if (number === 0) { return "0"; }
                if (!fractionSize || fractionSize < 0) { fractionSize = 1; }

                var rounder = Math.pow(10, fractionSize),
                    key = '',
                    reduced = 0,
                    i = 0,
                    powers = [
                        {key: "TQ", value: Math.pow(10, 27)},
                        {key: "BQ", value: Math.pow(10, 24)},
                        {key: "MQ", value: Math.pow(10, 21)},
                        {key: "KQ", value: Math.pow(10, 18)},
                        {key: "Q", value: Math.pow(10, 15)},
                        {key: "T", value: Math.pow(10, 12)},
                        {key: "B", value: Math.pow(10, 9)},
                        {key: "M", value: Math.pow(10, 6)},
                        {key: "K", value: Math.pow(10, 3)}
                    ];

                for (i = 0; i < powers.length; i += 1) {
                    reduced = number / powers[i].value;
                    reduced = Math.round(reduced * rounder) / rounder;
                    if (reduced >= 1) {
                        number = reduced;
                        key = powers[i].key;
                        break;
                    }
                }
                if (key === '') {
                    return $filter('number')(number, 1);
                }
                return number + key;
            };
        })
        .factory('$localstorage', ['$window', function ($window) {
            'use strict';
            return {
                set: function (key, value) {
                    $window.localStorage[key] = value;
                },
                get: function (key, defaultValue) {
                    return $window.localStorage[key] || defaultValue;
                },
                putObject: function (key, value) {
                    $window.localStorage[key] = JSON.stringify(value);
                },
                getObject: function (key) {
                    return JSON.parse($window.localStorage[key] || '{}');
                },
                remove: function (key) {
                    $window.localStorage.removeItem(key);
                }
            };
        }]);