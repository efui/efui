/* ========================================================================
 * Bootstrap: modal.js v3.3.5
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+ function($) {
	'use strict';
	var Modal = function(element, options) {
		this.options = options
		this.$body = $(document.body)
		this.$element = $(element)
		this.$dialog = this.$element.find('.popup-dialog')
		this.$backdrop = null
		this.isShown = null
		this.originalBodyPad = null
		this.scrollbarWidth = 0
		this.ignoreBackdropClick = false

		if (this.options.remote) {
			this.$element
				.find('.popup-content')
				.load(this.options.remote, $.proxy(function() {
					this.$element.trigger('loaded.bs.modal')
				}, this))
		}
	}

	Modal.VERSION = '3.3.5'

	Modal.TRANSITION_DURATION = 300
	Modal.BACKDROP_TRANSITION_DURATION = 150

	Modal.DEFAULTS = {
		backdrop: true,
		keyboard: true,
		show: true
	}

	Modal.prototype.toggle = function(_relatedTarget) {
		return this.isShown ? this.hide() : this.show(_relatedTarget)
	}

	Modal.prototype.show = function(_relatedTarget) {
		var that = this
		var e = $.Event('show.bs.modal', {
			relatedTarget: _relatedTarget
		})
		this.$element.trigger(e)

		if (this.isShown || e.isDefaultPrevented()) return

		this.isShown = true

		this.checkScrollbar()
		this.setScrollbar()
		this.$body.addClass('popup-open')

		this.escape()
		this.resize()

		this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

		this.$dialog.on('mousedown.dismiss.bs.modal', function() {
			that.$element.one('mouseup.dismiss.bs.modal', function(e) {
				if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
			})
		})

		this.backdrop(function() {
			var transition = $.support.transition && that.$element.hasClass('fade')
			if (!that.$element.parent().length) {
				that.$element.appendTo(that.$body) // don't move modals dom position
			}

			that.$element
				.show()
				.scrollTop(0)

			that.adjustDialog()

			if (transition) {
				that.$element[0].offsetWidth // force reflow
			}

			that.$element.addClass('in')

			that.enforceFocus()

			var e = $.Event('shown.bs.modal', {
				relatedTarget: _relatedTarget
			})

			transition ?
				that.$dialog // wait for modal to slide in
				.one('bsTransitionEnd', function() {
					that.$element.trigger('focus').trigger(e)
				})
				.emulateTransitionEnd(Modal.TRANSITION_DURATION) :
				that.$element.trigger('focus').trigger(e)
		})
	}

	Modal.prototype.hide = function(e) {
		if (e) e.preventDefault()

		e = $.Event('hide.bs.modal')

		this.$element.trigger(e)

		if (!this.isShown || e.isDefaultPrevented()) return

		this.isShown = false

		this.escape()
		this.resize()

		$(document).off('focusin.bs.modal')

		this.$element
			.removeClass('in')
			.off('click.dismiss.bs.modal')
			.off('mouseup.dismiss.bs.modal')

		this.$dialog.off('mousedown.dismiss.bs.modal')

		$.support.transition && this.$element.hasClass('fade') ?
			this.$element
			.one('bsTransitionEnd', $.proxy(this.hideModal, this))
			.emulateTransitionEnd(Modal.TRANSITION_DURATION) :
			this.hideModal()
	}

	Modal.prototype.enforceFocus = function() {
		$(document)
			.off('focusin.bs.modal') // guard against infinite focus loop
			.on('focusin.bs.modal', $.proxy(function(e) {
				if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
					this.$element.trigger('focus')
				}
			}, this))
	}

	Modal.prototype.escape = function() {
		if (this.isShown && this.options.keyboard) {
			this.$element.on('keydown.dismiss.bs.modal', $.proxy(function(e) {
				e.which == 27 && this.hide()
			}, this))
		} else if (!this.isShown) {
			this.$element.off('keydown.dismiss.bs.modal')
		}
	}

	Modal.prototype.resize = function() {
		if (this.isShown) {
			$(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
		} else {
			$(window).off('resize.bs.modal')
		}
	}

	Modal.prototype.hideModal = function() {
		var that = this
		this.$element.hide()
		this.backdrop(function() {
			that.$body.removeClass('popup-open')
			that.resetAdjustments()
			that.resetScrollbar()
			that.$element.trigger('hidden.bs.modal')
		})
	}

	Modal.prototype.removeBackdrop = function() {
		this.$backdrop && this.$backdrop.remove()
		this.$backdrop = null
	}

	Modal.prototype.backdrop = function(callback) {
		var that = this
		var animate = this.$element.hasClass('fade') ? 'fade' : ''

		if (this.isShown && this.options.backdrop) {
			var doAnimate = $.support.transition && animate

			this.$backdrop = $(document.createElement('div'))
				.addClass('modal-backdrop ' + animate)
				.appendTo(this.$body)

			this.$element.on('click.dismiss.bs.modal', $.proxy(function(e) {
				if (this.ignoreBackdropClick) {
					this.ignoreBackdropClick = false
					return
				}
				if (e.target !== e.currentTarget) return
				this.options.backdrop == 'static' ? this.$element[0].focus() : this.hide()
			}, this))

			if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

			this.$backdrop.addClass('in')

			if (!callback) return

			doAnimate ?
				this.$backdrop
				.one('bsTransitionEnd', callback)
				.emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
				callback()

		} else if (!this.isShown && this.$backdrop) {
			this.$backdrop.removeClass('in')

			var callbackRemove = function() {
				that.removeBackdrop()
				callback && callback()
			}
			$.support.transition && this.$element.hasClass('fade') ?
				this.$backdrop
				.one('bsTransitionEnd', callbackRemove)
				.emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
				callbackRemove()

		} else if (callback) {
			callback()
		}
	}

	// these following methods are used to handle overflowing modals

	Modal.prototype.handleUpdate = function() {
		this.adjustDialog()
	}

	Modal.prototype.adjustDialog = function() {
		var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight
		var _s_h = this.$element.outerHeight(true) * 0.8;
		var _r_h = this.$element[0].firstElementChild.clientHeight;

		var _t_h = _r_h - 70 - this.$element.find('.popup-buttons').outerHeight(true);
		this.$element.find('.popup-text').height(_t_h + 'px');
		this.$element.css({
			paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
			paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
		})
	}

	Modal.prototype.resetAdjustments = function() {
		this.$element.css({
			paddingLeft: '',
			paddingRight: ''
		})
	}

	Modal.prototype.checkScrollbar = function() {
		var fullWindowWidth = window.innerWidth
		if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
			var documentElementRect = document.documentElement.getBoundingClientRect()
			fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
		}
		this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
		this.scrollbarWidth = this.measureScrollbar()
	}

	Modal.prototype.setScrollbar = function() {
		var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
		this.originalBodyPad = document.body.style.paddingRight || ''
		if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
	}

	Modal.prototype.resetScrollbar = function() {
		this.$body.css('padding-right', this.originalBodyPad)
	}

	Modal.prototype.measureScrollbar = function() { // thx walsh
		var scrollDiv = document.createElement('div')
		scrollDiv.className = 'modal-scrollbar-measure'
		this.$body.append(scrollDiv)
		var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
		this.$body[0].removeChild(scrollDiv)
		return scrollbarWidth
	}

	// MODAL PLUGIN DEFINITION
	// =======================

	function Plugin(option, _relatedTarget) {
		return this.each(function() {
			var $this = $(this)
			var data = $this.data('bs.modal')
			var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

			if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
			if (typeof option == 'string') data[option](_relatedTarget)
			else if (options.show) data.show(_relatedTarget)
		})
	}

	var old = $.fn.modal

	$.fn.modal = Plugin
	$.fn.modal.Constructor = Modal

	// MODAL NO CONFLICT
	// =================

	$.fn.modal.noConflict = function() {
		$.fn.modal = old
		return this
	}

	// MODAL DATA-API
	// ==============

	$(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function(e) {
		var $this = $(this)
		var href = $this.attr('href')
		var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
		var option = $target.data('bs.modal') ? 'toggle' : $.extend({
			remote: !/#/.test(href) && href
		}, $target.data(), $this.data())

		if ($this.is('a')) e.preventDefault()

		$target.one('show.bs.modal', function(showEvent) {
			if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
			$target.one('hidden.bs.modal', function() {
				$this.is(':visible') && $this.trigger('focus')
			})
		})
		Plugin.call($target, option, this)
	})

}(jQuery);

+ function($) {
	"use strict";
	$.fn.confirm = function(option) {
		return this.each(function() {
			var $this = $(this)
			var data = $this.data('bs.confirm')
			var options = $.extend({}, Jconfirm.DEFAULTS, $this.data(), typeof option == 'object' && option)

			if (!data) $this.data('bs.confirm', (data = new Jconfirm(this, options)))
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
		layer: '<div class="modal-backdrop fade"></div>',
		template: '<div class="popup fade">' +
			'<div class="popup-dialog">' +
			'<div class="popup-content">' +
			'<div class="popup-inner">' +
			'<div class="closeIcon">&times;</div>' +
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
		if (!this.closeIcon) this.$closeIcon.remove();
		this.setTitle();
		this.setIcon();
		this.setContent();
		this._setButtons();
	}
	Jconfirm.prototype._bindEvents = function() {
		var _this = this;
		if (this.$confirmButton) {
			this.$confirmButton.click(function(e) {
				e.preventDefault();
				var r = _this.confirm(_this.$el);
				if (typeof r === 'undefined' || r) _this.close();
			});
		}
		if (this.$cancelButton) {
			this.$cancelButton.click(function(e) {
				e.preventDefault();
				var r = _this.cancel(_this.$el);
				if (typeof r === 'undefined' || r) _this.close();
			});
		}
	}
	Jconfirm.prototype._setButtons = function() {
		this.$btnc = this.$el.find('.popup-buttons');
		if (this.cancelButton && $.trim(this.cancelButton) !== '') {
			this.$cancelButton = $('<button type="button" class="popup-button">' + this.cancelButton + '</button>').appendTo(this.$btnc).addClass(this.cancelButtonClass);
		}
		if (this.confirmButton && $.trim(this.confirmButton) !== '') {
			this.$confirmButton = $('<button type="button" class="popup-button">' + this.confirmButton + '</button>').appendTo(this.$btnc).addClass(this.confirmButtonClass);
		}
		if (!this.confirmButton && !this.cancelButton) {
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
		if (this.isClosed()) return false;
		this._lastFocused.focus();
		this.$elayer.removeClass('in').remove();
		this.$el.removeClass('in').remove();
		return true;
	}
	Jconfirm.prototype.open = function() {
		if (this.isClosed()) return false;
		this.$elayer.addClass('in');
		this.$el.addClass('in').find('input[autofocus]:visible:first').focus();
		return true;
	}
	Jconfirm.prototype.isClosed = function() {
		return this.$el.css('display') === '';
	}
}(jQuery);

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
