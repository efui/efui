/**
 * 选择列表插件
 */
(function($, window, document, undefined) {
	if('ontouchstart' in window) {
		$.isTouchable = true;
		$.EVENT_START = 'touchstart';
		$.EVENT_MOVE = 'touchmove';
		$.EVENT_END = 'touchend';
	} else {
		$.isTouchable = false;
		$.EVENT_START = 'mousedown';
		$.EVENT_MOVE = 'mousemove';
		$.EVENT_END = 'mouseup';
	}
	$.EVENT_CANCEL = 'touchcancel';
	$.EVENT_CLICK = 'click';
	
	var MAX_EXCEED = 30;
	var VISIBLE_RANGE = 90;
	var DEFAULT_ITEM_HEIGHT = 52;
	var BLUR_WIDTH = 10;

	var rad2deg = $.rad2deg = function(rad) {
		return rad / (Math.PI / 180);
	};

	var deg2rad = $.deg2rad = function(deg) {
		return deg * (Math.PI / 180);
	};

	var platform = navigator.platform.toLowerCase();
	var userAgent = navigator.userAgent.toLowerCase();
	var isIos = (userAgent.indexOf('iphone') > -1 ||
			userAgent.indexOf('ipad') > -1 ||
			userAgent.indexOf('ipod') > -1) &&
		(platform.indexOf('iphone') > -1 ||
			platform.indexOf('ipad') > -1 ||
			platform.indexOf('ipod') > -1);

	var Picker = $.Picker = function(holder, options) {
		var self = this;
		self.holder = holder;
		self.options = options || {};
		self.init();
		self.initInertiaParams();
		self.calcElementItemPostion(true);
		self.bindEvent();
	};

	Picker.prototype.findElementItems = function() {
		var self = this;
		self.elementItems = [].slice.call(self.holder.querySelectorAll('li'));
		return self.elementItems;
	};

	Picker.prototype.init = function() {
		var self = this;
		self.list = self.holder.querySelector('ul');
		self.findElementItems();
		self.height = self.holder.offsetHeight;
		self.r = self.height / 2 - BLUR_WIDTH;
		self.d = self.r * 2;
		self.itemHeight = self.elementItems.length > 0 ? self.elementItems[0].offsetHeight : DEFAULT_ITEM_HEIGHT;
		self.itemAngle = parseInt(self.calcAngle(self.itemHeight * 0.8));
		self.hightlightRange = self.itemAngle / 2;
		self.visibleRange = VISIBLE_RANGE;
		self.beginAngle = 0;
		self.beginExceed = self.beginAngle - MAX_EXCEED;
		self.list.angle = self.beginAngle;
		if(isIos) {
			self.list.style.webkitTransformOrigin = "center center " + self.r + "px";
		}
	};

	Picker.prototype.calcElementItemPostion = function(andGenerateItms) {
		var self = this;
		if(andGenerateItms) {
			self.items = [];
		}
		self.elementItems.forEach(function(item) {
			var index = self.elementItems.indexOf(item);
			self.endAngle = self.itemAngle * index;
			item.angle = self.endAngle;
			//console.log($(item).hasClass('highlight'));
			item.style.webkitTransformOrigin = "center center -" + self.r + "px";
			item.style.webkitTransform = "translateZ(" + self.r + "px) rotateX(" + (-self.endAngle) + "deg)";
			if(andGenerateItms) {
				var dataItem = {};
				dataItem.text = item.innerHTML || '';
				dataItem.value = item.getAttribute('data-value') || dataItem.text;
				self.items.push(dataItem);
			}
		});
		self.endExceed = self.endAngle + MAX_EXCEED;
		self.calcElementItemVisibility(self.beginAngle);
	};

	Picker.prototype.calcAngle = function(c) {
		var self = this;
		var a = b = parseFloat(self.r);
		//直径的整倍数部分直接乘以 180
		c = Math.abs(c); //只算角度不关心正否值
		var intDeg = parseInt(c / self.d) * 180;
		c = c % self.d;
		//余弦
		var cosC = (a * a + b * b - c * c) / (2 * a * b);
		var angleC = intDeg + rad2deg(Math.acos(cosC));
		return angleC;
	};

	Picker.prototype.calcElementItemVisibility = function(angle) {
		var self = this;
		self.elementItems.forEach(function(item) {
			var difference = Math.abs(item.angle - angle);
			if(difference < self.hightlightRange) {
				$(item).addClass('highlight');
			} else if(difference < self.visibleRange) {
				$(item).addClass('visible');
				$(item).removeClass('highlight');
			} else {
				$(item).removeClass('highlight');
				$(item).removeClass('visible');
			}
		});
	};

	Picker.prototype.setAngle = function(angle) {
		var self = this;
		self.list.angle = angle;
		self.list.style.webkitTransform = "perspective(1000px) rotateY(0deg) rotateX(" + angle + "deg)";
		self.calcElementItemVisibility(angle);
	};

	Picker.prototype.bindEvent = function() {
		var self = this;
		var lastAngle = 0;
		var startY = null;
		var isPicking = false;
		self.holder.addEventListener($.EVENT_START, function(event) {
			isPicking = true;
			event.preventDefault();
			self.list.style.webkitTransition = '';
			startY = (event.changedTouches ? event.changedTouches[0] : event).pageY;
			lastAngle = self.list.angle;
			self.updateInertiaParams(event, true);
		}, false);
		self.holder.addEventListener($.EVENT_END, function(event) {
			isPicking = false;
			event.preventDefault();
			self.startInertiaScroll(event);
		}, false);
		self.holder.addEventListener($.EVENT_CANCEL, function(event) {
			isPicking = false;
			event.preventDefault();
			self.startInertiaScroll(event);
		}, false);
		self.holder.addEventListener($.EVENT_MOVE, function(event) {
			if(!isPicking) {
				return;
			}
			event.preventDefault();
			var endY = (event.changedTouches ? event.changedTouches[0] : event).pageY;
			var dragRange = endY - startY;
			var dragAngle = self.calcAngle(dragRange);
			var newAngle = dragRange > 0 ? lastAngle - dragAngle : lastAngle + dragAngle;
			if(newAngle > self.endExceed) {
				newAngle = self.endExceed
			}
			if(newAngle < self.beginExceed) {
				newAngle = self.beginExceed
			}
			self.setAngle(newAngle);
			self.updateInertiaParams(event);
		}, false);
	};

	Picker.prototype.initInertiaParams = function() {
		var self = this;
		self.lastMoveTime = 0;
		self.lastMoveStart = 0;
		self.stopInertiaMove = false;
	};

	Picker.prototype.updateInertiaParams = function(event, isStart) {
		var self = this;
		var point = event.changedTouches ? event.changedTouches[0] : event;
		if(isStart) {
			self.lastMoveStart = point.pageY;
			self.lastMoveTime = event.timeStamp || Date.now();
			self.startAngle = self.list.angle;
		} else {
			var nowTime = event.timeStamp || Date.now();
			if(nowTime - self.lastMoveTime > 300) {
				self.lastMoveTime = nowTime;
				self.lastMoveStart = point.pageY;
			}
		}
		self.stopInertiaMove = true;
	};

	Picker.prototype.startInertiaScroll = function(event) {
		var self = this;
		var point = event.changedTouches ? event.changedTouches[0] : event;
		/** 
		 * 缓动代码
		 */
		var nowTime = event.timeStamp || Date.now();
		var v = (point.pageY - self.lastMoveStart) / (nowTime - self.lastMoveTime); //最后一段时间手指划动速度  
		var dir = v > 0 ? -1 : 1; //加速度方向  
		var deceleration = dir * 0.0006 * -1;
		var duration = Math.abs(v / deceleration); // 速度消减至0所需时间  
		var dist = v * duration / 2; //最终移动多少 
		var startAngle = self.list.angle;
		var distAngle = self.calcAngle(dist) * dir;
		//----
		var srcDistAngle = distAngle;
		if(startAngle + distAngle < self.beginExceed) {
			distAngle = self.beginExceed - startAngle;
			duration = duration * (distAngle / srcDistAngle) * 0.6;
		}
		if(startAngle + distAngle > self.endExceed) {
			distAngle = self.endExceed - startAngle;
			duration = duration * (distAngle / srcDistAngle) * 0.6;
		}
		if(distAngle == 0) {
			self.endScroll();
			return;
		}
		self.scrollDistAngle(nowTime, startAngle, distAngle, duration);
	};

	Picker.prototype.scrollDistAngle = function(nowTime, startAngle, distAngle, duration) {
		var self = this;
		self.stopInertiaMove = false;
		(function(nowTime, startAngle, distAngle, duration) {
			var frameInterval = 13;
			var stepCount = duration / frameInterval;
			var stepIndex = 0;
			(function inertiaMove() {
				if(self.stopInertiaMove) return;
				var newAngle = self.quartEaseOut(stepIndex, startAngle, distAngle, stepCount);
				self.setAngle(newAngle);
				stepIndex++;
				if(stepIndex > stepCount - 1 || newAngle < self.beginExceed || newAngle > self.endExceed) {
					self.endScroll();
					return;
				}
				setTimeout(inertiaMove, frameInterval);
			})();
		})(nowTime, startAngle, distAngle, duration);
	};

	Picker.prototype.quartEaseOut = function(t, b, c, d) {
		return -c * ((t = t / d - 1) * t * t * t - 1) + b;
	};

	Picker.prototype.endScroll = function() {
		var self = this;
		if(self.list.angle < self.beginAngle) {
			self.list.style.webkitTransition = "150ms ease-out";
			self.setAngle(self.beginAngle);
		} else if(self.list.angle > self.endAngle) {
			self.list.style.webkitTransition = "150ms ease-out";
			self.setAngle(self.endAngle);
		} else {
			var index = parseInt((self.list.angle / self.itemAngle).toFixed(0));
			self.list.style.webkitTransition = "100ms ease-out";
			self.setAngle(self.itemAngle * index);
		}
		self.triggerChange();
	};

	Picker.prototype.triggerChange = function(force) {
		var self = this;
		setTimeout(function() {
			var index = self.getSelectedIndex();
			var item = self.items[index];
			if($.trigger && (index != self.lastIndex || force === true)) {
				$.trigger(self.holder, 'change', {
					"index": index,
					"item": item
				});
			}
			self.lastIndex = index;
			typeof force === 'function' && force();
		}, 0);
	};

	Picker.prototype.correctAngle = function(angle) {
		var self = this;
		if(angle < self.beginAngle) {
			return self.beginAngle;
		} else if(angle > self.endAngle) {
			return self.endAngle;
		} else {
			return angle;
		}
	};

	Picker.prototype.setItems = function(items) {
		var self = this;
		self.items = items || [];
		var buffer = [];
		self.items.forEach(function(item) {
			if(item !== null && item !== undefined) {
				buffer.push('<li>' + (item.text || item) + '</li>');
			}
		});
		self.list.innerHTML = buffer.join('');
		self.findElementItems();
		self.calcElementItemPostion();
		self.setAngle(self.correctAngle(self.list.angle));
		self.triggerChange(true);
	};

	Picker.prototype.getSelectedIndex = function() {
		var self = this;
		return parseInt((self.list.angle / self.itemAngle).toFixed(0));
	};
	Picker.prototype.getSelectedItem = function() {
		var self = this;
		return self.items[self.getSelectedIndex()];
	};

	if($.fn) {
		$.fn.picker = function(options) {
			//遍历选择的元素
			this.each(function(i, element) {
				if(element.picker) return;
				if(options) {
					element.picker = new Picker(element, options);
				} else {
					var optionsText = element.getAttribute('data-picker-options');
					var _options = optionsText ? JSON.parse(optionsText) : {};
					element.picker = new Picker(element, _options);
				}
			});
			return this[0] ? this[0].picker : null;
		};

		//自动初始化
		$.ready(function() {
			$('.picker').picker();
		});
	}

})(jQuery || window, window, document, undefined);

