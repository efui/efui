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
     	.state('standard', {
		   	url: "/standard",
		   	templateUrl: "standard/index.html",
		   	controller:function($scope,$location){
         		$scope.docsTit="规范";
         		$scope.docsMsg="CSS规范、HTML规范";
         	}
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
     	.state('standard.csshack', {
		   	url: "/csshack",
		   	templateUrl: "standard/css-hack.html"
   		})
     	.state('standard.html', {
		   	url: "/html",
		   	templateUrl: "standard/html-format.html"
   		})
     	.state('standard.htmlname', {
		   	url: "/htmlname",
		   	templateUrl: "standard/html-name.html"
   		})
     	.state('standard.js', {
		   	url: "/js",
		   	templateUrl: "standard/js-format.html"
   		})
     	.state('standard.jsname', {
		   	url: "/jsname",
		   	templateUrl: "standard/js-name.html"
   		})
     	.state('element', {
		   	url: "/element",
		   	templateUrl: "element/index.html",
		   	controller:function($scope,$location){
         		$scope.docsTit="基本元素";
         		$scope.docsMsg="CSS样式、HTML标签";
         	}
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
		   	controller:function($scope,$location){
         		$scope.docsTit="组件";
         		$scope.docsMsg="基本组件、web组件";
         	}
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
     	.state('plugin', {
		   	url: "/plugin",
		   	templateUrl: "plugin/index.html",
		   	controller:function($scope,$location){
         		$scope.docsTit="插件";
         		$scope.docsMsg="基于jQuery库的插件介绍";
         	}
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
     	.state('tools', {
		   	url: "/tools",
		   	templateUrl: "tools/index.html",
		   	controller:function($scope,$location){
         		$scope.docsTit="进阶";
         		$scope.docsMsg="前端技能进阶";
         	}
   		})
     	.state('tools.mvc', {
		   	url: "/mvc",
		   	templateUrl: "tools/mvc.html"
   		})
     	.state('tools.regex', {
		   	url: "/regex",
		   	templateUrl: "tools/regex.html"
   		})
     	.state('tools.json', {
		   	url: "/json",
		   	templateUrl: "tools/json.html"
   		})
     	.state('tools.ajax', {
		   	url: "/ajax",
		   	templateUrl: "tools/ajax.html"
   		})
     	.state('tools.less', {
		   	url: "/less",
		   	templateUrl: "tools/less.html"
   		})
    }

})();

    