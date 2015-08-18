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
		templateUrl: 'main.html',
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
		templateUrl: 'conInput.html',
		controller: 'conController' // I will need a new controller to list my conventions
	});
});

// // original factory code   
// app.factory('postService', function($http){
// 	var factory = {};
// 	factory.getAll = function(){
// 		return $http.get('/api/posts');
// 		}
// 		return factory;
// 		});

// // original app controller using base factory code
// app.controller('mainController', function($scope, postService){
// 	$scope.posts = [];
// 	$scope.newPost = {created_by: '', text: '', create_at:''};
// 	
// 	postService.getAll().success(function(data){
// 		$scope.posts = data;
// 		});
// 	
// 	$scope.post = function(){
// 		$scope.newPost.created_at = Date.now();
// 		$scope.posts.push($scope.newPost);
// 		$scope.newPost = {created_by: '', text: '', create_at:''};
// 		};
// 	});

// read more about $resource (https://docs.angularjs.org/api/ngResource/service/$resource)
// updated factory with $resource
app.factory('postService', function ($resource) {
	return $resource('/api/posts/:id');
});
		
// new factory
app.factory('conService', function ($resource) {
	return $resource('/api/cons/:id'
	
	// [In Progress] - working on adding update to the factory
	// reference (http://www.sitepoint.com/creating-crud-app-minutes-angulars-resource/)
	// this method issues a PUT request
		, { update: { method: 'PUT' } });
});
	
// updated factory with $resource
app.controller('mainController', function ($scope, postService, $rootScope) {
	$scope.posts = postService.query();
	$scope.newPost = "";

	$scope.post = function () {
		postService.save({
			user: $rootScope.current_user,
			title: $scope.title,
			type: $scope.type,
			time: Date.now(),
			timezone: $scope.timezone,
			duration: $scope.duration,
			system: $scope.system,
			setting: $scope.setting,
			players: $scope.players,
			knowledge: $scope.knowledge,
			maturity: $scope.maturity,
			preGen: $scope.preGen,
			link: $scope.link,
			email: $scope.email,
			name: $scope.name,
			image: $scope.image,
			website: $scope.website,
			join: $scope.join
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
			conCreatedDate: Date.now()
		}, function () {
				$scope.cons = conService.query();
				$scope.newCon = "";
			});
	};
		
	//allow users to join the current convention
	//helpful link for update (http://www.sitepoint.com/creating-crud-app-minutes-angulars-resource/)
		
	// [DEBUG] - start from the beginning. My request needs to be redone. Missing something in the data.
	$scope.joinCon = function () {
		console.log('enter joinCon() in chirpApp.js'); // [DEBUG]
		console.log('joinCon() in chirpApp.js, $scope.conName = ' + $scope.conName); // [DEBUG]
		console.log('joinCon() in chirpApp.js, $rootScope.current_user = ' + $rootScope.current_user); // [DEBUG]
		
		conService.update(
			{ conName: $scope.conName },
			$scope.con
			);
	};
});