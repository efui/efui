
/*
****数字键盘
****usage:
		$('.keyboard').Keyboard();
****demo:
html:	
<div class="keyboard">
  			<span class="enter-price i-text" id="enter-price"><span>请输入金额</span></span>
			<div class="keyboard-block">
				<div class="k-table">
					<table id="num-keyborder">
						<tr>
							<td><button>100</button></td>
							<td><button>1</button></td>
							<td><button>2</button></td>
							<td><button>3</button></td>
							<td><button class="f-cross del-btn"></button></td>
						</tr>
						<tr>
							<td><button>200</button></td>
							<td><button>4</button></td>
							<td><button>5</button></td>
							<td><button>6</button></td>
							<td><button>.</button></td>
						</tr>
						<tr>
							<td><button>300</button></td>
							<td><button>7</button></td>
							<td><button>8</button></td>
							<td><button>9</button></td>
							<td rowspan="2"><button class="pay-btn">完成</button></td>
						</tr>
						<tr>
							<td><button>500</button></td>
							<td><button class="close-btn f-arrow_down"></button></td>
							<td><button>0</button></td>
							<td><button></button></td>
						</tr>
					</table>
				</div>
			</div>
</div>
css:
.keyboard-block {
	position: relative;
	top: 10px;
	background: transparent;
	z-index: 9;
	visibility: hidden;
	transition: all .5s linear;
}

.keyboard-transition {
	transition-duration: .5s;
	-moz-transition-duration: .5s;
	-webkit-transition-duration: .5s;
}

.keyboard-block .object-img {
	width: 100%;
}

.k-table {
	background: #44679E;
	padding-bottom: 10px;
}

.k-table table {
	width: 100%;
}

.k-table td {
	width: 20%;
	height: 42px;
	padding: 5px;
}

.k-table td:first-child button {
	background: #2F486F;
	font-weight: 700;
}

.k-table button {
	border: 0;
	width: 100%;
	height: 100%;
	background: transparent;
	color: #fff;
	font-size: 1.35rem;
	border-radius: 10px;
	font-weight: 100;
}

.k-table .pay-btn {
	background: #2F486F;
	color: #fff;
	font-size: 14px;
}

.enter-price {
	display: inline-block;
	padding: 0 12px;
	height: 30px;
	line-height: 30px;
	width: 120px;
	font-size: 14px;
	color: #999 !important;
}

.enter-price.active {
	color: #333 !important;
}

.enter-price span {}

.enter-price span:before {
	content: "￥ ";
	display: none;
}

.enter-price span:after {
	content: " 元";
	display: none;
}

.enter-price.selected span:before,
.enter-price.selected span:after {
	display: inline-block;
}

*/
(function($) {
	var Keyboard = function(ele, options) {
		var $this = this;
		this.options= options;
		this.ele = $(ele);
		this._enter = this.ele.find('#enter-price');
		this.ele.on('click.price','#enter-price', $.proxy(this.price, this));
		this.ele.on('click.button','button', $.proxy(this.btncheck, this));
		this.ele.on('click.pay','.pay-btn', $.proxy(this.pay, this));
		this.ele.on('click.close','.close-btn', $.proxy(this.close, this));
		this._k_h = 0;
		this._val = '';
		this.init();

		if(options.autoSize){
			$(window).resize(function(){
				$this.resize();
			});
		}
	};
	Keyboard.DEFAULTS={
		autoSize:true
	};
	Keyboard.prototype = {
		init: function() {
			this.resize();
			this.close();
		},
		price: function(){
			this.open();
		},
		btncheck: function(event){
			var _target = event.srcElement? event.srcElement : event.target;
			var _num = $(_target).text();
			var _match = _num.match(/[\d|.]/);
			var _input = '';

			if(_match) {
				_input = _match.input;
				this._val = _input ? this._val + _input : this._val;
			} else if($(_target).hasClass('f-cross')) {
				this.del();
			};
			var _parse = /^[0|.]/.test(this._val);
			_parse && (alert('请输入大于0的金额'), this._val = '');
			!_parse && (this._enter.find('span').text(this._val), !this._enter.hasClass('active') && this._enter.addClass('active'));
		},
		del: function(){
			var _l = this._val.length;
			this._val = (this._val && this._val.match(/[\d]/)) ? this._val.substring(0, _l - 1) :'0.00';
		},
		pay: function(){
			var _parse = /^[1-9][\d|.]*$/.test(this._val);
			if(!_parse) {
				this._enter.hasClass('active') && this._enter.removeClass('active');
				this._enter.hasClass('selected') && this._enter.removeClass('selected');
				alert('请输入大于0的金额');
				return false;
			};
			this._enter.addClass('selected');
		},
		close: function(){
			this.ele.find('.keyboard-block').css({
				height:0,
				visibility:'visible'
			});
		},
		open: function() {
			this.ele.find('.keyboard-block').animate({
				height: this._k_h + "px"
			}, 600);
			$('html, body').delay('600').animate({
				scrollTop: $(document).height()
			}, 300);
		},
		resize: function() {
			this._k_h = this.ele.find('.keyboard-block').outerHeight(true);
		}
	};

	$.fn.Keyboard = function(option){		
		return this.each(function() {
			var _this = $(this);
			var options = $.extend({},Keyboard.DEFAULTS,typeof option == 'object' && option);
			_this.data('bs.keyboard', new Keyboard(this, options));
		});
	};

})(jQuery);