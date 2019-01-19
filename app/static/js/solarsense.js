/*
	Author: ASU CAPSTONE TEAM 2018
	Date: 11.08.2018
	Description: Controllers for Handling UI data binding and REST request
*/

var app = angular.module('solarsenseApp', []);

app.config(['$interpolateProvider', function($interpolateProvider) {
  $interpolateProvider.startSymbol('{a');
  $interpolateProvider.endSymbol('a}');
}]);

app.controller('HomeCtrl', function($scope, $timeout, $http, $window) {

	$scope.notifications = [];
	$scope.reminders = [];

	$scope.startCollection = function () {
		$window.location.href = "instant"; 
	}

	$scope.scanSensors = function () {
		$window.location.href = "scan"; 
	}
	// Function to check for notifications
	$scope.checkNotifications = function() {
		$http({
			method:'GET',
			url:'http://11.11.11.11/notifications',
			headers: {
				'Access-Control-Allow-Origin': '*',
        		'Access-Control-Allow-Methods' : 'PUT,GET',
        		'Access-Control-Allow-Headers' : 'Content-Type, Authorization, Content-Length, X-Requested-With'
			}
		})
		.then(function success(response){
			console.log(response.data);
			for (var i = 0; i < response.data.length; i++) {
				$scope.notifications.push(JSON.parse(response.data[i]));
				console.log(response.data[i]);
			}
			console.log($scope.notifications);
		}, function error(err){
			console.log(err);
		});

	};

	$scope.checkNotifications();

	// Function to check reminders
	$scope.checkReminders = function() {
		$http({
			method:'GET',
			url:'http://11.11.11.11/getReminders',
			headers: {
				'Access-Control-Allow-Origin': '*',
        		'Access-Control-Allow-Methods' : 'PUT,GET',
        		'Access-Control-Allow-Headers' : 'Content-Type, Authorization, Content-Length, X-Requested-With'
			}
		})
		.then(function success(response){
			console.log(response.data);
			for (var i = 0; i < response.data.length; i++) {
				$scope.reminders.push(JSON.parse(response.data[i]));
				console.log(response.data[i]);
			}
			console.log($scope.reminders);
		}, function error(err){
			console.log(err);
		});

	};

	//$scope.checkReminders();

	
});

app.controller('InstantCtrl', function($scope,$http,$timeout){

	$scope.test = "This is a Test";
	$scope.soilData = [];
	$scope.percent = 0;

	$scope.showData = function() {
		if($scope.percent === 100){
			return true;
		}
		return false;
	};

	$scope.showProgress = function() {
		if($scope.percent === 100) {
			return false;
		}
		return true;
	};

	$scope.dataRequest = function() {
		console.log("Calling Data Object");
		$http({
			method:'GET',
			// When using on development machine, use http://localhost:5000/data
			// When using and deploying on pi, use http://11.11.11.11/data
			url:'http://11.11.11.11/data',
			headers: {
				'Access-Control-Allow-Origin': '*',
        		'Access-Control-Allow-Methods' : 'PUT,GET',
        		'Access-Control-Allow-Headers' : 'Content-Type, Authorization, Content-Length, X-Requested-With'
			}
		})
		.then(function success(response){
			$scope.response = response.data;
			var percentVal = 100 / $scope.response.length;
			for(var i = 0; i < $scope.response.length; i++){		
				var soilObj = JSON.parse($scope.response[i]);
				$scope.soilData.push(soilObj);
			}

			$timeout(function(){
				for(var i = 0; i < 100; i++){
					$scope.percent++;
				}
			},5000);
		}, function error(response){
			console.log("There was an error getting the data");
		});

	};

});

app.controller('ScanCtrl', function($scope, $timeout, $http) {
  $scope.percent = 0;
  $timeout(function(){
        for(var i = 0; i < 100; i++){
          $scope.percent+=10;
        }
      },1000);
});

app.controller('RemindersCtrl', function($scope, $timeout, $http) {
	$scope.reminders = [];
	$scope.reminderFrequency = 8;

	// Function to save remonders
	$scope.saveReminders = function () {
		$http({
			method:'POST',
			url:'http://11.11.11.11/editReminders',
			headers: {
				'Access-Control-Allow-Origin': '*',
        		'Access-Control-Allow-Methods' : 'PUT,GET',
        		'Access-Control-Allow-Headers' : 'Content-Type, Authorization, Content-Length, X-Requested-With'
			},
			data: {
				frequency: $scope.reminderFrequency
			}
		})
		.then(function success(response){
			console.log(response.data);
		}, function error(err){
			console.log(err);
		});
		console.log($scope.reminderFrequency);
	}
});
