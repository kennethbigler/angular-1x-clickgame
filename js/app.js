/*global angular, $filter*/

var app = angular.module('myApp', ['ngCookies'])
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
        });