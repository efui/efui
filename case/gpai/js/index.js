	$(function(){
		//fn_ajax_html("IndexAuctionBig","reValue=-1","#Auction_Index");
		var index = 0;  
		$(".tab_title ul li").click(function(){
			index = $(".tab_title ul li").index(this);
			$(this).addClass("selected").siblings().removeClass("selected");
			//$(".tab_content #none").eq(index).show().siblings().hide();
			fn_ajax_html("IndexAuctionBig","reValue="+$("#IAB"+index).attr("iabdatevalue"),"#Auction_Index");

		});


		var index = 0;  
		$(".tab_title ul li").click(function(){
			index = $(".tab_title ul li").index(this);
			$(this).addClass("selected").siblings().removeClass("selected");
			$(".tab_content dl").eq(index).show().siblings().hide();
		});
		var i = 6;  //定义每个面板显示8个菜单
		var len = $(".u .scrol li").length;  //获得LI元素的个数
		var page = 1;
		var maxpage = Math.ceil(len/i);
		var scrollWidth = $(".u").width()+20;
		var divbox = "<div id='div1' ></div>";
		$("body").append(divbox);
		$(".vright").click(function(e){
			if(!$(".u .scrol").is(":animated")){
			if(page == maxpage ){
				$(".u .scrol").stop();
				$("#div1").css({
					"top": (e.pageY + 20) +"px",
					"left": (e.pageX + 20) +"px",
					"opacity": "0.9"
				}).stop(true,false).fadeIn(793).fadeOut(793);
			}else{
				$(".u .scrol").animate({left : "-=" + scrollWidth +"px"},2000);
				page++;
			}
			}
		});
		$(".vleft").click(function(){
		if(!$(".u .scrol").is(":animated")){
			if(page == 1){
			$(".u .scrol").stop();
			}else{
			$(".u .scrol").animate({left : "+=" + scrollWidth +"px"},2000);
			page--;
			}
			}
		});
	});







function fn_load_itemarea(fnthis){


}



function getStyle(obj, name) {
    if (obj.currentStyle) {
        return obj.currentStyle[name]
    } else {
        return getComputedStyle(obj, false)[name]
    }
}

function getByClass(oParent, nClass) {
    var eLe = oParent.getElementsByTagName('*');
    var aRrent = [];
    for (var i = 0; i < eLe.length; i++) {
        if (eLe[i].className == nClass) {
            aRrent.push(eLe[i]);
        }
    }
    return aRrent;
}

function startMove(obj, att, add) {
    clearInterval(obj.timer);
	obj.timer = setInterval(function() {
        var cutt = 0;
        if (att == 'opacity') {
            cutt = Math.round(parseFloat(getStyle(obj, att)));
        } else {
            cutt = Math.round(parseInt(getStyle(obj, att)));
        }
        var speed = (add - cutt) / 4;
        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
        if (cutt == add) {
            clearInterval(obj.timer)
        } else {
            if (att == 'opacity') {
                obj.style.opacity = (cutt + speed) / 100;
                obj.style.filter = 'alpha(opacity:' + (cutt + speed) + ')';
            } else {
                obj.style[att] = cutt + speed + 'px';
            }
        }

    },
    30)
}


//		 for banner

window.onload = function() {
    var oDiv = document.getElementById('playBox');
    var oPre = getByClass(oDiv, 'pre')[0];
    var oNext = getByClass(oDiv, 'next')[0];
    var oUlBig = getByClass(oDiv, 'oUlplay')[0];
    var aBigLi = oUlBig.getElementsByTagName('li');
    var oDivSmall = getByClass(oDiv, 'smalltitle')[0]
    var aLiSmall = oDivSmall.getElementsByTagName('li');

    function tab() {
        for (var i = 0; i < aLiSmall.length; i++) {
            aLiSmall[i].className = '';
        }
        //aLiSmall[now].className = 'thistitle';
		startMove(oUlBig, 'left', -(now * aBigLi[0].offsetWidth))
    }
    var now = 0;
    for (var i = 0; i < aLiSmall.length; i++) {
        aLiSmall[i].index = i;
        aLiSmall[i].onclick = function() {
            now = this.index;
            tab();
        }
    }
    oPre.onclick = function() {
        now--
        if (now == -1) {
            now = aBigLi.length;
        }
        tab();
    }
    oNext.onclick = function() {
        now++
        if (now == aBigLi.length) {
            now = 0;
        }
        tab();
    }
    var timer = setInterval(oNext.onclick, 3000) //滚动间隔时间设置
    oDiv.onmouseover = function() {
        clearInterval(timer)
    }
    oDiv.onmouseout = function() {
        timer = setInterval(oNext.onclick, 3000) //滚动间隔时间设置
    }
}