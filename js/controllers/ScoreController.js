/*global $, console, app, alert */

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
    var date = $localstorage.getObject('date'),
        game = $localstorage.getObject('game');
	// if no game data, fill with default
	if (Object.keys(game).length === 0) {
		game = {score: 200, rate: 0, click: 0, arc: 300, arr: 50, num: 0, i: 0,
                p: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ac: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ar: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
               };
        $localstorage.putObject('date', new Date());
    } else {
        // prep date data from cookies
        date.slice(0, -5);
        date = new Date(date);
        $localstorage.putObject('date', date);
    }
	$scope.game = game;
	save();
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
        var d = new Date(),
            m = isNaN(date) ? 0 : ((d - date) / 216000000) * game.arr;
        if (game.arc < m) {
            game.score += game.arc;
        } else {
            game.score += m;
        }
        date = d;
        console.log(m);
        $localstorage.putObject('date', date);
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
    // increase score per click, 3-tier
    $scope.buyC = function () {
        if ($scope.game.num >= 22 && $scope.game.i >= 3) {
            console.log("num = " + $scope.game.num);
            return;
        }
        var p = $scope.cShop[$scope.game.num].price * Math.pow(2, $scope.game.i);
        if ($scope.game.score >= p) {
            $scope.game.score -= p;
            $scope.game.click = $scope.cShop[$scope.game.num].rate * ($scope.game.i * 2 + 1);
            $scope.game.i += 1;
            save();
        } else { err(p); }
        if ($scope.game.num >= 22 && $scope.game.i >= 3) {
            alert("You Win!!!");
            return;
        } else if ($scope.game.i >= 3) {
            $scope.game.i = 0;
            $scope.game.num += 1;
        }
    };
// ---------------------------------     Display Functions    ----------------------------------- //
    $scope.pow = function (a, b) { return Math.pow(a, b); }; // power funciton
    $scope.closeNav = function () { $("#navbar").collapse('hide'); }; // close nav
// -------------------------------     Auto Score and Saving    --------------------------------- //
	// save data to localstorage every 60s
	setInterval(function () { $scope.$apply(function () { save(); }); }, 60000);
	// add passive score every 1/10th of a sec
    setInterval(function () { $scope.$apply(function () { $scope.add($scope.game.rate / 10); }); }, 100);
});