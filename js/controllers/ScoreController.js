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
		game = {score: 10000000, rate: 0, click: 1};
		game.shop = window.shop;
		game.clickShop = window.clickShop;
	}

	// set model to variables usable by the view
	$scope.game = game;
	saveGame();
    
    // initialize warning to hidden
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
		if ($scope.game.score >= $scope.game.shop[num].price) {
			$scope.game.rate += $scope.game.shop[num].rate;
			$scope.game.score -= $scope.game.shop[num].price;
			$scope.game.shop[num].bought += 1;
			$scope.game.shop[num].price = Math.floor($scope.game.shop[num].price * 1.3);
            saveGame();
		} else {
			//console.log("have: " + $scope.game.score + " cost: " + $scope.game.shop[num].price);
            shopError($scope.game.shop[num].price);
		}
        closeNav();
        return;
	};

	// buy items that increase score per click
	$scope.buyClick = function (num) {
		if ($scope.game.score >= $scope.game.clickShop[num].price) {
			$scope.game.click += $scope.game.clickShop[num].rate;
			$scope.game.score -= $scope.game.clickShop[num].price;
			$scope.game.clickShop[num].bought += 1;
			$scope.game.clickShop[num].price = Math.floor($scope.game.clickShop[num].price * 2);
            saveGame();
		} else {
			//console.log("have: " + $scope.game.score + " cost: " + $scope.game.clickShop[num].price);
            shopError($scope.game.clickShop[num].price);
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