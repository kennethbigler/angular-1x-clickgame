/*global $, console, app */

app.controller('MainController', function ($scope, $timeout, $localstorage) {
    "use strict";
// -------------------------------     Define Helper Functions    -------------------------------- //
	// helper function to save to localstorage
	function save() {
		$localstorage.putObject('game', $scope.game);
		console.log("saved");
	}
    // report not enough money
    function err(x) {
        $scope.err = false;
        $scope.ep = x;
        $timeout(function () { $scope.err = true; }, 3000);
    }
// -----------------------------------     Initialize Data    ------------------------------------ //
    // get game data from localstorage
    var game = $localstorage.getObject('game');
	// if no game data, fill with default
	if (Object.keys(game).length === 0) {
		game = {score: 0, rate: 0, click: 1, arc: 300, arr: 50,
                p: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                c: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ac: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ar: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
               };
        game.date = new Date();
    } else {
        // prep date data from cookies
        game.date.slice(0, -5);
        game.date = new Date(game.date);
    }
	$scope.game = game;
	save();
    // initialize data
    $scope.shop = window.shop;
    $scope.cShop = window.cShop;
    $scope.arShop = window.arShop;
    $scope.acShop = window.acShop;
    $scope.err = true;
    $scope.ep = 0;
// --------------------------------     Scope Score Modifiers    -------------------------------- //
	// reset score
    $scope.reset = function () {
		$localstorage.remove('game');
        window.location.reload();
	};
	// add clicks to score
	$scope.add = function (num) {
		$scope.game.score += num;
		return;
	};
    $scope.collect = function () {
        var date = new Date(),
            m = ((date - game.date) / 216000000) * game.arr;
        if (game.arc < m) {
            game.score += game.arc;
        } else {
            game.score += m;
        }
        game.date = date;
        $scope.closeNav();
        save();
    };
// -------------------------------------     Purchasing    -------------------------------------- //
    // buy passive score increase
	$scope.buyP = function (num) {
        var p = $scope.shop[num].price * Math.pow(1.3, $scope.game.p[num]);
		if ($scope.game.score >= p) {
			$scope.game.rate += $scope.shop[num].rate;
			$scope.game.score -= p;
			$scope.game.p[num] += 1;
            save();
		} else { err(p); }
        $scope.closeNav();
        return;
	};
	// buy clock score increase
	$scope.buyC = function (num) {
        var p = $scope.cShop[num].price * Math.pow(2, $scope.game.c[num]);
		if ($scope.game.score >= p) {
			$scope.game.click += $scope.cShop[num].rate;
			$scope.game.score -= p;
			$scope.game.c[num] += 1;
            save();
		} else { err(p); }
        $scope.closeNav();
        return;
	};
    // buy away capacity increase
    $scope.buyAC = function (num) {
        var p = $scope.acShop[num].price * Math.pow(1.3, $scope.game.ac[num]);
        if ($scope.game.score >= p) {
			$scope.game.arc += $scope.acShop[num].rate;
			$scope.game.score -= p;
			$scope.game.ac[num] += 1;
            save();
		} else { err(p); }
        $scope.closeNav();
        return;
    };
    // buy score per hour increase
    $scope.buyAR = function (num) {
        var p = $scope.arShop[num].price * Math.pow(1.3, $scope.game.ar[num]);
        if ($scope.game.score >= p) {
			$scope.game.arr += $scope.arShop[num].rate;
			$scope.game.score -= p;
			$scope.game.ar[num] += 1;
            save();
		} else { err(p); }
        $scope.closeNav();
        return;
    };
// ---------------------------------     Display Functions    ----------------------------------- //
    // power funciton
    $scope.pow = function (a, b) { return Math.pow(a, b); };
    // close nav
    $scope.closeNav = function () { $("#navbar").collapse('hide'); };
// -------------------------------     Auto Score and Saving    --------------------------------- //
	// save data to localstorage every 60s
	setInterval(function () { $scope.$apply(function () { save(); }); }, 60000);
	// add passive score every 1/10th of a sec
    setInterval(function () { $scope.$apply(function () { $scope.add($scope.game.rate / 10); }); }, 100);
});