/**
 * 弹出选择列表插件
 */
+function($, document) {
	//创建 DOM
	$.dom = function(str) {
		if(typeof(str) !== 'string') {
			if((str instanceof Array) || (str[0] && str.length)) {
				return [].slice.call(str);
			} else {
				return [str];
			}
		}
		if(!$.__create_dom_div__) {
			$.__create_dom_div__ = document.createElement('div');
		}
		$.__create_dom_div__.innerHTML = str;
		return [].slice.call($.__create_dom_div__.childNodes);
	};
	$.later = function(fn, when, context, data) {
		when = when || 0;
		var m = fn;
		var d = data;
		var f;
		var r;

		if(typeof fn === 'string') {
			m = context[fn];
		}

		f = function() {
			m.apply(context, $.isArray(d) ? d : [d]);
		};

		r = setTimeout(f, when);

		return {
			id: r,
			cancel: function() {
				clearTimeout(r);
			}
		};
	};
	$.createMask = function(callback) {
		var element = document.createElement('div');
		element.classList.add('backdrop');
		element.addEventListener($.EVENT_MOVE, $.preventDefault);
		element.addEventListener('tap', function() {
			mask.close();
		});
		var mask = [element];
		mask._show = false;
		mask.show = function() {
			mask._show = true;
			element.setAttribute('style', 'opacity:1');
			document.body.appendChild(element);
			return mask;
		};
		mask._remove = function() {
			if (mask._show) {
				mask._show = false;
				element.setAttribute('style', 'opacity:0');
				$.later(function() {
					var body = document.body;
					element.parentNode === body && body.removeChild(element);
				}, 350);
			}
			return mask;
		};
		mask.close = function() {
			if (callback) {
				if (callback() !== false) {
					mask._remove();
				}
			} else {
				mask._remove();
			}
		};
		return mask;
	};
	var panelBuffer = '<div class="poppicker">\
		<div class="poppicker-header">\
			<a href="javascript:;" class="poppicker-btn-ok">确定</a>\
		</div>\
		<div class="poppicker-body">\
		</div>\
	</div>';

	var pickerBuffer = '<div class="picker">\
		<div class="picker-inner">\
			<div class="pciker-rule pciker-rule-ft"></div>\
			<ul class="pciker-list">\
			</ul>\
			<div class="pciker-rule pciker-rule-bg"></div>\
		</div>\
	</div>';

	//定义弹出选择器类
	var PopPicker = $.PopPicker = function() {
		this.init();
	};
	//构造函数
	PopPicker.prototype.init = function(options) {
		var self = this;
		self.options = options || {};
		self.options.buttons = self.options.buttons || ['确认'];
		self.panel = $.dom(panelBuffer)[0];
		document.body.appendChild(self.panel);
		self.ok = self.panel.querySelector('.poppicker-btn-ok');
		self.body = self.panel.querySelector('.poppicker-body');
		self.mask = $.createMask();
		self.ok.innerText = self.options.buttons[0];
		self.ok.addEventListener('tap', function(event) {
			if (self.callback) {
				var rs = self.callback(self.getSelectedItems());
				if (rs !== false) {
					self.hide();
				}
			}
		}, false);
		self.mask[0].addEventListener('tap', function() {
			self.hide();
		}, false);
		self._createPicker();
		//防止滚动穿透
		self.panel.addEventListener($.EVENT_START, function(event) {
			event.preventDefault();
		}, false);
		self.panel.addEventListener($.EVENT_MOVE, function(event) {
			event.preventDefault();
		}, false);
	}
	PopPicker.prototype._createPicker = function() {
		var self = this;
		var layer = self.options.layer || 1;
		var width = (100 / layer) + '%';
		self.pickers = [];
		for(var i = 1; i <= layer; i++) {
			var pickerElement = $.dom(pickerBuffer)[0];
			pickerElement.style.width = width;
			self.body.appendChild(pickerElement);
			var picker = $(pickerElement).picker();
			self.pickers.push(picker);
			pickerElement.addEventListener('change', function(event) {
				var nextPickerElement = this.nextSibling;
				if(nextPickerElement && nextPickerElement.picker) {
					var eventData = event.detail || {};
					var preItem = eventData.item || {};
					nextPickerElement.picker.setItems(preItem.children);
				}
			}, false);
		}
	}
	//填充数据
	PopPicker.prototype.setData = function(data) {
		var self = this;
		data = data || [];
		self.pickers[0].setItems(data);
	}
	//获取选中的项（数组）
	PopPicker.prototype.getSelectedItems= function() {
		var self = this;
		var items = [];
		for (var i in self.pickers) {
			var picker = self.pickers[i];
			items.push(picker.getSelectedItem() || {});
		}
		return items;
	}
	//显示
	PopPicker.prototype.show = function(callback) {
		var self = this;
		self.callback = callback;
		self.mask.show();
		$('body').addClass('poppicker-active-for-page');
		$(self.panel).addClass('active');
		//处理物理返回键
		self.__back = $.back;
		$.back = function() {
			self.hide();
		};
	}
	//隐藏
	PopPicker.prototype.hide = function() {
		var self = this;
		if(self.disposed) return;
		$(self.panel).removeClass('active');
		self.mask.close();
		$('body').removeClass('poppicker-active-for-page');
		//处理物理返回键
		$.back = self.__back;
	}
	PopPicker.prototype.dispose = function() {
		var self = this;
		self.hide();
		setTimeout(function() {
			self.panel.parentNode.removeChild(self.panel);
			for(var name in self) {
				self[name] = null;
				delete self[name];
			};
			self.disposed = true;
		}, 300);
	}
}(jQuery, document);

