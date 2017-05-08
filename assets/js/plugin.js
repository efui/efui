//
//define('plugin',['jquery'],function($){
//	do something code....
//});
/*
****箭头左右切换，移动端左右滑动切换(mslider:true)
****usage:
		$('.picswitch').Picswitch();
****demo:
html:	
<div class="picswitch">
  	<span class="arrow-btn arrow-prev f-arrow_left"></span>
	<span class="arrow-btn arrow-next f-arrow_right"></span>
	<div class="picswitch-itmes">
   		<ul>
      		<li><img /></li>
         	<li><img /></li>
         	<li><img /></li>
    	</ul>
  	</div>
</div>
css:
.picswitch{position: relative;height: 160px;overflow: hidden;}
.picswitch .arrow-btn{display:block;width:76px;height:158px;border:1px solid #dde2ea;background-color: #f4f6f9;position: absolute;top:0;cursor: pointer;transition:all .5s ease-out;}
.picswitch .arrow-btn:hover{background: #5fa2ea;}
.arrow-prev{left:0;}
.arrow-next{right:0;}
.picswitch-itmes{width: 100%;overflow: hidden;position: relative;}
.picswitch ul{position: relative;}
.picswitch li{overflow: hidden;background: #fff;width: 100%;float: left;}
*/
(function($) {
	var Picswitch = function(ele, options) {
		var $this = this;
		this.options= options;
		this.ele = $(ele);
		this._b = this.ele.find('.arrow-btn');
		this._o = this.ele.find('li');
		this._l = this._o.length;
		this._p = this._o.closest('ul');
		this._w = 0;
		this._sw = 0;
		this._i = this.options.setIndex;
		this.ele.on('click.prev','.arrow-prev', $.proxy(this.prev, this));
		this.ele.on('click.next','.arrow-next', $.proxy(this.next, this));
		this.init();

		if(options.mslider){
	        var _startx,_endx;
	        this.ele.find('.picswitch-itmes').on('touchstart', function(event) {
	            var touch= event.originalEvent.touches[0];
	            _startx = touch.pageX;
	        });
	        this.ele.find('.picswitch-itmes').on('touchmove', function(event) {
	            event.preventDefault(); 
	            var touch= event.originalEvent.touches[0];
	            _endx = touch.pageX;
	        });
	        this.ele.find('.picswitch-itmes').on('touchend', function(event) {
	            if(_endx>_startx){
					$this.prev();
	            }
	            if(_endx<_startx){
					$this.next();
	            }
	        });
		}
		if(options.autoSize){
			$(window).resize(function(){
				$this.resize();
			});
		}
	};
	Picswitch.DEFAULTS={
		interval: 5000,
		setIndex:0,
		autoPlay:false,
		mslider:true,
		autoSize:true
	};
	Picswitch.prototype = {
		init: function() {
			this.resize();
			//this.play();
			var _index = this._i;
		},
		next: function() {
			this._i = this._i < (this._l - 1) ? this._i + 1 : this._i;
			this.anim();
		},
		prev: function() {
			this._i = this._i > 0 ? this._i - 1 : this._i;
			this.anim();
		},
		anim: function() {
			this.disableBtn();
			this._p.animate({
				left: '-' + this._w * this._i + "px"
			}, 600);
		},
		disableBtn:function(){
			var _index = this._i;
			var _len = this._l;
			this._b.each(function() {
              	$(this).removeClass('disable-btn');
              	!_index &&  $(this).hasClass('arrow-prev') && $(this).addClass('disable-btn').siblings('.arrow-btn').removeClass('disable-btn');
              	_index == (_len-1) &&  $(this).hasClass('arrow-next') && $(this).addClass('disable-btn').siblings('.arrow-btn').removeClass('disable-btn');
			});
		},
		resize: function() {
			this._w = this.ele.find('.picswitch-itmes').outerWidth(true);
			this._sw = this._w * this._l;
			this._o.width(this._w);
			this.disableBtn();
			this._p.css({
				'width': this._sw + 'px',
				'left': '-' + this._w * this._i + "px"
			});
		},
		play : function(){
			console.log(this+'play...');
			console.log(this.options);
		}
	};

	$.fn.Picswitch = function(option){		
		return this.each(function() {
			var _this = $(this);
			var options = $.extend({},Picswitch.DEFAULTS,typeof option == 'object' && option);

			_this.data('bs.Picswitch', new Picswitch(this, options));
		});
	};

})(jQuery);
