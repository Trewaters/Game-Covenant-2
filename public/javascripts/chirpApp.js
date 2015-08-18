/// <reference path="../../typings/angularjs/angular.d.ts"/>
//chirpApp.js

var app = angular.module('chirpApp', ['ngRoute', 'ngResource']).run(function ($http, $rootScope) {
	$rootScope.authenticated = false;
	$rootScope.current_user = 'Guest';

	$rootScope.signout = function () {
		$http.get('auth/signout');
		$rootScope.authenticated = false;
		$rootScope.current_user = 'Guest';
	};
});

app.config(function ($routeProvider) {
	$routeProvider
    //the event listing display
		.when('/', {
			templateUrl: 'main-ngresource.html',
			controller: 'mainController'
		})
    //the login display
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'authController'
		})
    //the signup display
		.when('/signup', {
			templateUrl: 'register.html',
			controller: 'authController'
		})
    //the add convention display
		.when('/con', {
			templateUrl: 'conInput-ngresource.html',
			controller: 'conController' // I will need a new controller to list my conventions individually
		})
	//the convention profile page
		.when('/conProfile', {
			templateUrl: 'conProfile-ngresource.html',
			controller: 'conPageController'
		});
});

// read more about $resource (https://docs.angularjs.org/api/ngResource/service/$resource)
// updated factory with $resource
app.factory('postService', function ($resource) {
	return $resource('/api/posts');
});
// factory for post by _id
app.factory('postServiceById', function ($resource) {
	return $resource('/api/posts/:id');
});
	
// new factory
app.factory('conService', function ($resource) {
	return $resource('/api/cons', {
		'update': { method: 'PUT' }
	});
});
// factory for con by _id
app.factory('conServiceById', function ($resource) {

	return $resource('/api/conProfile/:id', { id: '@_id' },
		{
			// [In Progress] - working on adding update to the factory
			// reference (http://www.sitepoint.com/creating-crud-app-minutes-angulars-resource/)
			// this method issues a PUT request
			'update': { method: 'PUT' },
			'show': { method: 'GET', isArray: false }
		}
		);
});
	
// updated factory with $resource
app.controller('mainController', function ($scope, postService, $rootScope, conService) {
	$scope.posts = postService.query();
	$scope.newPost = "";
	$scope.con = conService.query();
	
	$scope.post = function () {
		postService.save({
			eveUser: $rootScope.current_user,
			eveTitle: $scope.eveTitle,
			eveType: $scope.eveType,
			eveTime: Date.now(),
			eveTimezone: $scope.eveTimezone,
			eveDuration: $scope.eveDuration,
			eveSystem: $scope.eveSystem,
			eveSetting: $scope.eveSetting,
			evePlayMax: $scope.evePlayMax,
			eveKnow: $scope.eveKnow,
			eveMaturity: $scope.eveMaturity,
			evePreGen: $scope.evePreGen,
			eveLink: $scope.eveLink,
			eveEmail: $scope.eveEmail,
			eveHost: $scope.eveHost,
			eveImage: $scope.eveImage,
			eveWebsite: $scope.eveWebsite,
			eveJoin: $scope.eveJoin,
			eveRegCon: $scope.eveRegConn
		},
			function () {
				$scope.posts = postService.query();
				$scope.newPost = "";
			});
	};
});

app.controller('authController', function ($scope, $http, $rootScope, $location) {
	$scope.user = { username: '', password: '' };
	$scope.error_message = '';

	$scope.login = function () {
		
		//console.log('debug_login_function_enter'); // [DEBUG]
		
		$http.post('/auth/login', $scope.user).success(function (data) {
			//var xdebug = data.message; // [DEBUG]
			//console.log(xdebug); // [DEBUG]
			
			if (data.state == 'success') {
				//console.log('debug_$http_login_if_successful'); // [DEBUG]
				
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/');
			} else {
				//console.log('debug_$http_login_else_failure'); // [DEBUG]
				
				$scope.error_message = data.message;
			}
		});
		//console.log('debug_login_function_exit'); // [DEBUG]
	};

	$scope.register = function () {
		$http.post('/auth/signup', $scope.user).success(function (data) {
			if (data.state == 'success') {
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$scope.email = data.user.email;
				$location.path('/');
			}
			else {
				$scope.error_message = data.message;
			}
		});
	};
});
	
// new controller for displaying conventions
app.controller('conController', function ($scope, conService, $rootScope) {
	//		console.log('debug_conController_enter'); // [DEBUG]
	// $scope.con = {};
		
	//conService should probably be added to the function
	$scope.cons = conService.query();
	$scope.newCon = "";

	$scope.saveCon = function () {
		conService.save({
			conName: $scope.conName,
			conDesc: $scope.conDesc,
			conDateStart: $scope.conDateStart,
			conDateEnd: $scope.conDateEnd,
			conLogo: $scope.conLogo,
			conWww: $scope.conWww,
			conCreate: $scope.conCreate,
			conOwner: $rootScope.current_user,
			conCreatedAt: Date.now()
		}, function () {
			$scope.cons = conService.query();
			$scope.newCon = "";
		});
	};
		
	//allow users to join the current convention
	//helpful link for update (http://www.sitepoint.com/creating-crud-app-minutes-angulars-resource/)
		
	// [DEBUG] - start from the beginning. My request needs to be redone. Missing something in the data.
	$scope.joinCon = function (vIndex) {
		//console.log('enter joinCon() in chirpApp.js'); // [DEBUG]
		//console.log($scope.cons[vIndex].conName); // [DEBUG]
		//console.log('joinCon() in chirpApp.js, $rootScope.current_user = ' + $rootScope.current_user); // [DEBUG]
		
		conService.update({
			conName: $scope.cons[vIndex].conName
		},
			$scope.cons[vIndex]
			);
	};
	
	// show a single con by passing the _id
	$scope.showCon = function (conId) {

	};
});

app.controller('conPageController', function ($http, $scope, conService) {
	//var conSingle = conServiceById.get({ _id: $scope._id });
	var conSingle = conService.get({_id:'55b2d4aefe6d6a5010cb8e21'});
	$scope.conSingle = conSingle;
	console.log($scope.conSingle);
});