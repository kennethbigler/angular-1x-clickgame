/*global $, console, app*/

app.controller('MainController', function ($scope, $cookies, $timeout) {

    "use strict";
    
// -------------------------------     Define Helper Functions    -------------------------------- //
    
	//helper function that saves cookies
	function saveGame() {
		$cookies.putObject('game', $scope.game);
		console.log("saved");
	}

	// helper function to add score passively
	function autoAdd() {
		$scope.game.score += ($scope.game.rate / 10);
		//console.log($scope.game.score);
		//console.log($scope.game.rate);
	}
    
    function closeNav() {
        $("#navbar").collapse('hide');
    }
    
    function shopError(x) {
        $scope.shopError = false;
        $scope.errorPrice = x;
        $timeout(function () {
            $scope.shopError = true;
        }, 3000);
    }
    
// -----------------------------------     Initialize Data    ------------------------------------ //
    
	// get game data from cookies
	var game = $cookies.getObject('game');
	
	// if there was no game data fill with default values
	if (!game) {
		game = {score: 0, rate: 0, click: 1};
        game.bought = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		game.cBought = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

	// set model to variables usable by the view
	$scope.game = game;
	saveGame();
    
    // initialize warning to hidden
    $scope.shop = window.shop;
    $scope.clickShop = window.clickShop;
    $scope.shopError = true;
    $scope.errorPrice = 0;

// -------------------------------------     Reset Data    -------------------------------------- //

	$scope.resetScore = function () {
		$cookies.remove('game');
		window.location.reload();
	};

// ------------------------------------     Click Counter    ------------------------------------- //

	// add score function, changed for variable value addition
	$scope.addScore = function (num) {
		//$scope.game.score ++;
		$scope.game.score += num;
		return;
	};

// -------------------------------------     Purchasing    -------------------------------------- //

	// buy items that increase score per 1/10th of a second
	$scope.buyPassive = function (num) {
        var price = $scope.shop[num].price +
            $scope.shop[num].price * $scope.game.bought[num] * 0.3;
		if ($scope.game.score >= price) {
			$scope.game.rate += $scope.shop[num].rate;
			$scope.game.score -= price;
			$scope.game.bought[num] += 1;
            saveGame();
		} else {
			//console.log("have: " + $scope.game.score + " cost: " + price);
            shopError(price);
		}
        closeNav();
        return;
	};

	// buy items that increase score per click
	$scope.buyClick = function (num) {
        var price = $scope.clickShop[num].price +
            $scope.clickShop[num].price * $scope.game.cBought[num] * 0.3;
		if ($scope.game.score >= price) {
			$scope.game.click += $scope.clickShop[num].rate;
			$scope.game.score -= price;
			$scope.game.cBought[num] += 1;
            saveGame();
		} else {
			//console.log("have: " + $scope.game.score + " cost: " + price);
            shopError(price);
		}
        closeNav();
        return;
	};

// --------------------------------     Auto Score and Saving    --------------------------------- //

	// save data to cookies every 60 seconds
	setInterval(function () {
		$scope.$apply(function () {
			saveGame();
		});
	}, 60000);

	// add passive score every 1/10th of a second
    setInterval(function () {
        $scope.$apply(function () {
            autoAdd();
        });
    }, 100);

// --------------------------------------     End Code    --------------------------------------- //
});