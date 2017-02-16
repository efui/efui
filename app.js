define(function(require, exports, module) {
	var angular = require('angular');

	require('angular-ui-router');

	var app = angular.module('myapp', ['ui.router']);
	
	//directive定义
	app.directive('headerPanel', function () {
	 	return { 
	 		restrict: 'EA', 
	 		templateUrl: 'common/header.html'
	 	}; 
	}); 
	app.directive('footerPanel', function () {
	 	return { 
	 		restrict: 'EA', 
	 		templateUrl: 'common/footer.html'
	 	}; 
	}); 
	app.directive('tabpanel', function () {
	    return {
	    	restrict: 'A'
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
	        template: 'Hi there <span ng-transclude></span>',
	        transclude: true,
	        link:function(scope){
	        	scope.things = [1,2,3];
	        }
	    };
	});
	app.directive('expander', function () {
	    return {
	    	restrict: 'EA',
	    	transclude : true,
	    	replace:true,
	        template : '<div>'
	                 + '<div class="title" ng-click="toggle()"><span ng-hide="showMe">{{title}}</span><span ng-show="showMe">{{title2}}</span></div>'
	                 + '<div class="body" ng-show="showMe" ng-transclude></div>'
	                 + '</div>',
	        link : function(scope, element, attrs) {
	            scope.showMe = false;
				scope.title = '点击展开';
				scope.title2 = '点击缩回';
				scope.text = '这里是内部的内容。';
	            scope.toggle = function toggle() {
	                scope.showMe = !scope.showMe;
	            }
	        }
	    };
	});	
	app.directive('helloWorld', function() { 
	 	return { 
	 		restrict: 'E', 
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
			  		$log.info(clone); 
			  	}); 
			  	$log.info("hello everyone"); 
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
	
	app.run(["$templateCache", function($templateCache) {
	 	$templateCache.put("hello.html", "<div><h1>Hi 我是林炳文~~~6666</h1></div>"); 
	 	$templateCache.put("hello2.html", "<div><h1>Hi 我是林炳文~~~8888</h1></div>"); 
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
			.state('standard.format', {
				url: "/format",
				templateUrl: "standard/css-format.html"
			})
			.state('standard.cssname', {
				url: "/cssname",
				templateUrl: "standard/css-name.html"
			})
			.state('standard.csssort', {
				url: "/csssort",
				templateUrl: "standard/css-sort.html"
			})
			.state('standard.cssoptimize', {
				url: "/cssoptimize",
				templateUrl: "standard/css-optimize.html"
			})
			.state('standard.html', {
				url: "/htmlformat",
				templateUrl: "standard/html-format.html"
			})
			.state('standard.htmlname', {
				url: "/htmlname",
				templateUrl: "standard/html-name.html"
			})
			.state('standard.js', {
				url: "/jsformat",
				templateUrl: "standard/js-format.html"
			})
			.state('standard.jsname', {
				url: "/jsname",
				templateUrl: "standard/js-name.html"
			})
			.state('standard.compatible', {
				url: "/compatible",
				templateUrl: "standard/compatible.html"
			})
			.state('standard.compatiblecss', {
				url: "/compatiblecss",
				templateUrl: "standard/compatible-css.html"
			})
			.state('standard.compatiblejs', {
				url: "/compatiblejs",
				templateUrl: "standard/compatible-js.html"
			})
			.state('element', {
				url: "/element",
				templateUrl: "element/index.html",
				controller: function($scope, $location) {
					$scope.docsTit = "基本元素";
					$scope.docsMsg = "CSS样式、HTML标签";
				}
			})
			.state('element.normalize', {
				url: "/normalize",
				templateUrl: "element/normalize.html"
			})
			.state('element.layout', {
				url: "/layout",
				templateUrl: "element/layout.html"
			})
			.state('element.publish', {
				url: "/publish",
				templateUrl: "element/publish.html"
			})
			.state('element.font', {
				url: "/font",
				templateUrl: "element/font.html"
			})
			.state('element.button', {
				url: "/button",
				templateUrl: "element/button.html"
			})
			.state('element.code', {
				url: "/code",
				templateUrl: "element/code.html"
			})
			.state('element.input', {
				url: "/input",
				templateUrl: "element/input.html"
			})
			.state('element.textarea', {
				url: "/textarea",
				templateUrl: "element/textarea.html"
			})
			.state('element.select', {
				url: "/select",
				templateUrl: "element/select.html"
			})
			.state('element.table', {
				url: "/table",
				templateUrl: "element/table.html"
			})
			.state('element.image', {
				url: "/image",
				templateUrl: "element/image.html"
			})
			.state('component', {
				url: "/component",
				templateUrl: "component/index.html",
				controller: function($scope, $location) {
					$scope.docsTit = "组件";
					$scope.docsMsg = "基本组件、web组件";
				}
			})
			.state('component.buttons', {
				url: "/buttons",
				templateUrl: "component/buttons.html"
			})
			.state('component.inputtext', {
				url: "/inputtext",
				templateUrl: "component/input-text.html"
			})
			.state('component.inputradiocheckbox', {
				url: "/inputradiocheckbox",
				templateUrl: "component/input-radiocheckbox.html"
			})
			.state('component.inputfile', {
				url: "/inputfile",
				templateUrl: "component/input-file.html"
			})
			.state('component.select', {
				url: "/select",
				templateUrl: "component/select.html"
			})
			.state('component.textarea', {
				url: "/textarea",
				templateUrl: "component/textarea.html"
			})
			.state('component.labeltext', {
				url: "/labeltext",
				templateUrl: "component/label-text.html"
			})
			.state('component.labeltag', {
				url: "/labeltag",
				templateUrl: "component/label-tag.html"
			})
			.state('component.labelbadge', {
				url: "/labelbadge",
				templateUrl: "component/label-badge.html"
			})
			.state('component.webheader', {
				url: "/webheader",
				templateUrl: "component/web-header.html"
			})
			.state('component.webnav', {
				url: "/webnav",
				templateUrl: "component/web-nav.html"
			})
			.state('component.webmenu', {
				url: "/webmenu",
				templateUrl: "component/web-menu.html"
			})
			.state('component.websearch', {
				url: "/websearch",
				templateUrl: "component/web-search.html"
			})
			.state('component.webtipsstatus', {
				url: "/webtipsstatus",
				templateUrl: "component/web-tips-status.html"
			})
			.state('component.webtipsnews', {
				url: "/webtipsnews",
				templateUrl: "component/web-tips-news.html"
			})
			.state('component.webtipsfloat', {
				url: "/webtipsfloat",
				templateUrl: "component/web-tips-float.html"
			})
			.state('component.webtabs', {
				url: "/webtabs",
				templateUrl: "component/web-tabs.html"
			})
			.state('component.webfold', {
				url: "/webfold",
				templateUrl: "component/web-fold.html"
			})
			.state('component.webtitle', {
				url: "/webtitle",
				templateUrl: "component/web-title.html"
			})
			.state('component.websidebar', {
				url: "/websidebar",
				templateUrl: "component/web-sidebar.html"
			})
			.state('component.weblisttext', {
				url: "/weblisttext",
				templateUrl: "component/web-list-text.html"
			})
			.state('component.weblisttextimg', {
				url: "/weblisttextimg",
				templateUrl: "component/web-list-textimg.html"
			})
			.state('component.weblistcomment', {
				url: "/weblistcomment",
				templateUrl: "component/web-list-comment.html"
			})
			.state('component.webprogress', {
				url: "/webprogress",
				templateUrl: "component/web-progress.html"
			})
			.state('component.webpop', {
				url: "/webpop",
				templateUrl: "component/web-pop.html"
			})
			.state('component.webad', {
				url: "/webad",
				templateUrl: "component/web-ad.html"
			})
			.state('component.webpagination', {
				url: "/webpagination",
				templateUrl: "component/web-pagination.html"
			})
			.state('component.webfooter', {
				url: "/webfooter",
				templateUrl: "component/web-footer.html"
			})
			.state('component.applogin', {
				url: "/applogin",
				templateUrl: "component/app-login.html"
			})
			.state('plugin', {
				url: "/plugin",
				templateUrl: "plugin/index.html",
				controller: function($scope, $location) {
					$scope.docsTit = "插件";
					$scope.docsMsg = "基于jQuery库的插件介绍";
				}
			})
			.state('plugin.picslider', {
				url: "/picslider",
				templateUrl: "plugin/picslider.html"
			})
	     	.state('plugin.popup', {
			   	url: "/popup",
			   	templateUrl: "plugin/popup.html"
	   		})
			.state('plugin.waterfall', {
				url: "/waterfall",
				templateUrl: "plugin/waterfall.html"
			})
			.state('plugin.alert', {
				url: "/alert",
				templateUrl: "plugin/alert.html"
			})
			.state('plugin.dialog', {
				url: "/dialog",
				templateUrl: "plugin/dialog.html"
			})
			.state('plugin.tooltips', {
				url: "/tooltips",
				templateUrl: "plugin/tooltips.html"
			})
			.state('plugin.keyboard', {
				url: "/keyboard",
				templateUrl: "plugin/keyboard.html"
			})
			.state('plugin.picker', {
				url: "/picker",
				templateUrl: "plugin/picker.html"
			})
			.state('plugin.highchart', {
				url: "/highchart",
				templateUrl: "plugin/highchart.html"
			})
			.state('plugin.totop', {
				url: "/totop",
				templateUrl: "plugin/totop.html"
			})
			.state('plugin.tagcloud', {
				url: "/tagcloud",
				templateUrl: "plugin/tagcloud.html"
			})
			.state('plugin.fullswitch', {
				url: "/fullswitch",
				templateUrl: "plugin/fullswitch.html"
			})
			.state('plugin.autoscroll', {
				url: "/autoscroll",
				templateUrl: "plugin/autoscroll.html"
			})
			.state('plugin.scrollspy', {
				url: "/scrollspy",
				templateUrl: "plugin/scrollspy.html"
			})
			.state('plugin.iscroll', {
				url: "/iscroll",
				templateUrl: "plugin/iscroll.html"
			})
			.state('plugin.datetime', {
				url: "/datetime",
				templateUrl: "plugin/datetime.html"
			})
			.state('plugin.select', {
				url: "/select",
				templateUrl: "plugin/select.html"
			})
			.state('plugin.radiocheckbox', {
				url: "/radiocheckbox",
				templateUrl: "plugin/radiocheckbox.html"
			})
			.state('plugin.validate', {
				url: "/validate",
				templateUrl: "plugin/validate.html"
			})
			.state('skills', {
				url: "/skills",
				templateUrl: "skills/index.html",
				controller: function($scope, $location) {
					$scope.docsTit = "进阶";
					$scope.docsMsg = "前端技能进阶";
				}
			})
			.state('skills.js', {
				url: "/js",
				templateUrl: "skills/js.html"
			})
			.state('skills.module', {
				url: "/module",
				templateUrl: "skills/module.html"
			})
			.state('skills.mvc', {
				url: "/mvc",
				templateUrl: "skills/mvc.html"
			})
			.state('skills.regex', {
				url: "/regex",
				templateUrl: "skills/regex.html"
			})
			.state('skills.json', {
				url: "/json",
				templateUrl: "skills/json.html"
			})
			.state('skills.seo', {
				url: "/seo",
				templateUrl: "skills/seo.html"
			})
			.state('skills.ajax', {
				url: "/ajax",
				templateUrl: "skills/ajax.html"
			})
			.state('skills.jquery', {
				url: "/jquery",
				templateUrl: "skills/jquery.html"
			})
			.state('skills.css3', {
				url: "/css3",
				templateUrl: "skills/css3.html"
			})
			.state('skills.html5', {
				url: "/html5",
				templateUrl: "skills/html5.html"
			})
			.state('skills.nodejs', {
				url: "/nodejs",
				templateUrl: "skills/nodejs.html"
			})
			.state('skills.less', {
				url: "/less",
				templateUrl: "skills/less.html"
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
});