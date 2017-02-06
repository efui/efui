/* ========================================================================
 * EFUI: efui.js v1.0
 * ======================================================================== */
+ function($) {
	'use strict';

	// CSS TRANSITION SUPPORT
	// ============================================================

	function transitionEnd() {
		var el = document.createElement('efui')
		var transEndEventNames = {
			WebkitTransition: 'webkitTransitionEnd',
			MozTransition: 'transitionend',
			OTransition: 'oTransitionEnd otransitionend',
			transition: 'transitionend'
		}
		for(var name in transEndEventNames) {
			if(el.style[name] !== undefined) {
				return {
					end: transEndEventNames[name]
				}
			}
		}
		return false
	}

	$.fn.emulateTransitionEnd = function(duration) {
		var called = false
		var $el = this
		$(this).one('efTransitionEnd', function() {
			called = true
		})
		var callback = function() {
			if(!called) $($el).trigger($.support.transition.end)
		}
		setTimeout(callback, duration)
		return this
	}

	$(function() {
		$.support.transition = transitionEnd()

		if(!$.support.transition) return

		$.event.special.efTransitionEnd = {
			bindType: $.support.transition.end,
			delegateType: $.support.transition.end,
			handle: function(e) {
				if($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
			}
		}
	})

}(jQuery);

/*****   confirm   ******/
+ function($) {
	"use strict";
	$.fn.confirm = function(option) {
		return this.each(function() {
			var $this = $(this)
			var data = $this.data('bs.confirm')
			var options = $.extend({}, Jconfirm.DEFAULTS, $this.data(), typeof option == 'object' && option)

			if(!data) $this.data('bs.confirm', (data = new Jconfirm(this, options)))
			else return new Jconfirm(this, options)
		})
	};

	var Jconfirm = function(element, options) {
		this.$element = $(element)
		this.options = options
		this.$body = $(document.body)
		$.extend(this, options)
		this._init()
	};

	Jconfirm.DEFAULTS = {
		layer: '<div class="popup-backdrop fade"></div>',
		template: '<div class="popup fade">' +
			'<div class="popup-dialog">' +
			'<div class="popup-content">' +
			'<div class="popup-inner">' +
			'<div class="f-cross closeIcon"></div>' +
			'<div class="title-c popup-title">' +
			'<span class="icon-c"></span><span class="title"></span>' +
			'</div>' +
			'<div class="popup-text">' +
			'<div class="pop-m-content"></div>' +
			'</div>' +
			'</div>' +
			'<div class="popup-buttons"></div>' +
			'</div>' +
			'</div>' +
			'</div>',
		title: '',
		content: '',
		icon: '',
		opacity: 0.2,
		confirmButton: '确定',
		cancelButton: '关闭',
		confirmButtonClass: 'btn-default',
		cancelButtonClass: 'btn-cancel',
		container: 'body',
		confirm: function() {},
		cancel: function() {},
		closeIcon: false
	};
	Jconfirm.prototype._init = function() {
		this._buildHTML();
		this._bindEvents();
		this.open();
		this.$el.on('click.dismiss', '[data-dismiss="confirm"]', $.proxy(this.close, this));
	}
	Jconfirm.prototype._buildHTML = function() {
		this._lastFocused = $('body').find(':focus');
		this.$elayer = $(this.layer).appendTo(this.container);
		this.$elayer.css('opacity', this.opacity);
		this.$el = $(this.template).appendTo(this.container).addClass('in');
		this.$body = this.$el;
		this.$title = this.$el.find('.title');
		this.$content = this.$el.find('.pop-m-content');
		this.$icon = this.$el.find('.icon-c');
		this.$closeIcon = this.$el.find('.closeIcon');
		if(!this.closeIcon) this.$closeIcon.remove();
		this.setTitle();
		this.setIcon();
		this.setContent();
		this._setButtons();
	}
	Jconfirm.prototype._bindEvents = function() {
		var _this = this;
		if(this.$confirmButton) {
			this.$confirmButton.click(function(e) {
				e.preventDefault();
				var r = _this.confirm(_this.$el);
				if(typeof r === 'undefined' || r) _this.close();
			});
		}
		if(this.$cancelButton) {
			this.$cancelButton.click(function(e) {
				e.preventDefault();
				var r = _this.cancel(_this.$el);
				if(typeof r === 'undefined' || r) _this.close();
			});
		}
		if(this.$closeIcon) {
			this.$closeIcon.click(function(e) {
				e.preventDefault();
				var r = _this.cancel(_this.$el);
				if(typeof r === 'undefined' || r) _this.close();
			});
		}
	}
	Jconfirm.prototype._setButtons = function() {
		this.$btnc = this.$el.find('.popup-buttons');
		if(this.cancelButton && $.trim(this.cancelButton) !== '') {
			this.$cancelButton = $('<button type="button" class="popup-button">' + this.cancelButton + '</button>').appendTo(this.$btnc).addClass(this.cancelButtonClass);
		}
		if(this.confirmButton && $.trim(this.confirmButton) !== '') {
			this.$confirmButton = $('<button type="button" class="popup-button">' + this.confirmButton + '</button>').appendTo(this.$btnc).addClass(this.confirmButtonClass);
		}
		if(!this.confirmButton && !this.cancelButton) {
			this.$btnc.hide();
		}
	}
	Jconfirm.prototype.setTitle = function(string) {
		this.title = (typeof string !== 'undefined') ? string : this.title;
		this.$title.html(this.title || '');
	}
	Jconfirm.prototype.setIcon = function(iconClass) {
		this.title = (typeof string !== 'undefined') ? iconClass : this.title;
		this.$icon.html(this.icon ? '<i class="' + this.icon + '"></i>' : '');
	}
	Jconfirm.prototype.setContent = function(string) {
		this.content = (typeof string == 'undefined') ? this.content : string;
		this.$content.html(this.content);
	}	
	Jconfirm.prototype.close = function() {
		if(this.isClosed()) return false;
		this._lastFocused.focus();
		this.$elayer.removeClass('in').remove();
		this.$el.removeClass('in').remove();
		return true;
	}
	Jconfirm.prototype.open = function() {
		if(this.isClosed()) return false;
		this.$el.on('click.dismiss', $.proxy(function (e) {
			if (e.target !== e.currentTarget) return
		 	this.$elayer !== 'static' && this.close()
	  	}, this));
		this.$elayer.addClass('in');
		this.$el.addClass('in').find('input[autofocus]:visible:first').focus();
		return true;
	}
	Jconfirm.prototype.isClosed = function() {
		return this.$el.css('display') === '';
	}
}(jQuery);

/*****   toast   ******/
+ function($) {
	"use strict";
	$.fn.toast = function(option) {
		var d = $("<div/>");
		d.addClass("toast-container");
		d.html('<div class="toast-message">' + option + "</div>");
		$('body').append(d);
		d.addClass('in');
		setTimeout(function() {
			d.removeClass('in').remove();
		}, 1e3)
	}
}(jQuery);

+ function($) {
	'use strict';
	var Modal = function(element, options) {
		this.options = options;
		this.$element = $(element);
		this.$dialog = this.$element.find('.popup-dialog');
		this.$backdrop = null;
		this.isShown = null;
		this.show();
	}

	Modal.TRANSITION_DURATION = 300

	Modal.DEFAULTS = {
		backdrop: true
	}
	Modal.prototype.backdrop = function(callback) {
		var that = this;
		var animate = this.$element.hasClass('fade') ? 'fade' : '';
		
		if(this.isShown && this.options.backdrop) {
			var doAnimate = $.support.transition && animate;
			this.$backdrop = $(document.createElement('div'))
				.addClass('popup-backdrop ' + animate)
				.appendTo($(document.body));
				
			this.$element.on('click.dismiss.modal', $.proxy(function (e) {
		        if (e.target !== e.currentTarget) return
		        this.options.backdrop !== 'static' && this.hide()
	      	}, this));
	      
			this.$backdrop.addClass('in');
			if(!callback) return;
			callback();

		} else if(!this.isShown && this.$backdrop) {
			this.$backdrop.removeClass('in');
			var callbackRemove = function() {
				that.removeBackdrop();
				callback && callback();
			}();

		} else if(callback) {
			callback()
		}
	}
	Modal.prototype.show = function() {
		var that = this;
		if(this.isShown) return;
		this.isShown = true;
		
		this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));
		this.backdrop(function() {
			!that.$element.parent().length && that.$element.appendTo($(document.body));
			that.$element.show().scrollTop(0);
			that.$element.addClass('in');
		});
	}
	Modal.prototype.hide = function (e) {
    	if (e) e.preventDefault();
		var that = this;
		if(!this.isShown) return;
		this.isShown = false;
		
		this.$element.removeClass('in').off('click.dismiss.modal');
      	this.hideModal();
  	}
  	Modal.prototype.hideModal = function () {
	    var that = this;
	    this.$element.hide();
	    this.backdrop();
  	}
  	Modal.prototype.removeBackdrop = function () {
    	this.$backdrop && this.$backdrop.remove();
    	this.$backdrop = null
  	}

	function Plugin(option) {
		return this.each(function() {
			var $this = $(this);
			var data = $this.data('data.modal');
			var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option);
			
			if(!data) $this.data('data.modal', (data = new Modal(this, options)))
			else return new Modal(this, options)
		})
	}

	var old = $.fn.modal;
	$.fn.modal = Plugin;
	$.fn.modal.Constructor = Modal;
	$.fn.modal.noConflict = function() {
		$.fn.modal = old;
		return this;
	}
}(jQuery);

