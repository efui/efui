+(function ($) {
  	'use strict';
  	
    function Dropdown (element, options) {
		this.ele = $(element);
		this.options = options;
    }
	Dropdown.DEFAULTS = {
		
	}
    Dropdown.prototype.close = function () {};
    Dropdown.prototype.open = function () {
    	//console.log('open==');
    };

    function Plugin(option) {
		return this.each(function() {
	    	var data = $(this).data('ef.dropdown');
	    	var options = $.extend({}, Dropdown.DEFAULTS, $(this).data(), typeof option == 'object' && option);
	    	
	    	// 实例化
	      	if(!data) $(this).data('ef.dropdown', data = new Dropdown(options));
	        // 触发行为
	        if (typeof option === 'string') {
	            data[option]();        
	        } 
		})
    };
	$.fn.dropdown = Plugin;
    $.fn.dropdown.Constructor = Dropdown;
})(jQuery);