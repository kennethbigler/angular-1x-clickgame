/*global $, console, app*/

app.controller('MainController', function ($scope, $cookies, $timeout) {
    "use strict";
// -------------------------------     Define Helper Functions    -------------------------------- //
	//helper function that saves cookies
	function save() {
		$cookies.putObject('game', $scope.game);
		console.log("saved");
	}

	// helper function to add score passively
	function add() { $scope.game.score += ($scope.game.rate / 10); }
    
    function closeNav() { $("#navbar").collapse('hide'); }
    
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
		game = {score: 0, rate: 0, click: 1};
        game.bought = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		game.cBought = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }

	// set model to variables usable by the view
	$scope.game = game;
	save();
    
    // initialize warning to hidden
    $scope.shop = window.shop;
    $scope.clickShop = window.clickShop;
    $scope.err = true;
    $scope.ep = 0;
// -------------------------------------     Reset Data    -------------------------------------- //
	$scope.resetScore = function () {
		$cookies.remove('game');
		window.location.reload();
	};
// ------------------------------------     Click Counter    ------------------------------------- //
	// add score function, changed for variable value addition
	$scope.addScore = function (num) {
		$scope.game.score += num;
		return;
	};
// -------------------------------------     Purchasing    -------------------------------------- //
	// buy items that increase score per 1/10th of a second
	$scope.buyPassive = function (num) {
        var p = $scope.shop[num].price + $scope.shop[num].price * $scope.game.bought[num] * 0.3;
		if ($scope.game.score >= p) {
			$scope.game.rate += $scope.shop[num].rate;
			$scope.game.score -= p;
			$scope.game.bought[num] += 1;
            save();
		} else { err(p); }
        closeNav();
        return;
	};

	// buy items that increase score per click
	$scope.buyClick = function (num) {
        var p = $scope.clickShop[num].price + $scope.clickShop[num].price * $scope.game.cBought[num];
		if ($scope.game.score >= p) {
			$scope.game.click += $scope.clickShop[num].rate;
			$scope.game.score -= p;
			$scope.game.cBought[num] += 1;
            save();
		} else { err(p); }
        closeNav();
        return;
	};
// --------------------------------     Auto Score and Saving    --------------------------------- //
	// save data to cookies every 60 seconds
	setInterval(function () { $scope.$apply(function () { save(); }); }, 60000);
	// add passive score every 1/10th of a second
    setInterval(function () { $scope.$apply(function () { add(); }); }, 100);
// --------------------------------------     End Code    --------------------------------------- //
});