/*****   class toggle   ******/
+ function($) {
	'use strict';
	$(document)
		.on('click.data.togglec', '[data-toggleclass]', function(e) {
			var $this = $(this);
			var option = $this.data();
			var toggleClass = option.toggleclass ? option.toggleclass : '';
			$this.toggleClass(toggleClass);
		})
		.on('click.data.togglep', '[data-toggleparent]', function(e) {
			var $this = $(this);
			var option = $this.data();
			var toggleClass = option.toggleparent ? option.toggleparent : '';
			$this.parent().toggleClass(toggleClass);
		})
}(jQuery);

/*回到顶部*/
+ function($) {
	'use strict';

	function debounce(fn, delay, immediate) {
		var timer;
		return function() {
			var context = this,
				args = arguments,
				a = function() {
					timer = null,
						immediate || fn.apply(context, args)
				},
				r = immediate && !timer;
			clearTimeout(timer),
				timer = setTimeout(a, delay),
				r && fn.apply(context, args)
		}
	}

	function e() {
		n.scrollTop() > 10 ? r.addClass("active") : r.removeClass("active")
	}
	var n = $(window),
		r = $("#go-top");
	r.length && (r.on("click", function(e) {
		return e.preventDefault(), ($("html, body").animate({
			scrollTop: 0
		}, 500), !1)
	}), e(), n.on("scroll", debounce(e, 100)));
}(jQuery);

