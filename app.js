define(function(require, exports, module) {
	var angular = require('angular');

	require('angular-ui-router');

	var app = angular.module('app', ['ui.router']);
	
	
	/* 缓存模板templateUrl */
	app.run(["$templateCache", function($templateCache) {
	 	$templateCache.put("hello.html", "<div><h1>Hi 我是林炳文~~~6666</h1></div>"); 
	 	$templateCache.put("hello2.html", "<div><h1>Hi 我是林炳文~~~8888</h1></div>"); 
	 	$templateCache.put("toptitle.html", '<h3 class="mb10" ng-repeat="data in menulist">'+
			'<span ng-repeat="item in data.likes">'+
				'<span class="red" ng-if="!item.submenu && item.title == pagename">{{item.title}}</span>'+
				'<span ng-if="item.submenu" ng-repeat="subitem in item.submenu">'+
					'<span ng-if="pagename == subitem.url">{{subitem.name}}</span>'+
				'</span>'+
			'</span>'+
		'</h3>'); 
	 	
	}]); 
	app.controller('MainController', function ($scope) { 
	 	$scope.name = '林炳文'; 
	}); 

	app
		.config(config)
		.run(run);

	config.$inject = ['$stateProvider', '$urlRouterProvider'];

	function config($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/");
		$stateProvider
			.state('index', {
				url: "/",
				templateUrl: "common/main.html",
				controller: function($scope, $location) {	
					$scope.docsTit = "Easy Fast UI Frame";
					$scope.docsMsg = "EFUI为一款轻量级前端UI框架，通俗易懂的写法及模块式的拼装方便自由扩展，简单易用，轻量快捷。"; 					
				}
			})
			.state('standard', {
				url: "/standard",
				templateUrl: "standard/index.html",
				controller: function($scope, $location) {
					$scope.docsTit = "规范";
					$scope.docsMsg = "CSS规范、HTML规范、JavaScript规范、浏览器兼容性";
				}
			})
			.state('standard.pages', {
				url: "/:pageid",
				templateUrl: function($paramid){return 'standard/'+$paramid.pageid+'.html';}
			})
			.state('element', {
				url: "/element",
				templateUrl: "element/index.html",
				controller: function($scope, $location) {
					$scope.docsTit = "基本元素";
					$scope.docsMsg = "CSS样式、HTML标签";
				}
			})
			.state('element.pages',{
				url:'/:pageid',
				templateUrl:function($paramid){return 'element/'+$paramid.pageid+'.html';}
			})
			.state('component', {
				url: "/component",
				templateUrl: "component/index.html",
				controller: function($scope, $location) {
					$scope.docsTit = "组件";
					$scope.docsMsg = "基本组件、web组件";
				}
			})
			.state('component.pages', {
				url: "/:pageid",
				templateUrl: function($routeParams){return 'component/'+$routeParams.pageid+'.html'}
			})
			.state('plugin', {
				url: "/plugin",
				templateUrl: "plugin/index.html",
				controller: function($scope, $location) {
					$scope.docsTit = "插件";
					$scope.docsMsg = "基于jQuery库的插件介绍";
				}
			})
			.state('plugin.pages', {
				url: "/:pageid",
				templateUrl: function($routeParams){return 'plugin/'+$routeParams.pageid+'.html'}
			})
			.state('skills', {
				url: "/skills",
				templateUrl: "skills/index.html",
				controller: function($scope, $location) {
					$scope.docsTit = "进阶";
					$scope.docsMsg = "前端技能进阶";
				}
			})			
			.state('skills.pages', {
				url: "/:pageid",
				templateUrl: function($routeParams){return 'skills/'+$routeParams.pageid+'.html'}
			})
			.state('angular', {
				url: "/angular",
				templateUrl: "angular/index.html",
				controller: function($scope, $location) {
					$scope.docsTit = "前端框架库";
					$scope.docsMsg = "以Javascript语言为基础搭建的编程框架"; 
					$scope.isShow = false; 
					$scope.menulist = [  
					    {  
					        "firstName": "Angular", 
					        "likes": [
					        	{
					        		'title':"SPA",
					        		'submenu':[
					        			{'name':"表单验证",'url':"angular-form-validate"},
					        			{'name':"子页面2",'url':"angular-spa2"},
					        			{'name':"子页面3",'url':"angular-spa3"}
					        		]
					        	}
					        ]
					    },  
					    {  
					        "firstName": "Vue", 
					        "likes": [
					        	{
					        		'title':"vue",
					        		'submenu':[
					        			{'name':"vue入门",'url':"vue"}
					        		]
					        	}
					        ]
					    },
					    {
					    	"firstName":"Backbone",
					    	"likes":[
					    		{
					    			'title':'backbone',
					    			'url':'backbone'
					    		}
					    	]
					    }
					];
					$scope.submitForm = function(isValid) {
		                if (!isValid) {
		                    alert('验证失败');
		                }
		            };
				}
			})
			.state('angular.pages', {
                url: '/:pageid',
				templateUrl:function($routeParams){return 'angular/'+$routeParams.pageid+'.html';},
				controller: function($scope, $location,$state,$stateParams,$element) {
					$scope.pagename = $stateParams.pageid;
//					console.log($element);
//					console.log($state);
//					console.log($stateParams);
				}
			})
	}

	run.$inject = ['$rootScope', '$location'];
	

	function run($rootScope, $location) {
		$rootScope.path = $location.path();
		$rootScope.$on('$locationChangeSuccess', function() {
			var _path = $location.path().substring(1);
			var _vpath = _path.indexOf('/');
			//console.log("$locationChangeSuccess");
			$rootScope.path = _vpath != -1 ? $location.path().substring(0, _vpath + 1) : $location.path();
		});
		$rootScope.$on("$viewContentLoaded", function(event, next) {
			//console.log("$viewContentLoaded");
		
			next.substring(1) && $('pre').each(function() {
				var _p_class = $(this).parent().get(0).className;
				$(this).html($(this).html().replace(/</g, '&lt;').replace(/>/g, '&gt;'));
				!(/\bhtml\b/.test(_p_class)) && $(this).addClass("prettyprint linenums") && prettyPrint();
			});

			var _h = $(window).height();
			var _p = $('.view-container');
			var _o = $('.sidebar-menu'),
				_o_p = _o.parent(),
				_o_p_p = _o_p.parent();
			var _dif = _p.outerHeight(true) - _p.height();
			var _o_dif = _o_p_p.outerHeight(true) - _o_p_p.height();

			if(next.substring(1)) {
				_dif = _h - _dif;
				_p.children().each(function() {
					_dif -= !$(this).hasClass('container') ? $(this).height() : 0;
				});
				_o.css({
					'max-height': _dif - _o_dif,
					'overflow-y': 'auto',
					'width': _o_p.width()
				});
			}
		})
	}
	
	
	//directive定义
	app.directive('headerpanel', function () {
	 	return { 
	 		restrict: 'EA', 
	 		templateUrl: 'common/header.html'
	 	}; 
	}); 
	app.directive('footerpanel', function () {
	 	return { 
	 		restrict: 'EA', 
	 		templateUrl: 'common/footer.html'
	 	}; 
	}); 
	app.directive('my-class', function () {
	    return {
	    	restrict: 'C'
	    };
	});
	app.directive('panel', function () {
	    return {
	    	restrict: 'E',
	 		replace: true,
	        template: '<div><div ng-transclude class="sidebar-slide-overlay"></div></div>',
	        transclude: true,
	        link:function(scope){
	        	scope.things = [11,22,33];
				scope.data =  [
				    {
				        str: '表单a'
				    },
				    {
				        str: '表单b'
				    },
				    {
				        str: '表单c'
				    }
				]; 
	        }
	    };
	});
	app.directive('expander', function () {
	    return {
	    	restrict: 'EA',
	    	transclude : true,
	 		replace: true,
	        template : '<div ng-transclude></div>',
	        link : function(scope, element, attrs) {
	            scope.showMe = false;
				scope.title = '点击展开';
				scope.title2 = '点击缩回';
				scope.text = '这里是内部的内容。';
				scope.data =  [
				    {
				        str: '表单a'
				    }
				]; 
				scope.className = function() {
			        var className = 'initClass';	
			        var _num = parseInt(scope.$index);
			        if (++_num)
			            className += _num;			
			        return className;
			    };
//				console.log(scope.$index);
	            scope.toggle = function toggle() {
	            	console.log('toggle me!');
	                scope.showMe = !scope.showMe;
	            }
	        }
	    };
	});	
	
	app.directive('topTitle', function() {
	 	return { 
	 		restrict: 'EA', 
		 	scope:true, 
	 		templateUrl: 'toptitle.html', 
	 		replace: true 
	 	}; 
	}); 
	app.directive('helloWorld', function() { 
	 	return { 
	 		restrict: 'EA', 
		 	scope:true, 
	 		templateUrl: 'hello.html', 
	 		replace: true 
	 	}; 
	}); 
	app.directive("helloWorld2",function(){ 
	 	return{ 
	 		restrict:'EAC', 
	 		transclude: true, //注意此处必须设置为true 
	 		controller: function ($scope, $element,$attrs,$transclude,$log) { //在这里你可以注入你想注入的服务 
			  	$transclude(function (clone) { 
			   		var a = angular.element('<p>'); 
//			   		a.css('color', $attrs.mycolor); 
			   		a.text(clone.text()); 
//			   		$element.append(a); 
//			   		var a = $transclude(); //$transclude()就是嵌入的内容
			   		a.css('color', $attrs.mycolor); 
  					$element.append(a); 
//			  		$log.info(clone); 
			  	}); 
//			  	$log.info("hello everyone"); 
	        } 
	 	}; 
	}); 
	app.directive('myDirective', function () { 
	 	return { 
		 	restrict: 'EA', 
		 	scope:true, 
		 	template: '<div>儿子:{{ name }}<input ng-model="name"/></div>' 
		}; 
	});
	app.directive('multipleEmail', [function () {
      	return {
          	require: "ngModel",
          		link: function (scope, element, attr, ngModel) {
              	if (ngModel) {
                  	var emailsRegexp = /^([a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*[;；]?)+$/i;
              	}
              	var customValidator = function (value) {
                  	var validity = ngModel.$isEmpty(value) || emailsRegexp.test(value);
                  	ngModel.$setValidity("multipleEmail", validity);
                  	return validity ? value : undefined;
              	};
              	ngModel.$formatters.push(customValidator);
              	ngModel.$parsers.push(customValidator);
          	}
		};
	}]);
});
