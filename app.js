define(function(require, exports, module) {
	var angular = require('angular');

	require('angular-ui-router');

	var app = angular.module('app', ['ui.router']);
	
	
	/* 缓存模板templateUrl */
	app.run(["$templateCache", function($templateCache) {
	 	$templateCache.put("hello.html", "<div><h1>Hi 我是林炳文~~~6666</h1></div>"); 
	 	$templateCache.put("hello2.html", "<div><h1>Hi 我是林炳文~~~8888</h1></div>"); 
	 	$templateCache.put("toptitle.html", '<h3 class="mb10" ng-repeat="data in menulist" ng-click="toggleClass()">'+
			'<span ng-repeat="item in data.likes">'+
				'<span class="red" ng-if="!item.submenu && item.title == pagename">{{item.title}}:{{item.abstract}}</span>'+
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
					$scope.menulist = [  
					    {  
					        "firstName": "技能进阶", 
					        "likes": [
					        	{
					        		'title':"javascript","url":"js"
					        	},
					        	{
					        		'title':"模块化开发","url":"module"
					        	},
					        	{
					        		'title':"正则表达式","url":"regex"
					        	},
					        	{
					        		'title':"seo","url":"seo"
					        	},
//					        	{
//					        		'title':"json","url":"json"
//					        	},
//					        	{
//					        		'title':"ajax","url":"ajax"
//					        	},
					        	{
					        		'title':"jquery","url":"jquery"
					        	},
					        	{
					        		'title':"css3","url":"css3"
					        	},
					        	{
					        		'title':"html5","url":"html5"
					        	},
					        	{
					        		'title':"NodeJs","url":"nodejs"
					        	}
					        ]
					    },  
					    {  
					        "firstName": "试题清单", 
					        "likes": [
					        	{
					        		'title':"javascript",
					        		'submenu':[
					        			{'name':"概念题",'url':"note-js01"}
					        		]
					        	},
					        	{
					        		'title':"css",
					        		'submenu':[
					        			{'name':"概念题",'url':"note-css01"}
					        		]
					        	}
					        ]
					    }
					];
				}
			})			
			.state('skills.pages', {
				url: "/:pageid",
				templateUrl: function($routeParams){return 'skills/'+$routeParams.pageid+'.html'},
				controller:function($scope,$stateParams,$element){
					$scope.pagename = $stateParams.pageid;
					$scope.answertitle = '查看正确答案';
					$scope.answertitle2 = '关闭正确答案';
					/note-*/.test($scope.pagename) && $element.prepend('<link href="assets/css/note-question.min.css" rel="stylesheet">');
					$scope.noteTitlelist = [
						{"title":"JS的基本数据类型","content":'Undefined、Null、Boolean、Number、String'},
						{"title":"JS有哪些内置对象","content":[
							"Object 是 JavaScript 中所有对象的父对象；",
							"数据封装类对象：Object、Array、Boolean、Number、String；",
							"其他对象：Function、Argument、Math、Date、RegExp、Error。"
						]},
						{"title":"列举几条JS的基本代码规范","content":[
							"不要在同一行声明多个变量；",
							"如果你不知道数组的长度，使用 push；",
							"请使用 ===/!== 来比较 true/false 或者数值；",
							"使用对象字面量替代 new Array 这种形式；",
							"不要使用全局函数；",
							"总是使用 var 来声明变量，如果不这么做将导致产生全局变量，我们要避免污染全局命名空间；",
							"Switch 语句必须带有 default 分支；",
							"语句结束一定要加分号；",
							"避免单个字符名，让你的变量名有描述意义；",
							"当命名对象、函数和实例时使用驼峰命名规则。"
						]},
						{"title":"call和apply的作用是什么？区别是什么？","content":[
							"call和apply的功能基本相同，都是实现继承或者转换对象指针的作用；",
							"唯一不同的是前者参数是罗列出来的，后者是存到数组中的；",
							{"tit":"语法：","desc":[
								".call(对象[,参数1，参数2,....]);//此地参数是指的是对象的参数，非方法的参数；",
								".apply(对象,参数数组)//参数数组的形式:[参数1，参数2,......]"
							]}
						]},
						{"title":"push()-pop()-shift()-unshift()分别是什么功能？","content":[
							{"tit":"push方法：","desc":[
								"将新元素添加到一个数组中，并返回数组的新长度值。",
								"var a=[1,2,3,4];",
								"a.push(5);"
							]},
							{"tit":"pop方法：","desc":[
								"移除数组中的最后一个元素并返回该元素。",
								"var a=[1,2,3,4];",
								"a.pop();"
							]},
							{"tit":"shift方法：","desc":[
								"移除数组中的第一个元素并返回该元素。",
								"var a=[1,2];",
								"alert(a.shift());"
							]},
							{"tit":"unshift方法：","desc":[
								"将指定的元素插入数组开始位置并返回该数组。"
							]}
						]},
						{"title":"试写出大于1024并小于1360屏幕的媒体查询关键CSS代码","content":[
							"if ((screen.width == 1360) && (screen.height == 1024)){...}"
						]},
						{"title":"表述您对javascript this工作原理的理解","content":[
							"在函数中：this 通常是一个隐含的参数。",
							"在函数外（顶级作用域中）：在浏览器中this 指的是全局对象；在Node.js中指的是模块(module)的导出(exports)。",
							"传递到eval()中的字符串：如果eval()是被直接调用的，this 指的是当前对象；如果eval()是被间接调用的，this 就是指全局对象。"
						]},
						{"title":"介绍一下 JavaScript 原型，原型链，它们有何特点？","content":[
							"每个对象都会在其内部初始化一个属性，就是prototype(原型)，当我们访问一个对象的属性时，如果这个对象内部不存在这个属性，那么他就会去prototype里找这个属性，这个prototype又会有自己的prototype，于是就这样一直找下去，也就是我们平时所说的原型链的概念。",
							"关系：instance.constructor.prototype = instance.__proto__",
							"特点：JavaScript对象是通过引用来传递的，我们创建的每个新对象实体中并没有一份属于自己的原型副本，当我们修改原型时，与之相关的对象也会继承这一改变。",
							"当我们需要一个属性时，JavaScript引擎会先看当前对象中是否有这个属性，如果没有的话，就会查找它的prototype对象是否有这个属性，如此递推下去，一致检索到Object内建对象。"
						]},
						{"title":"JavaScript 有几种类型的值？能否画一下它们的内存图？","content":[
							"栈：原始数据类型（Undefined，Null，Boolean，Number，String）",
							"堆：引用数据类型（对象、数组、函数）",
							{"tit":"两种类型的区别：(存储位置不同)","desc":[
								"原始数据类型直接存储在栈(stack)中的简单数据段，占据空间小、大小固定，属于被频繁使用数据，所以放入栈中存储；",
								"引用数据类型存储在堆(heap)中的对象,占据空间大、大小不固定,如果存储在栈中，将会影响程序运行的性能；引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。"
							]}
						]},
						{"title":"JavaScript 如何实现继承？","content":[
							"构造继承",
							"原型继承",
							"实例继承",
							"拷贝继承"
						]},
						{"title":"eval 是做什么的？","content":[
							"它的功能是把对应的字符串解析成JS代码并运行；",
							"应该避免使用eval，因为不安全，非常耗性能（2次，一次解析成js语句，一次执行）。"
						]},
						{"title":"null 和 undefined 有何区别？","content":[
							"null 表示一个对象被定义了，值为“空值”；",
							"undefined 表示不存在这个值。",
							'typeof undefined //"undefined"',
							'undefined :是一个表示"无"的原始值或者说表示"缺少值"，就是此处应该有一个值，但是还没有定义。当尝试读取时会返回 undefined； ',
							'例如变量被声明了，但没有赋值时，就等于undefined。',
							'typeof null //"object" ',
							'null : 是一个对象(空对象, 没有任何属性和方法)； ',
							'例如作为函数的参数，表示该函数的参数不是对象；',
							'注意： 在验证null时，一定要使用　=== ，因为 == 无法分别 null 和　undefined'
						]},
						{"title":'["1","2","3"].map(parseInt) 的答案是多少？',"content":[
							"[1,NaN,NaN]",
							"因为 parseInt 需要两个参数(val,radix)，其中 radix 表示解析时用的基数。",
							"map 传了3个(element,index,array)，对应的 radix 不合法导致解析失败。"
						]},
						{"title":"事件是什么？IE与火狐的事件机制有何区别？如何阻止冒泡？","content":[
							"我们在网页中的某个操作（有的操作对应多个事件）。 例如：当我们点击一个按钮就会产生一个事件。是可以被 JavaScript 侦测到的行为。",
							"事件处理机制：IE是事件冒泡、Firefox同时支持两种事件模型，也就是：捕获型事件和冒泡型事件；",
							"ev.stopPropagation();（旧ie的方法 ev.cancelBubble = true;）"
						]},
						{"title":"什么是闭包(closure)，为什么要用它？","content":[
							"闭包是指有权访问另一个函数作用域中变量的函数，创建闭包的最常见的方式就是在一个函数内创建另一个函数，通过另一个函数访问这个函数的局部变量，利用闭包可以突破作用链域，将函数内部的变量和方法传递到外部。",
							{"tit":"闭包特性：","desc":[								
								"函数内再嵌套函数",
								"内部函数可以引用外层的参数和变量",
								"参数和变量不会被垃圾回收机制回收"
							]}

						]},
						{"title":'JavaScript 代码中的 "use strict"; 是什么意思？使用它的区别是什么？',"content":[
							"use strict是一种ECMAscript 5 添加的（严格）运行模式,这种模式使得 Javascript 在更严格的条件下运行,使JS编码更加规范化的模式,消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为。",
							"默认支持的糟糕特性都会被禁用，比如不能用with，也不能在意外的情况下给全局变量赋值;",
							"全局变量的显示声明,函数必须声明在顶层，不允许在非函数代码块内声明函数,arguments.callee也不允许使用；",
							"消除代码运行的一些不安全之处，保证代码运行的安全,限制函数中的arguments修改，严格模式下的eval函数的行为和非严格模式的也不相同;",
							"提高编译器效率，增加运行速度；",
							"为未来新版本的Javascript标准化做铺垫。"
						]},
						{"title":"new 操作符具体干了什么呢？","content":[
							"创建一个空对象，并且 this 变量引用该对象，同时还继承了该函数的原型。",
"属性和方法被加入到 this 引用的对象中。",
"新创建的对象由 this 所引用，并且最后隐式的返回 this 。"
						]},
						{"title":"JavaScript 中，有一个函数，执行对象查找时，永远不会去查找原型，这个函数是哪个？","content":[
							{"tit":"hasOwnProperty","desc":[
								"JavaScript 中 hasOwnProperty 函数方法是返回一个布尔值，指出一个对象是否具有指定名称的属性。此方法无法检查该对象的原型链中是否具有该属性；该属性必须是对象本身的一个成员。",
								"使用方法：object.hasOwnProperty(proName)其中参数object是必选项，一个对象的实例。proName是必选项，一个属性名称的字符串值。",
								"如果 object 具有指定名称的属性，那么JavaScript中hasOwnProperty函数方法返回 true，反之则返回 false。"
							]}
						]},
						{"title":"你对 JSON 了解吗？","content":[
							"JSON(JavaScript Object Notation)是一种轻量级的数据交换格式。",
"它是基于JavaScript的一个子集。数据格式简单，易于读写，占用带宽小。",
'如：{"age":"12", "name":"back"}'
						]},
						{"title":"Ajax 是什么？如何创建一个 Ajax ？","content":[
							"ajax的全称：Asynchronous Javascript And XML，异步传输+js+xml。",
"所谓异步，在这里简单地解释就是：向服务器发送请求的时候，我们不必等待结果，而是可以同时做其他的事情，等到有了结果它自己会根据设定进行后续操作，与此同时，页面是不会发生整页刷新的，提高了用户体验。",
{"tit":"创建：","desc":[
"创建XMLHttpRequest对象,也就是创建一个异步调用对象",
"创建一个新的HTTP请求,并指定该HTTP请求的方法、URL及验证信息",
"设置响应HTTP请求状态变化的函数",
"发送HTTP请求",
"获取异步调用返回的数据",
"使用JavaScript和DOM实现局部刷新"
]}
						]},
						{"title":"同步和异步的区别？","content":[
							"同步的概念应该是来自于操作系统中关于同步的概念:不同进程为协同完成某项工作而在先后次序上调整(通过阻塞,唤醒等方式)。",
"同步强调的是顺序性，谁先谁后；异步则不存在这种顺序性。",
"同步：浏览器访问服务器请求，用户看得到页面刷新，重新发请求,等请求完，页面刷新，新内容出现，用户看到新内容,进行下一步操作。",
"异步：浏览器访问服务器请求，用户正常操作，浏览器后端进行请求。等请求完，页面不刷新，新内容也会出现，用户看到新内容。"
						]},
						{"title":"如何解决跨域问题？","content":[
							"jsonp、iframe、window.name、window.postMessage、服务器上设置代理页面"
						]},
						{"title":"谈一谈你对 ECMAScript6 的了解？","content":[
							"ECMAScript 6 是JavaScript语言的下一代标准，已经在2015年6月正式发布了。",
"它的目标，是使得JavaScript语言可以用来编写复杂的大型应用程序，成为企业级开发语言。",
"标准的制定者有计划，以后每年发布一次标准，使用年份作为标准的版本。",
"因为当前版本的ES6是在2015年发布的，所以又称ECMAScript 2015。",
"也就是说，ES6就是ES2015"
						]},
						{"title":"ECMAScript 6 怎么写 class ，为何会出现 class？","content":[
							"ES6的class可以看作只是一个语法糖，它的绝大部分功能，ES5都可以做到，新的class写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。"
						]},
						{"title":"异步加载 JS 的方式有哪些？","content":[
							"defer，只支持 IE",
"async",
"创建 script，插入到 DOM 中，加载完毕后 callBack"
						]},
						{"title":"document.write 和 innerHTML 有何区别？","content":[
							"document.write 只能重绘整个页面;innerHTML 可以重绘页面的一部分"
						]},
						{"title":"DOM 操作——怎样添加、移除、移动、复制、创建和查找节点？","content":[
							{"tit":"创建新节点","desc":[
								"createDocumentFragment() //创建一个DOM片段",
								"createElement() //创建一个具体的元素",
								"createTextNode() //创建一个文本节点"
							]},
							{"tit":"添加、移除、替换、插入","desc":[
								"appendChild()",
								"removeChild()",
								"replaceChild()",
								"insertBefore() //在已有的子节点前插入一个新的子节点"
							]},
							{"tit":"查找","desc":[
								"getElementsByTagName() //通过标签名称",
								"getElementsByName() //通过元素的Name属性的值(IE容错能力较强，会得到一个数组，其中包括id等于name值的)",
								"getElementById() //通过元素Id，唯一性"
							]}
						]},
						{"title":"哪些操作会造成内存泄漏？","content":[
							"内存泄漏是指任何对象在您不再拥有或需要它之后任然存在。",
"垃圾回收器定期扫描对象，并计算引用了每个对象的其他对象的数量，如果一个对象的引用数量为0（没有其他对象引用过该对象），或对该对象的惟一引用是循环的，那么该对象的内存即可回收。",
"setTimeout 的第一个参数使用字符串而非函数的话，会引发内存泄漏。",
"闭包、控制台日志、循环（在两个对象彼此引用且彼此保留时，就会产生一个循环）"
						]},
						{"title":"jQuery 中如何将数组转化为 json 字符串，然后再转化回来？","content":[
							{"tit":"jQuery 中没有提供这个功能，所以需要先编写两个 jQuery 的扩展：","desc":[
								"$.fn.stringifyArray = function(array) { return JSON.stringify(array); }",
								"$.fn.parseArray = function(array) { return JSON.parse(array); }"
							]},
							{"tit":"然后调用：","desc":[
								'$("").stringifyArray(array)'
							]}
						]},
						{"title":"jQuery.extend 与 jQuery.fn.extend 有何区别？","content":[
							{"tit":"jQuery.extend：","desc":[
								"jQuery.extend(object);　//为jQuery类添加类方法，可以理解为添加静态方法",
								"jQuery.extend({",
"  min: function(a, b) { return a < b ? a : b; },",
"  max: function(a, b) { return a > b ? a : b; }",
"});",
"jQuery.min(2,3); //  2 ",
"jQuery.max(4,5); //  5",
"jQuery.extend( target, object1, [objectN])用一个或多个其他对象来扩展一个对象，返回被扩展的对象"
							]},
							{"tit":"jQuery.fn.extend","desc":[
								'jQuery.fn.extend(object); //对jQuery.prototype进行的扩展，就是为jQuery类添加“成员函数”。jQuery类的实例可以使用这个“成员函数”。',
								"比如我们要开发一个插件，做一个特殊的编辑框，当它被点击时，便alert 当前编辑框里的内容。可以这么做：",
								"$.fn.extend({ ",         
   	"alertWhileClick:function() {          ",  
  "       $(this).click(function(){ alert($(this).val()); });           ",
"    }       ",
"}); ",
'$("#input1").alertWhileClick(); // 页面上为$("#input1")为一个jQuery实例，当它调用成员方法 alertWhileClick后，便实现了扩展，每次被点击时它会先弹出目前编辑里的内容。'
							]}
						]},
						{"title":"是否了解针对 jQuery 性能的优化方法？","content":[
							"基于Class的选择性的性能相对于Id选择器开销很大，因为需遍历所有DOM元素。",
"频繁操作的DOM，先缓存起来再操作。用Jquery的链式调用更好。",
'比如：var str=$("a").attr("href");',
"for (var i = size; i < arr.length; i++) {}",
"for 循环每一次循环都查找了数组 (arr) 的.length 属性，在开始循环的时候设置一个变量来存储这个数字，可以让循环跑得更快：",
"for (var i = size, length = arr.length; i < length; i++) {}"
						]},
						{"title":"jQuery 与 jQuery UI 有何区别？","content":[
							"jQuery是一个js库，主要提供的功能是选择器，属性修改和事件绑定等等。",
"jQuery UI则是在jQuery的基础上，利用jQuery的扩展性，设计的插件。提供了一些常用的界面元素，诸如对话框、拖动行为、改变大小行为等等"
						]},
						{"title":"如何判断当前脚本运行在浏览器还是 node 环境中？（阿里）","content":[
							"通过判断 Global 对象是否为 window ，如果不为 window ，当前脚本没有运行在浏览器中"
						]},
						{"title":"检测浏览器版本有哪些方式？","content":[
							"功能检测、userAgent 特征检测",
"比如：navigator.userAgent",
'//"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36"'
						]},
						{"title":"前端 MVC、MVVM","content":[
							{"tit":"MVC","desc":[
							"模型（Model）：数据保存",
"视图（View）：用户界面",
"控制器（Controller）：业务逻辑",
"View 传送指令到 Controller",
"Controller 完成业务逻辑后，要求 Model 改变状态",
"Model 将新的数据发送到 View ，用户得到反馈所有通信都是单向的。"
							]},
							{"tit":"MVVM","desc":[
							"模型（Model）",
"视图（View）",
"视图模型（ViewModel）",
"各部分间都是双向通信",
"View 与 Model 不发生联系，都通过 ViewModel 传递",
"View 非常薄，不部署任何业务逻辑，称为“被动视图”（Passive View），即没有任何主动性；而 ViewModel 非常厚，所有逻辑都部署在那里。",
"采用双向绑定（data-binding）：View 的变动，自动反映在 ViewModel ，反之亦然。"
							]}
						]},
						{"title":"HTTP协议的状态消息都有哪些?(如200、302对应的描述)国内外的JS牛人都知道哪些?","content":[
							{"tit":"协议是指计算机通信网络中两台计算机之间进行通信所必须共同遵守的规定或规则，超文本传输协议(HTTP)是一种通信协议，它允许将超文本标记语言(HTML)文档从Web服务器传送到客户端的浏览器，","desc":[
							'“100″ : Continue（继续） 初始的请求已经接受，客户应当继续发送请求的其余部分。（HTTP 1.1新）',
							'“101″ : Switching Protocols（切换协议） 请求者已要求服务器切换协议，服务器已确认并准备进行切换。（HTTP 1.1新）',
'“200″ : OK（成功） 一切正常，对GET和POST请求的应答文档跟在后面。',
'“201″ : Created（已创建）服务器已经创建了文档，Location头给出了它的URL。',
'“202″ : Accepted（已接受）服务器已接受了请求，但尚未对其进行处理。',
'“203″ : Non-Authoritative Information（非授权信息） 文档已经正常地返回，但一些应答头可能不正确，可能来自另一来源 。（HTTP 1.1新）。',
'“204″ : No Content（无内容）未返回任何内容，浏览器应该继续显示原来的文档。',
'“205″ : Reset Content（重置内容）没有新的内容，但浏览器应该重置它所显示的内容。用来强制浏览器清除表单输入内容（HTTP 1.1新）。',
'“206″ : Partial Content（部分内容）服务器成功处理了部分 GET 请求。（HTTP 1.1新）',
'“300″ : Multiple Choices（多种选择）客户请求的文档可以在多个位置找到，这些位置已经在返回的文档内列出。如果服务器要提出优先选择，则应该在Location应答头指明。',
'“301″ : Moved Permanently（永久移动）请求的网页已被永久移动到新位置。服务器返回此响应（作为对 GET 或 HEAD 请求的响应）时，会自动将请求者转到新位置。',
'“302″ : Found（临时移动）类似于301，但新的URL应该被视为临时性的替代，而不是永久性的。注意，在HTTP1.0中对应的状态信息是“Moved Temporatily”，出现该状态代码时，浏览器能够自动访问新的URL，因此它是一个很有用的状态代码。注意这个状态代码有时候可以和301替换使用。例如，如果浏览器错误地请求http://host/~user（缺少了后面的斜杠），有的服务器返回301，有的则返回302。严格地说，我们只能假定只有当原来的请求是GET时浏览器才会自动重定向。请参见307。',
'“303″ : See Other（查看其他位置）类似于301/302，不同之处在于，如果原来的请求是POST，Location头指定的重定向目标文档应该通过GET提取（HTTP 1.1新）。',
'“304″ : Not Modified（未修改）自从上次请求后，请求的网页未被修改过。原来缓冲的文档还可以继续使用，不会返回网页内容。',
'“305″ : Use Proxy（使用代理）只能使用代理访问请求的网页。如果服务器返回此响应，那么，服务器还会指明请求者应当使用的代理。（HTTP 1.1新）',
'“307″ : Temporary Redirect（临时重定向）和 302（Found）相同。许多浏览器会错误地响应302应答进行重定向，即使原来的请求是POST，即使它实际上只能在POST请求的应答是303时才能重定向。由于这个原因，HTTP 1.1新增了307，以便更加清除地区分几个状态代码：当出现303应答时，浏览器可以跟随重定向的GET和POST请求；如果是307应答，则浏览器只能跟随对GET请求的重定向。（HTTP 1.1新）',
'“400″ : Bad Request（错误请求）请求出现语法错误。',
'“401″ : Unauthorized（未授权）客户试图未经授权访问受密码保护的页面。应答中会包含一个WWW-Authenticate头，浏览器据此显示用户名字/密码对话框，然后在填写合适的Authorization头后再次发出请求。',
'“403″ : Forbidden（已禁止） 资源不可用。服务器理解客户的请求，但拒绝处理它。通常由于服务器上文件或目录的权限设置导致。',
'“404″ : Not Found（未找到）无法找到指定位置的资源。',
'“405″ : Method Not Allowed（方法禁用）请求方法（GET、POST、HEAD、DELETE、PUT、TRACE等）禁用。（HTTP 1.1新）',
'“406″ : Not Acceptable（不接受）指定的资源已经找到，但它的MIME类型和客户在Accpet头中所指定的不兼容（HTTP 1.1新）。',
'“407″ : Proxy Authentication Required（需要代理授权）类似于401，表示客户必须先经过代理服务器的授权。（HTTP 1.1新）',
'“408″ : Request Time-out（请求超时）服务器等候请求时超时。（HTTP 1.1新）',
'“409″ : Conflict（冲突）通常和PUT请求有关。由于请求和资源的当前状态相冲突，因此请求不能成功。（HTTP 1.1新）',
'“410″ : Gone（已删除）如果请求的资源已被永久删除，那么，服务器会返回此响应。该代码与 404（未找到）代码类似，但在资源以前有但现在已经不复存在的情况下，有时会替代 404 代码出现。如果资源已被永久删除，那么，您应当使用 301 代码指定该资源的新位置。（HTTP 1.1新）',
'“411″ : Length Required（需要有效长度）不会接受包含无效内容长度标头字段的请求。（HTTP 1.1新）',
'“412″ : Precondition Failed（未满足前提条件）服务器未满足请求者在请求中设置的其中一个前提条件。（HTTP 1.1新）',
'“413″ : Request Entity Too Large（请求实体过大）请求实体过大，已超出服务器的处理能力。如果服务器认为自己能够稍后再处理该请求，则应该提供一个Retry-After头。（HTTP 1.1新）',
'“414″ : Request-URI Too Large（请求的 URI 过长）请求的 URI（通常为网址）过长，服务器无法进行处理。',
'“415″ : Unsupported Media Type（不支持的媒体类型）请求的格式不受请求页面的支持。',
'“416″ : Requested range not satisfiable（请求范围不符合要求）服务器不能满足客户在请求中指定的Range头。（HTTP 1.1新）',
'“417″ : Expectation Failed（未满足期望值）服务器未满足”期望”请求标头字段的要求。',
'“500″ : Internal Server Error（服务器内部错误）服务器遇到错误，无法完成请求。',
'“501″ : Not Implemented（尚未实施） 服务器不具备完成请求的功能。例如，当服务器无法识别请求方法时，服务器可能会返回此代码。',
'“502″ : Bad Gateway（错误网关）服务器作为网关或者代理时，为了完成请求访问下一个服务器，但该服务器返回了非法的应答。',
'“503″ : Service Unavailable（服务不可用）服务器由于维护或者负载过重未能应答。通常，这只是一种暂时的状态。',
'“504″ : Gateway Time-out（网关超时） 由作为代理或网关的服务器使用，表示不能及时地从远程服务器获得应答。（HTTP 1.1新）',
'“505″ : HTTP Version not supported（HTTP 版本不受支持）不支持请求中所使用的 HTTP 协议版本。'
							]}
						]}
					];
					$scope.submitForm = function(answer,item) {	
		                if (item !== answer) {
		                    alert('回答错误');
		                }
		            };
		            $scope.isArray = function(o){
		            	return Object.prototype.toString.call(o) === '[object Array]';  
					};
		            $scope.isObj = function(o){
		            	return Object.prototype.toString.call(o) === '[object Object]';  
					};
				}
			})
			.state('frame', {
				url: "/frame",
				templateUrl: "frame/index.html",
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
					    	"firstName":"React",
					    	"likes":[
					    		{
					    			'title':'react',
					    			'url':'react',
					    			'abstract':''
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
			.state('frame.pages', {
                url: '/:pageid',
				templateUrl:function($routeParams){return 'frame/'+$routeParams.pageid+'.html';},
				controller: function($scope, $location,$state,$stateParams,$element) {
					$scope.pagename = $stateParams.pageid;
					$scope.toggleClass = function(){
						console.log($scope.pagename);
					}
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
		     	scope.answershow = false;
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
	            scope.toggle = function toggle() {
	            	//console.log('toggle me!');
	                scope.showMe = !scope.showMe;
	            }
		     	scope.toggleanswer = function(){
		         	scope.answershow = !scope.answershow;
		   		};
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
