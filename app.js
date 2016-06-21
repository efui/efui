(function () {
    'use strict';

    angular.module('app', ['ngRoute','ui.router'])
	.controller("EfuiCtrl",function($scope,$location){	
		var pathes = ['/component', '/element', '/plugin', '/standard', '/tools'];
		$scope.$on("$viewContentLoaded",function(){
	    	console.log("ng-view content loaded!");
		});	
	 	$scope.$on("$routeChangeStart",function(event,next,current){
	     	console.log("route change start!");
	     	var _path = $location.path();
	     	if(pathes.indexOf(_path)!=-1){
	     		
	     		console.log($location);
	     		//$location.path("/index1");
				//return;
	     	}
	     	
	  });
	})
 	.config(config);

    config.$inject = ['$routeProvider', '$httpProvider'];
    function config($routeProvider, $httpProvider) {
    	var pages = ['component', 'element', 'plugin', 'standard', 'tools'];

		var setRoutes = function(route) {
			var   l =  route.indexOf("/:");
			var	view = l!=-1  ? route.substring(0,l): route+'/index';
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
         	templateUrl: 'common/main.html'
   		})
     	.when('/component/:name', {
         	templateUrl: function($routeParams){return 'component/'+$routeParams.name+'.html';}
   		})
     	.when('/element/:name', {
         	templateUrl: function($routeParams){return 'element/'+$routeParams.name+'.html';},
         	controller: function($scope,$location){
         		$scope.docsTit="基本元素";
         		$scope.docsMsg="CSS样式、HTML标签";
         		console.log($scope);
         	},
         	resolve:{ 
				deps: [ '$ocLazyLoad', 
				function ($ocLazyLoad) { 
					console.log($ocLazyLoad);
					//return $ocLazyLoad.load([appJsPath + '/controller/follower/list.js', appVendorPath + '/smarttable/smarttable.js']);
				 	}
				]
	        }
   		})
     	.when('/plugin/:name', {
         	templateUrl: function($routeParams){return 'plugin/'+$routeParams.name+'.html';}
   		})
     	.when('/standard/:name', {
         	templateUrl: function($routeParams){return 'standard/'+$routeParams.name+'.html';}
   		})
     	.when('/tools/:name', {
         	templateUrl: function($routeParams){return 'tools/'+$routeParams.name+'.html';}
   		})
      	.otherwise({ redirectTo: '/index.html' });
    }

})();

    