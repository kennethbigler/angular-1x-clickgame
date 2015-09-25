/*global angular*/

var app = angular.module('myApp', ['ngCookies']).filter('floor', function () {
    "use strict";
    return function (n) {
        return Math.floor(n);
    };
});