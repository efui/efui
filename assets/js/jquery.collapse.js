+ function($) {
	"use strict";
	function Plugin(option) {
		return this.each(function() {
			var $this = $(this),
				datas = $this.data("efui.collapse"),
				options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option);			
          	datas || $this.data("efui.collapse", datas = new Collapse(this, options)), 
       		"string" == typeof option && datas[$this.hasClass("in")? "close" : "open"]();
		})
	}
	var Collapse = function(element, options) {
		this.$element = $(element),
		this.options = $.extend({}, Collapse.DEFAULTS, options),
		this.transitioning = null,
		this.init();
	}
	Collapse.DEFAULTS = {
		duration: 300
	}
	Collapse.prototype.init = function() {
		this[this.$element.hasClass("in") ? "close" : "open"]()
	}
	Collapse.prototype.open = function() {
		var _that = this;
		if (!this.transitioning && !this.$element.hasClass("in")) {
			var startEvent = $.Event("open.collapse.efui");
			if (this.$element.trigger(startEvent), !startEvent.isDefaultPrevented()) {
				this.$element.removeClass("collapse").addClass("collapsing").height(0), this.transitioning = 1;
				var complete = function() {
					this.$element.removeClass("collapsing").addClass("collapse in").height("").trigger("opened.collapse.efui"),
					this.transitioning = 0
				};
				if (!$.support.transition) return complete.call(this);
				this.$element.one($.support.transition.end, $.proxy(complete, this)).emulateTransitionEnd(this.options.duration).css({
					height: this.$element[0].scrollHeight
				})
			}
		}
		this.$element.find('a').click(function(){
			_that["close"]();
		});
		
	}
	Collapse.prototype.close = function() {
		if (!this.transitioning && this.$element.hasClass("in")) {
			var startEvent = $.Event("close.collapse.efui");
			if (this.$element.trigger(startEvent), !startEvent.isDefaultPrevented()) {
				this.$element.height(this.$element.height()).offsetHeight,
				this.$element.addClass("collapsing").removeClass("collapse in"),
				this.transitioning = 1;
				var complete = function() {
					this.transitioning = 0,
					this.$element.trigger("closed.collapse.efui").removeClass("collapsing").addClass("collapse")
				};
				return $.support.transition ? void this.$element.height(0).one($.support.transition.end, $.proxy(complete, this)).emulateTransitionEnd(this.options.duration) : complete.call(this)
			}
		}
	}
	function parseOptions(t) {
		if ($.isPlainObject(t)) return t;
		var e = t ? t.indexOf("{") : -1,
			i = {};
		var _obj = t.substr(e);
		if (-1 != e)
			try {
				i = (new Function("var json = " + _obj + ";return json"))();
			}
		catch (s) {}
		return i
	}
	$.fn.collapse = Plugin;
	$(document).on("click.collapse.efui.data-api", "[data-collapse]", function(e) {
		var href,
			$this = $(this),
			options = parseOptions($(this).attr("data-collapse")),
			target = options.target || e.preventDefault() || (href = $this.attr("href")) && href.replace(/.*(?=#[^\s]+$)/, ""),
			$target = $(target),
			datas = $target.data("efui.collapse"),
			option = datas ? "toggle" : options;
		Plugin.call($target, option)
	})
}(jQuery);