+ function($) {
	/*目录切换*/
	$(document).on("click.mlist", ".mlist li a", function(e) {
		var _exm = $('.mswitch');
		var ev = e || window.event; // 事务
		var target = ev.target || ev.srcElement; // 获得事务源
		var _index = $(target).parent().index();
		_exm.eq(_index).show().siblings('.mswitch').hide();
	});

	/*窗口滚动事件*/
	$(document).on("scroll", function(e) {
		var m = $('.sidebar-menu');
		var _t = $('.navbar-fixed-top').height() + $('.docs-header').height();
		var _option = 'fixed';
		m.length && $(this).scrollTop() > _t ? (m.addClass(_option)) : (m.removeClass(_option));
	})
}(jQuery);

+ function($) {
	/*倒计时 时：分：秒*/
	var DownTime = function(d, o) {
		return function() {
			var EndTime = new Date(d);
			var NowTime = new Date();
			var t = EndTime.getTime() - NowTime.getTime();
			var h = 0;
			var m = 0;
			var s = 0;
			t >= 0 && (
				h = Math.floor(t / 1000 / 60 / 60 % 24) < 10 ? '0' + Math.floor(t / 1000 / 60 / 60 % 24) : Math.floor(t / 1000 / 60 / 60 % 24),
				m = Math.floor(t / 1000 / 60 % 60) < 10 ? '0' + Math.floor(t / 1000 / 60 % 60) : Math.floor(t / 1000 / 60 % 60),
				s = Math.floor(t / 1000 % 60) < 10 ? '0' + Math.floor(t / 1000 % 60) : Math.floor(t / 1000 % 60)
			);
			o.find("[class$='_h']").length && o.find("[class$='_h']").html("<i>" + String(h)[0] + "</i><i>" + String(h)[1] + "</i>时");
			o.find("[class$='_m']").length && o.find("[class$='_m']").html("<i>" + String(m)[0] + "</i><i>" + String(m)[1] + "</i>分");
			o.find("[class$='_s']").length && o.find("[class$='_s']").html("<i>" + String(s)[0] + "</i><i>" + String(s)[1] + "</i>秒");
		}
	}
	$(window).on('load', function() {
		$('[data-downtime]').each(function() {
			var $this = $(this);
			var option = $this.data();
			var $time = option.downtime ? option.downtime : "";
			setInterval(DownTime($time, $this), 0);
		});
	})
}(jQuery);