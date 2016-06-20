(function () {
    'use strict';

    angular.module('app', ['ngRoute'])
    .controller("aController",function($scope){
        console.log($scope);
    })
	.controller("EfuiCtrl",function($scope,$location){	
		$scope.$on("$viewContentLoaded",function(){
	    	console.log("ng-view content loaded!");
		});	
	 	$scope.$on("$routeChangeStart",function(event,next,current){
	     	console.log("route change start!");
	     	console.log($location.path());
	     	console.log(next);
	     	if($location.path()==='')console.log($location);
	  	});
	})
 	.config(config);

    config.$inject = ['$routeProvider', '$httpProvider'];
    function config($routeProvider, $httpProvider) {
    	var pages = ['component', 'element', 'plugin', 'standard', 'tools'];

		var setRoutes = function(route) {
			var   l =  route.indexOf("/");
			var	view = l!=-1  ? route: route+'/index';
			var tempurl, url;
			url = '/' + route;
			tempurl = {
				templateUrl: view + '.html'
			};
			$routeProvider.when(url, tempurl);
			return $routeProvider;
		};

		pages.forEach(function(route) {
			return setRoutes(route);
		});
        $routeProvider
     	.when('/', {
         	templateUrl: 'common/main.html',
            controller: 'aController'
   		})
      	.otherwise({ redirectTo: '/index.html' });
    }

})();

    