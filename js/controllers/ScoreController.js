/*global $, console, app*/

app.controller('MainController', function ($scope, $cookies, $timeout) {
    "use strict";
// -------------------------------     Define Helper Functions    -------------------------------- //
	//helper function that saves cookies
	function save() {
		$cookies.putObject('game', $scope.game);
		console.log("saved");
	}
    // close nav after a click
    function closeNav() { $("#navbar").collapse('hide'); }
    // report not enough money
    function err(x) {
        $scope.err = false;
        $scope.ep = x;
        $timeout(function () { $scope.err = true; }, 3000);
    }
// -----------------------------------     Initialize Data    ------------------------------------ //
	// get game data from cookies
	var game = $cookies.getObject('game');
	// if there was no game data fill with default values
	if (!game) {
		game = {score:0,rate:0,click:1,
                p:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                c:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
               };
    }
	// set model to variables usable by the view
	$scope.game = game;
	save();
    // initialize warning to hidden
    $scope.shop = window.shop;
    $scope.cShop = window.cShop;
    $scope.err = true;
    $scope.ep = 0;
// --------------------------------     Scope Score Modifiers    -------------------------------- //
	//reset score
    $scope.reset = function () {
		$cookies.remove('game');
		window.location.reload();
	};
	// add clicks to score
	$scope.add = function (num) {
		$scope.game.score += num;
		return;
	};
// -------------------------------------     Purchasing    -------------------------------------- //
	// buy items that passively increase score
	$scope.buyPassive = function (num) {
        var p = $scope.shop[num].price * Math.pow(1.3, $scope.game.p[num]);
		if ($scope.game.score >= p) {
			$scope.game.rate += $scope.shop[num].rate;
			$scope.game.score -= p;
			$scope.game.p[num] += 1;
            save();
		} else { err(p); }
        closeNav();
        return;
	};
	// buy items that increase score per click
	$scope.buyClick = function (num) {
        var p = $scope.cShop[num].price * Math.pow(2, $scope.game.c[num]);
		if ($scope.game.score >= p) {
			$scope.game.click += $scope.cShop[num].rate;
			$scope.game.score -= p;
			$scope.game.c[num] += 1;
            save();
		} else { err(p); }
        closeNav();
        return;
	};
    // allow power funciton in html
    $scope.pow = function (a, b) {
        return Math.pow(a, b);
    };
// -------------------------------     Auto Score and Saving    --------------------------------- //
	// save data to cookies every 60 seconds
	setInterval(function () { $scope.$apply(function () { save(); }); }, 60000);
	// add passive score every 1/10th of a second
    setInterval(function () { $scope.$apply(function () { $scope.add($scope.game.rate / 10); }); }, 100);
// -------------------------------------     End Code    ---------------------------------------- //
});