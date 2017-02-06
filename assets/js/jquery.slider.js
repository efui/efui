+ function($) {
	'use strict';
	$.fn.navslider = function(options) {
		return this.each(function() {
			var instance = $.data(this, 'eslider');
			instance && instance._init(options) ,
			instance || $.data(this, 'eslider', new Slider(options, this));
		});
	};
	var Slider = function(options, element) {
		this.$el = $(element);
		this._init(options);
	};
	Slider.defaults = {
		childrennodes: null,
		siblingsClass: null,
		siblingsnodes: null
	};
	Slider.prototype = {
		_init: function(options) {
			this.options = $.extend({}, Slider.defaults, options);
			this._config();
			this._initEvents();
		},
		_config: function() {
			this.open = false;
			this.subNavOpen = false;
			this.$Menus = this.$el.children(this.options.childrennodes);
			this.$contentMask = $('<a class="slider-contentmask" href="javascript:;"></a>');
			this.$navMask = $('<a class="slider-navmask" href="javascript:;"></a>');
			this.$openSubnav = "";
		},
		_initEvents: function() {
			var self = this;
			!self.open && self._openNav(),self.open || self._closeNav();
			self.$contentMask.on('click.Slider', function(e) {
				e.preventDefault();
				self._closeNav();
			});
			self.$navMask.on('click.Slider', function(e) {
				e.preventDefault();
				self._closeSubNav();
			});
			self.$Menus.children().find('dd').on('click.Slider', function(e) {
				e.stopPropagation();
				var $item = $(this),
					$height = $(self.options.childrennodes).children()[0].offsetHeight,
					$subnav = $item.find('.subnav');
				$height = window.innerHeight < $height ? $height : window.innerHeight;
				$subnav.length>0 ? $subnav.css('height', $height) && self._openSubNav($subnav):'';				
			});
		},
		_openNav: function() {
			var self = this,el=self.$el;
			self.$el.addClass('active').append(self.$contentMask);
			$(self.options.siblingsnodes).addClass(self.options.siblingsClass);
			self.open = true;
			el.find('[ui-sref-active] > a').on('click.Slider', function() {
				$(this).nextAll().length && el.find('[ui-sref-active].active').addClass('actived');					
			});
		},
		_closeNav: function() {
			var self = this;
			self.$el.removeClass('active');
			$(self.options.siblingsnodes).removeClass(self.options.siblingsClass);
			self.subNavOpen && self._closeSubNav();
			self.$contentMask.detach();
			self.$el.find('[ui-sref-active] > a').off('click.Slider');
			self.open = false;
		},
		_openSubNav: function($subnav) {
			var self = this,
				$parent = $subnav.parent();
			$subnav.addClass('is-subnav-visible');
			!$parent.hasClass('active') && $subnav.find('a.active').removeClass('active');
			self.$Menus.addClass('inactive').append(self.$navMask);
			self.$Menus.find('dd').removeClass('active');
			$parent.addClass('active');
			$subnav.on('click.subSlider', function(e) {
				$(e.target).addClass('active').siblings().removeClass('active');
				$('.actived').removeClass('actived');
				e.stopPropagation();
			});
			self.$openSubnav = $subnav;
			self.subNavOpen = true;
		},
		_closeSubNav: function() {
			var self = this,el=self.$el,
				$parent = self.$openSubnav.parent();
			self.$openSubnav.removeClass('is-subnav-visible');
			self.$Menus.removeClass('inactive');
			self.$navMask.detach();
			self.$openSubnav.off('click.subSlider');
			self.$openSubnav = "";
			self.subNavOpen = false;
			$('.actived').length>0 && el.find('[ui-sref-active].active').removeClass('active') && $('.actived').removeClass('actived').addClass('active');
		}
	};
}(jQuery);
