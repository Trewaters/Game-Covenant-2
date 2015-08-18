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
		})
		.when('/usrProfile',{
			templateUrl: 'usrProfile-ngresource.html',
			controller: 'usrPageController'
		})
		.when('/eveProfile', {
			templateUrl: 'eveProfile-ngresource.html',
			controller: 'evePageController'
		}) ;
});

// read more about $resource (https://docs.angularjs.org/api/ngResource/service/$resource)
// factory for all event post
app.factory('postService', function ($resource) {
	return $resource('/api/posts'
		,{}
		,{
			'update': { method: 'PUT' }
		});
});

// factory for a single event by _id
app.factory('eveService', function ($resource) {
	return $resource('/api/eveProfile',{});
});
	
// new factory
app.factory('conService', function ($resource) {
	return $resource(
		'/api/cons'
		, {}
		, { 'update': { method: 'PUT' } }
		);
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

// factory for users
app.factory('usrService', function($resource){
	return $resource('/api/usrProfile',{});
});

// factory for user by ID
app.factory('usrServiceById', function($resource){
	return $resource('/api/usrProfile/:id',{id:'@_id'});
});

// [TO DO] create an eveTracker for event data
// create a usrTracker for User data
app.factory('usrTracker', function(){
	
	var vUsrProfile = {
		usrSingle : 'usrSingle'
		,usrEmail : 'usrEmail'
		,usrFirst : 'usrFirst'
		,usrLast : 'usrLast'
		,usrTimezone : 'usrTimezone'
		,usrCountry : 'usrCountry'
		,usrZipCode : 'usrZipCode'
		,usrGender : 'usrGender'
		,usrBirth : 'usrGender'
		,usrPrefHours : 'usrPrefHours'
		,usrSocAuth : 'usrSocAuth'
		,usrCreatedDate : 'usrCreatedDate'
	};
	
	return {
		getProperty: function(){
			return vUsrProfile;
		},
		setProperty: function(value){
			vUsrProfile = value;
		}
	};
	
});

// factory to hold convention data between controllers
app.factory('conTracker',function(){
	// Reference http://stackoverflow.com/questions/12008908/how-can-i-pass-variables-between-controllers - at first glance
	//   I like the way this one looks.
	
	var vConProfile = {
			conId: 'id'
			, conName: 'conName'
			, conDesc: 'conDesc'
			, conDateStart: 'conDateStart'
			, conDateEnd: 'conDateEnd'
			, conLogo: 'conLogo'
			, conWww: 'conWww'
			, conCreate: 'conCreate'
			, conOwner: 'conOwner'
			, conCreatedDate: 'conCreatedDate'
			, conPlayerList: 'conPlayerList'
	};
	
	return{
		getProperty: function(){
			return vConProfile;
		},
		setProperty: function(value){
			vConProfile = value;
		}
	};
});
	
	// factory to hold convention
	app.factory('eveTracker', function(){
		var vEveProfile = {
			eveUser:'eveUser'
			,eveTitle:'eveTitle'
			,eveType:'eveType'
			,eveTimezone:'eveTimezone'
			,eveDuration:'eveDuration'
			,eveSystem:'eveSystem'
			,eveSetting:'eveSetting'
			,evePlayMax:'evePlayMax'
			,eveKnow:'eveKnow'
			,eveMaturity:'eveMaturity'
			,evePreGen:'evePreGen'
			,eveLink:'eveLink'
			,eveEmail:'eveEmail'
			,eveHost:'eveHost'
			,eveImage:'eveImage'
			,eveWebsite:'eveWebsite'
			,eveJoin:'eveJoin'
			,eveRegCon:'eveRegCon'
			,eveComplete:'eveComplete'
			,eveApproved:'eveApproved'
			,eveCreateDate:'eveCreateDate'
			,evePlayers:'evePlayers'
		};
		
		return{
			getProperty:function(){
				return vEveProfile;
			},
			setProperty: function(value){
				vEveProfile = value;
			}
			
		};
	});
// updated factory with $resource
app.controller('mainController', function ($scope, postService, eveService, eveTracker, usrTracker, usrService, $rootScope, conService) {
	$scope.posts = postService.query();
	$scope.newPost = "";
	$scope.cons = conService.query();
	
	/* Testing	*/
	//values only for testing
	$scope.eveTitle = 'Title - ' + Date.now();
	$scope.eveType = 'Game';
	$scope.eveTimezone = 'Pacific Standard Time, -8:00 UTC';
	$scope.eveDuration = 6;
	$scope.eveSystem = 'The Matrix RPG';
	$scope.eveSetting = 'Setting';
	$scope.evePlayMax = 3;
	$scope.eveKnow = 'Never Played';
	$scope.eveMaturity = 'NC 17: No Children (17+)';
	$scope.evePreGen = 'true';
	$scope.eveLink = 'http://www.LugCon.com';
	$scope.eveEmail = 'trewaters@hotmail.com';
	$scope.eveHost = $rootScope.current_user;
	$scope.eveImage = 'http://www.LugCon.com';
	$scope.eveWebsite = 'http://www.LugCon.com';
	$scope.eveJoin = 'http://www.LugCon.com';
	/* END Testing */

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
			eveRegCon: $scope.eveRegCon,
			eveApproved: false,
			eveComplete: false,
			eveCreatedDate: Date.now()
		},
			function () {
				$scope.posts = postService.query();
				$scope.newPost = "";
			});
	};
	
	$scope.showUser = function(vUsername){
		
		//console.log('$scope.showUser vUsername = ' + vUsername); // DEBUG
		
		usrTracker.setProperty(usrService.get({username:vUsername}));
	};
	
	$scope.showEve = function(vEveTitle){
		
		console.log('$scope.showEve vUsername = ' + vEveTitle); // DEBUG
		
		eveTracker.setProperty(eveService.get({eveTitle:vEveTitle}));
	};
	
	$scope.joinEve = function(vIndex){
		
		//console.log('vIndex = ' + vIndex); // DEBUG
		
		postService.update(
			{eveTitle:$scope.posts[vIndex].eveTitle}
			,{
			eveUser: $rootScope.current_user,
			eveTitle: $scope.posts[vIndex].eveTitle,
			eveType: $scope.posts[vIndex].eveType,
			eveTime: $scope.posts[vIndex].eveTime,
			eveTimezone: $scope.posts[vIndex].eveTimezone,
			eveDuration: $scope.posts[vIndex].eveDuration,
			eveSystem: $scope.posts[vIndex].eveSystem,
			eveSetting: $scope.posts[vIndex].eveSetting,
			evePlayMax: $scope.posts[vIndex].evePlayMax,
			eveKnow: $scope.posts[vIndex].eveKnow,
			eveMaturity: $scope.posts[vIndex].eveMaturity,
			evePreGen: $scope.posts[vIndex].evePreGen,
			eveLink: $scope.posts[vIndex].eveLink,
			eveEmail: $scope.posts[vIndex].eveEmail,
			eveHost: $scope.posts[vIndex].eveHost,
			eveImage: $scope.posts[vIndex].eveImage,
			eveWebsite: $scope.posts[vIndex].eveWebsite,
			eveJoin: $scope.posts[vIndex].eveJoin,
			eveRegCon: $scope.posts[vIndex].eveRegCon,
			eveApproved: $scope.posts[vIndex].eveApproved,
			eveComplete: $scope.posts[vIndex].eveComplete,
			eveCreatedDate: $scope.posts[vIndex].eveCreatedDate,
			evePlayers : $scope.posts[vIndex].evePlayers
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
app.controller('conController', function ($scope, conService, conServiceById, conTracker, $rootScope) {

	$scope.cons = conService.query();
	$scope.newCon = "";

	//values only for testing
	$scope.conName = 'conName - ' + Date.now();
	$scope.conDesc = 'Convention Description';
	$scope.conDateStart = Date.now();
	$scope.conDateEnd = Date.now();
	$scope.conLogo = 'http://www.LugCon.com';
	$scope.conWww = 'http://www.LugCon.com';
	$scope.conCreate = 'true';
	/* END Testing */

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
			conPlayerList: $rootScope.current_user,
			conCreatedDate: Date.now()
		}, function () {
			$scope.cons = conService.query();
			$scope.newCon = "";
		});
	};
		
	//allow users to join the current convention
	$scope.joinCon = function (vIndex) {
		conService.update({
			conName: $scope.cons[vIndex].conName
		},
			{
				conName: $scope.cons[vIndex].conName,
				conDesc: $scope.cons[vIndex].conDesc,
				conDateStart: $scope.cons[vIndex].conDateStart,
				conDateEnd: $scope.cons[vIndex].conDateEnd,
				conLogo: $scope.cons[vIndex].conLogo,
				conWww: $scope.cons[vIndex].conWww,
				conCreate: $scope.cons[vIndex].conCreate,
				conOwner: $rootScope.current_user,
				conCreatedDate: Date.now(),
				conPlayerList: $rootScope.current_user
			}
			);
	};
	
	// How to pass data between controllers
	// Reference http://stackoverflow.com/questions/20181323/passing-data-between-controllers-in-angular-js
	// Reference http://stackoverflow.com/questions/17952620/angularjs-service-passing-data-between-controllers - this 
	//  seems to use services and not a factory 

	// show a single con by passing the _id
	$scope.showCon = function (conId) {
		//use 'get' request to search data based on the conID that is passed back
		
		// query data and add to service
		conTracker.setProperty(conServiceById.get({id:conId}));

	};
});

app.controller('conPageController', function ($scope, conTracker, postService) {
	// get the value stored in gTracker and assign it to the scope
	var conSingle = conTracker.getProperty();
	$scope.conSingle = conSingle;
	
	// show events for this convention
	$scope.conEvents = postService.query();
});

app.controller('usrPageController', function($scope,usrService, usrTracker){
	
	var usrSingle = usrTracker.getProperty();
	$scope.usrSingle = usrSingle;
	
	console.log('$scope.usrSingle = ' + $scope.usrSingle); // [DEBUG]
});

app.controller('evePageController',function($scope,eveTracker,postService){
	
	var eveSingle = eveTracker.getProperty();
	$scope.eveSingle = eveSingle;
	
	console.log('$scope.eveSingle = ' + $scope.eveSingle); // [DEBUG]
});