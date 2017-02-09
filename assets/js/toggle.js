+(function($) {

	'use strict';
	function Toggle(element, options) {
		this.options = options;
		this.ele = $(element);
		this.isShown = null;
	}
	Toggle.DEFAULTS = {
		show: true
	}
	Toggle.prototype.toggle = function() {
		console.log('toggle==');
		return this.isShown ? this.hide() : this.show()
	}
	Toggle.prototype.show = function() {
		console.log('show==');
		console.log(this.ele);
		var e = $.Event('show.bs.toggle');
		if(this.isShown) return;
		this.isShown = true;
	}
	Toggle.prototype.hide = function() {
		console.log('hide==');
		var e = $.Event('hide.bs.toggle');
		if(!this.isShown) return;
		this.isShown = false;
	}

	$.fn.toggle = function(option) {
		return this.each(function() {
			var $this = $(this);
			var data = $this.data('bs.toggle');
			var options = $.extend({}, Toggle.DEFAULTS, $this.data(), typeof option == 'object' && option);
			if(!data) $this.data('bs.toggle', (data = new Toggle(this, options)));
			if(typeof option == 'string') data[option]();
			else if(options.show) data.show();
		})
	}

	$.fn.toggle.Constructor = Toggle;

})(jQuery);


//	$(ele).toggle('toggle');
