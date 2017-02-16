require.config({	
	baseUrl: 'assets/js',
	paths: {
		"jquery": ["lib/jquery-1.9.0.min"],
		"angular": ["../../bower_components/angular/angular"],
		"angular-ui-router": ["../../bower_components/angular-ui-router/release/angular-ui-router"],
		"app": ["../../app"]
	},
	shim: {
        'angular': {
            exports: 'angular',
        	deps: ['jquery']
        },
        'angular-ui-router': {
        	deps: ['angular']
        },
		'app': ['angular'],
		'efui': ['jquery'],
		'jquery.prettify': ['jquery'],
		'jquery.slider': ['jquery'],
		'jquery.collapse': ['jquery']
	}
})

//require(['angular', 'app','efui','jquery.prettify','jquery.slider','jquery.collapse','highcharts','picker','tap'], function (angular) {
require(['angular', 'app','efui','jquery.prettify','jquery.slider','jquery.collapse'], function (angular) {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['app']);
    });
	$('.sidebar-toggle-btn').click(function(){
		$('.sidebar-slide').navslider({
			siblingsClass:'sidebar-slide-transform',
			siblingsnodes:'.navbar-fixed-top, .navbar-fixed-bottom,.docs-header,.main-content',
			childrennodes:'.sidebar-slide-overlay'
		});
	});	
});
