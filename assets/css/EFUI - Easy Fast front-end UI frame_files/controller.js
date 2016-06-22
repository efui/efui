(function () {
    'use strict';

    angular.module('app', ['ui.router'])
	.controller("EfuiCtrl",function($scope,$location){	
		$scope.$on("$viewContentLoaded",function(){
	    	console.log("ng-view content loaded!");
		});	
	 	$scope.$on("$routeChangeStart",function(event,next,current){
	     	console.log("route change start!");	     	
	  	});
	})
 	.config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
    	$urlRouterProvider.otherwise("/");
        $stateProvider
     	.state('index', {
		   	url: "/",
		   	templateUrl: "common/main.html",
		   	controller:function($scope,$location){
         		$scope.docsTit="Easy Fast UI Frame";
         		$scope.docsMsg="EFUI为一款轻量级前端UI框架，通俗易懂的写法及模块式的拼装方便自由扩展，简单易用，轻量快捷。";
         	}
   		})
//   	.state('standard', {
//		   	url: "/standard",
//		   	templateUrl: "standard/index.html",
//		   	controller:function($scope,$location,$stateParams){
//       		$scope.docsTit="规范";
//       		$scope.docsMsg="CSS规范、HTML规范";
//       	}
// 		})
     	.state('standard', {
		   	url: "/standard/:id",
		   	//templateUrl: "standard/css-hack.html",
		   	//templateUrl: function($routeParams){console.log("$routeParams")},
		   	controller:function($scope,$location,$stateParams){
         		if($location.path().indexOf('/',1)!=-1){
         			console.log($location);         			
         			console.log($location.path().indexOf('/',-1));
         		}         		
         		console.log($stateParams.id);
         		//$location.path(_c_path);
         	}
   		})
     	.state('element', {
		   	url: "/element",
		   	templateUrl: "element/index.html",
		   	controller:function($scope,$location){
         		$scope.docsTit="基本元素";
         		$scope.docsMsg="CSS样式、HTML标签";
         	}
   		})
	    .state('element.font', {
	      	url: "/font",
	      	templateUrl: "element/font.html"
	    })
	    .state('element.button', {
	      	url: "/button",
	      	templateUrl: "element/button.html"
	    })
     	.state('component', {
		   	url: "/component",
		   	templateUrl: "component/index.html",
		   	controller:function($scope,$location){
         		$scope.docsTit="组件";
         		$scope.docsMsg="基本组件、web组件";
         	}
   		})
     	.state('plugin', {
		   	url: "/plugin",
		   	templateUrl: "plugin/index.html",
		   	controller:function($scope,$location){
         		$scope.docsTit="插件";
         		$scope.docsMsg="基于jQuery库的插件介绍";
         	}
   		})
     	.state('tools', {
		   	url: "/tools",
		   	templateUrl: "tools/index.html",
		   	controller:function($scope,$location){
         		$scope.docsTit="进阶";
         		$scope.docsMsg="前端技能进阶";
         	}
   		})
    }

})();

    