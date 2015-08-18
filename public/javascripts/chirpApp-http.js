/// <reference path="../../typings/angularjs/angular.d.ts"/>
//chirpApp.js

var app = angular.module('chirpApp', ['ngRoute']).run(function ($http, $rootScope) {
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
		})
	//the convention profile page
		.when('/conProfile', {
			templateUrl: 'conProfile.html',
			controller: 'conPageController'
		});
});

/*
[NOTE] - Looking at this after I read might be duplicating work just to make the model a class
I only use the fields once in my controller. I guess if I had more controllers this would allow some consistancy
because I would have a class that mimics the model and should restrict me from adding strange data to my model
??? not decided on this yet.

// [IN PROGRESS] add a factory for defining con
// a con class so I can avoid defining my con everytime I need it
// [REFERENCE] https://medium.com/opinionated-angularjs/angular-model-objects-with-javascript-classes-2e6a067c73bc class creation of data model
// [REFERENCE] http://www.webdeveasy.com/angularjs-data-model/ create services around data model
app.factory('conClass', function (lugConvention) {
	// Constructor, with class name
	function conClass(conName, conDesc, conDateStart, conDateEnd, conLogo, conWww, conCreate, conOwner, conCreatedDate, conPlayerList) {
		this.conName = conName;
		this.conDesc = conDesc;
		this.conDateStart = conDateStart;
		this.conDateEnd = conDateEnd;
		this.conLogo = conLogo;
		this.conWww = conWww;
		this.conCreate = conCreate;
		this.conOwner = conOwner;
		this.conCreatedDate = conCreatedDate;
		this.conPlayerList = conPlayerList;
		this.lugConvention = lugConvention; // added this because the example has it, referencing passed variable to parent function
	}
	
	// Public method, assigned to prototype
	// create this for using later
	// [REFERENCE] http://www.w3schools.com/js/js_object_prototypes.asp I don't fully understand 'prototype'
	conClass.prototype.vPost = function () {
		// 'POST' - create a convention and add to mongo
	};
	
	// Private property example
	var vConCreate = ['true', 'false'];
	
	//	Private function
	function checkConCreate(vConCreate) {
		return vConCreate.indexOf(vConCreate) !== -1;
	}
	
	// Static property example
	// Using copy to prevent modifications to private property
	conClass.vConCreate = angular.copy(vConCreate);

	// Static method, assigned to class
	// Instance ('this') is not available in static context
	conClass.build = function (data) {
		if (!checkConCreate(data.role)) {
			return;
		}
		return new ConClass(
			data.conName,
			data.conDesc,
			data.conDateStart,
			data.conDateEnd,
			data.conLogo,
			data.conWww,
			data.conCreate,
			data.conOwner,
			data.conCreatedDate,
			data.conPlayerList,
			lugConvention.build(data.lugConvention) // another model
			);
	};
	// Retrun the constructor function
	return conClass
});
*/


// read more about $resource (https://docs.angularjs.org/api/ngResource/service/$resource)
// updated factory with $resource
app.factory('postService', function ($http) {
	var factory = {};
	//get all the user posts
	factory.getAll = function () {
		return $http.get('/api/posts');
	};
		
	//submit post data to post api
	factory.fSaveEvent = function (data) {
		$http.post('/api/posts', data).error(function (data, err) { });
	};
	return factory;
});
		
// factory for Convention actions
app.factory('conService', function ($http) {

	var factory = {};
	//get all the convention events
	factory.getAll = function () {
		return $http.get('/api/cons');
	};

	// submit con data to api
	factory.fSaveCon = function (data) {
		$http.post('/api/cons', data).error(function (data, err) { });
	};
	
	// submit updated con data to api
	// want to add a convention registrant
	factory.fRegPlayer = function (data) {
		$http.put('/api/cons', data).error(function (data, err) { });
	};

	return factory;
});

// factory for single convention information
app.factory('conSingle', function ($http) {

	var factory = {};
	//get a single convention's details
	factory.getSingle = function () {
		return $http.get('/api/conProfile');
	};
	return factory;
});
	
// updated factory with $resource
app.controller('mainController', function ($scope, postService, $rootScope, conService) {
	
	// get all post
	postService.getAll().success(function (data) {
		$scope.posts = data;
	});

	conService.getAll().success(function (data) {
		$scope.cons = data;
	});

	$scope.saveEvent = function () {
		// all post data
		postService.fSaveEvent({
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
			eveRegCon: $scope.eveRegCon
		}); // save post to mongo
	};
		
	// refresh all post
	postService.getAll().success(function (data) {
		$scope.posts = data;
	});
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
	
	//show all convention events
	conService.getAll().success(function (data) {
		$scope.cons = data;
	});
	
	//save convention event data
	$scope.saveCon = function () {
		conService.fSaveCon({
			conName: $scope.conName,
			conDesc: $scope.conDesc,
			conDateStart: $scope.conDateStart,
			conDateEnd: $scope.conDateEnd,
			conLogo: $scope.conLogo,
			conWww: $scope.conWww,
			conCreate: $scope.conCreate,
			conOwner: $rootScope.current_user,
			conCreatedDate: Date.now(),
			conPlayerList: $rootScope.current_user//,
			//_conId: New
		});
	};
	
	//allow users to join the current convention
	$scope.joinCon = function (index) {
		conService.fRegPlayer({
			conName: $scope.cons[index].conName,
			conDesc: $scope.cons[index].conDesc,
			conDateStart: $scope.cons[index].conDateStart,
			conDateEnd: $scope.cons[index].conDateEnd,
			conLogo: $scope.cons[index].conLogo,
			conWww: $scope.cons[index].conWww,
			conCreate: $scope.cons[index].conCreate,
			conOwner: $rootScope.current_user,
			conCreatedDate: Date.now(),
			conPlayerList: $rootScope.current_user
		});
	};
	
	//show all convention events, with updated data
	conService.getAll().success(function (data) {
		$scope.cons = data;
	});
});

app.controller('conPageController', function ($scope, $rootScope, conSingle) {
conSingle.getSingle().success(function(data){
	$scope.conSingle = data;
});
});