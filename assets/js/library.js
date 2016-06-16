/* 
    作    者：甘献
    创建时间：2013年8月20日21:42:50   yblibrary.js
*/
var JsLibraryVersion = 1.420;

yn = "";
(function ($) {


    $.fn.extend({
        /*
            取被选中控件的名字
            例：
                $(this).yb_ChkOpt();
                $(this).yb_ChkOpt(true); 
            @isq checkbox ID的前缀
        */
        yb_chkOpt: function (isq) {
            $.yb_ChkOpt($(this).attr("id") || $(this).attr("name"), isq || !this.attr("checked"));
        },
        /*
            控件添加回车事件
            例：
                $(this).yb_enter(function () {
                    alert(this.val());
                });
            @fun 回车后执行事物
        */
        yb_enter: function (fun) {
            var $this = $(this);
            $this.focusin(function () {
                $this.unbind("keydown").keydown(function (e) {
                    if ((e.keyCode || e.which) == 13) {
                        if ($.isFunction(fun)) {
                            fun.call($this);
                        }
                        return true;
                    }

                });
                return false;
            });
            return $this;
        },



        /*
            移除文本框内的默认值
            例：
                $(this).yb_removeDefValue()
        */
        yb_removeDefValue: function () {

            $(this).focusin(function () {
                if (this.defaultValue == this.value) {
                    this.value = "";
                    $(this).removeClass($(this).data().defaultClass);
                }
            }).blur(function () {
                if (this.value == "" || this.defaultValue == this.value) {
                    this.value = this.defaultValue;
                    $(this).attr("class", $(this).data().defaultClass);
                }
            });
            return this;

        },
        //文本框变密码框
        yb_text2password: function (cm) {
            $(this).each(function () {
                var self = $(this);
                self.focusin(function () {
                    var ID = (self.attr('id') || self.attr('name') || 'ord');
                    var psWord = $("<input/>", {
                        'type': 'password',
                        'name': 'pw' + ID,
                        'id': 'pw' + ID,
                        'class': self.attr('class') || '',
                        'style': self.attr('style') || ''
                    });
                    self.after(psWord);
                    setTimeout(function () { psWord.addClass(cm || self.data().text2password).focus(); }, 100);

                    self.hide();
                    psWord.blur(function () {
                        if (this.value == '') {
                            $(this).remove();
                            self.show();
                        }
                    });
                });
            });
        },

        /*
            滚动条到底部时执行操作
            例：
                $(window).yb_scrollPage(function () {  
                    //具体代码实现 ...... 
                    this.look = true; //必须使用this.look来阻止列队请求 
                });
            注意：匿名fun内必须使用this.look来阻止列队请求 
            @fun 滚动条到底部时执行事物 
        */
        yb_scrollPage: function (fun) {
            var $this = this;
            $this.look = true;
            $(this).scroll(function () {

                var sTop = (this.scrollY || this.pageYOffset || $(this).scrollTop()) + $(this).height();
                var WH = $(window).height();
                var h = this === window ? $("body").height() : (this.scrollHeight - ($(this).outerHeight() - $(this).height()));
                if (sTop >= h && $this.look) {
                    $this.look = false;
                    if ($.isFunction(fun)) fun.call($this);
                }
            });
            return false;
        },



        yb_alert: function () {
            ;
        },
        yb_confirm: function (options) {

        },
        /*
          弹窗  
          <a href="#" data-reveal-id="myModal"   data-content='展示内容' >弹窗</a> 
          data-reveal-id：要弹窗的对象（文档模板）  当标签内出现此属性，则不要调用任何方法或事件 
          data-content：展示内容，字符串或对象 
          data-[options参数名称]：可直接设置options参数

         弹窗模板：
             <div id="myModal" class="reveal-modal">
                 展示的内容,可以使任意文档 
                <a class="close-reveal-modal">&#215;</a>
              </div> 

          @options = {
              animation: '[fadeAndPop|fade|none]',    窗体出现的动画效果           默认fadeAndPop    可不填
              animationspeed: 300,                    动画间隔时间                 默认300毫秒       可不填
              closeonbgclick: true,                   单机背景蒙板是否关闭         默认开启          可不填
              modalbg:true,                           是否关闭蒙板                 默认关闭          可不填
              drag:false,                             拖拽                         默认false         可不填
              follow:false,                           跟随激活控件                 默认false         可不填 
              modalclass: 'close-reveal-modal',       给指定的对象添加关闭事件     默认无            可不填
              closetime:0                             自动关闭时间，0/毫秒不关闭   默认为0           可不填
              content:                                展示内容，字符串或对象       默认空            必填   
                                                      可添加模板内容，格式“url:/a/temp.html”  “iframe(255):/a/temp.html” 注意：iframe(高度)
              size: '0,0'                             窗口大小                     默认0x0          可不填 
              title:'',                               标题 ==false 隐藏标题
              button:[],                              创建的按钮名称
              callbutton:function (mbox[当前窗口对象]) { } 给窗体内出现的按钮添加事件
              
          }
      */
        yb_prompt: function (options) {

            options = $.extend({}, options || {}, $(this).data());
            if (options.look) { //抖动窗口
                var modalId = $('.' + options.modalId);
                var os = modalId.offset();
                modalId.animate({ left: os.left - 2 }, 10)
                    .animate({ top: os.top - 2 }, 10)
                    .animate({ left: os.left + 4 }, 10)
                    .animate({ top: os.top + 4 }, 10)
                    .animate({ left: os.left - 4 }, 10)
                    .animate({ top: os.top - 4 }, 10)
                    .animate({ left: os.left }, 10)
                    .animate({ top: os.top }, 10);
                return;
            }

            $(this).data('look', true);
            options = $.extend(options, { former: this });
            var rmdIndex = Math.round(Math.random() * 1000);
            //当前层唯一标示
            var rmdIndexObj = 'reveal-Index-' + rmdIndex;
            $(this).data("modalId", rmdIndexObj);

            var modal = $('<div  class="reveal-modal reveal-Index-' + rmdIndex + '"   id="sys-reveal-modal">' +
                        '<div class="reveal-title"><a class="close-reveal-modal">&#215;</a><div></div></div>' +
                        '<div  class="reveal-center"></div>  ' +
                        '<div  class="reveal-buttom">&nbsp;</div>' +
                    '</div>');

            if (/^url:/ig.test(options.content)) {
                modal.load(options.content.split(':')[1]);
            } else if (/^iframe(\((\d+)\))?\:/ig.test(options.content)) {
                var url = options.content.split(':');
                var srcUrl = options.content.replace(url[0] + ":", "");
                var IFRAME = $("<iframe iframeIndex=" + rmdIndexObj + " frameborder='0' src='" + srcUrl + "'  width='100%' ></iframe>");// src='" + url[1] + "' 
                IFRAME.get(0).former = options.former;
                IFRAME.load(function () {

                    var ohw = $(this.contentWindow.document.body).html();
                    ohw = /<!--({width:'?\d+(%')?,height:'?\d+(%')?})-->/ig.exec(ohw);
                    if (ohw == null) return;
                    if (ohw.length > 1) {
                        ohw = Function('return ' + ohw[1] + ';')();//eval("(" + ohw[1] + ")");
                        var whw = { height: $(window).height(), width: $(window).width() }
                        if (ohw.height > whw.height) {
                            ohw.height = whw.height;
                        }
                        if (ohw.width > whw.width) {
                            ohw.width = whw.width;
                        }

                        if (/%/ig.test(ohw.width)) {
                            ohw.width = whw.width / 100 * parseInt(ohw.width);
                        }
                        if (/%/ig.test(ohw.height)) {
                            ohw.height = whw.height / 100 * parseInt(ohw.height);
                        }

                        var top = (whw.height - ohw.height) / 2 + $(document).scrollTop();
                        var ofs = $.extend({ 'left': (whw.width - ohw.width) / 2, 'top': top }, ohw);

                        $('.reveal-center', modal).css("padding", 0);
                        IFRAME.animate({ height: ohw.height, width: '100%' });
                        modal.animate(ofs, 'fast');
                    }
                });
                var h = /^iframe(\((\d+)\))?/ig.exec(url[0]);
                if (h != '') {
                    IFRAME.height(h[2]);
                }

                $('.reveal-center', modal).prepend(IFRAME);
            } else {
                $('.reveal-center', modal).prepend(options.content);
            }
            var rid = $('#' + options.revealId);

            //$('#sys-reveal-modal').remove();
            if (rid.length > 0) {
                modal = rid;
                modal.data('ismodal', true);//.attr('id', 'sys-reveal-modal');
                if (options.follow) {
                    modal.insertAfter(this);
                    options.animation = 'none';
                }
                else
                    modal.appendTo('body');
            }
            else {
                if (this.is('.reveal-modal')) {
                    modal = $(this);
                    modal.data('ismodal', true);
                }

                if (options.follow) {
                    modal.insertAfter(this);
                    options.animation = '';
                }
                else
                    modal.appendTo('body');
            }


            var mtitle = $('.reveal-title>div', modal);
            if (options.title == false) {
                $('.reveal-title', modal).remove();
            } else {
                if (options.drag) {
                    mtitle.yb_drag(modal);
                }
                mtitle.width('99%');//mtitle.width() - $('.close-reveal-modal').width()
                mtitle.append(options.title);
            }

            //绑定拖拽


            //添加按钮
            var BUTTOM = $('.reveal-buttom', modal);
            if (options.button && options.button.length > 0) {
                options.button = options.button.split(',');
                $(options.button).each(function () {
                    $('<input/>', { type: "button", value: this.toString() }).appendTo(BUTTOM);
                });
            } else {
                if (BUTTOM.find('input').length == 0) BUTTOM.remove();
            }

            modal.yb_reveal(options);
        },
        /*
            弹窗  
            @options = {
                animation: '[fadeAndPop|fade|none]',    窗体出现的动画效果           默认fadeAndPop    可不填
                animationspeed: 300,                    动画间隔时间                 默认300毫秒       可不填
                closeonbgclick: true,                   单机背景蒙板是否关闭         默认开启          可不填
                modalbg:true,                           是否关闭蒙板                 默认关闭          可不填
                modalclass: 'close-reveal-modal',       给指定的对象添加关闭事件     无                可不填
                closetime:0                             自动关闭时间，0/毫秒不关闭   默认为0           可不填
               *drag:false,                             拖拽                         默认false         可不填
               *follow:false,                           跟随激活控件                 默认false         可不填 
                content：                               可添加模板内容，格式“url:/a/temp.html”  “iframe(255):/a/temp.html” 注意：iframe(高度)
                size: '520x555',                         窗口大小                     默认0x0          可不填   
                callbutton:function (mbox[当前窗口对象]) { } 给窗体内出现的按钮添加事件
            }
        */
        yb_reveal: function (options) {
            var defaults = {
                animation: 'fadeAndPop',
                animationspeed: 300,
                closeonbgclick: true,
                modalbg: true,
                drag: false,
                follow: false,
                closetime: 0,
                modalclass: '',
                size: '0,0',
                callbutton: function (mbox) {
                    if (this.value.replace(/ /ig, '') == '取消') {
                        mbox.trigger('reveal:close');
                    }
                }
            };
            var options = $.extend({}, defaults, options);

            return this.each(function () {
                var modal = $(this),
                    topOffset = modal.height(),
                    locked = false,
                    modalBG = $('');

                if ($('.reveal-modal-bg').length == 0 && options.modalbg)
                    modalBG = $("<div class='reveal-modal-bg' />").insertBefore(modal);//蒙板

                if (options.modalbg) {
                    modalBG = $('.reveal-modal-bg');
                }

                if (/\d+%?,\d+%?/ig.test(options.size)) {
                    var wh = options.size.split(',');
                    var whw = { width: $(window).width(), height: $(window).height() };
                    if (/%/ig.test(wh[0])) {
                        wh[0] = whw.width / 100 * parseInt(wh[0]);
                    }
                    if (/%/ig.test(wh[1])) {
                        wh[1] = whw.height / 100 * parseInt(wh[1]);
                    }
                    if (wh[0] > 0) {
                        modal.width(wh[0]);
                    }
                    if (wh[1] > 0) {
                        modal.height(wh[1]);
                    }
                }

                if (!options.follow) {
                    /*
                    弹窗左右居中
                    add by 李想
                    */
                    modal.offset({ "left": ($(window).width() - modal.width()) / 2 });
                }

                modal.bind("reveal:open", function () {
                    if (!locked) {

                        var mbgmun = modalBG.data('mbgmun');
                        if ((mbgmun || 0) == 0) {
                            modalBG.data('mbgmun', 1);
                        } else {
                            modalBG.data('mbgmun', mbgmun + 1);
                        }


                        locked = true;
                        var scrollTop = $(document).scrollTop(),
                            top = scrollTop + (($(window).height() - modal.outerHeight()) / 2);

                        switch (options.animation) {
                            case "fadeAndPop": // 从上直下显示
                                modal.css({ 'top': (top - scrollTop), 'opacity': 0, 'visibility': 'visible', 'z-index': '9999' });
                                modalBG.show().animate({ 'opacity': 0.5 }, options.animationspeed / 2);
                                modal.animate({ 'top': top, 'opacity': 1 }, options.animationspeed, function () {
                                    locked = false;
                                });

                                break;
                            case "fade":
                                modal.css({ 'top': top, 'opacity': 0, 'visibility': 'visible', 'z-index': '9999' });
                                modalBG.show().animate({ 'opacity': 0.5 }, options.animationspeed / 2);
                                modal.animate({ 'top': top, 'opacity': 1 }, options.animationspeed, function () {
                                    locked = false;
                                });

                                break;
                            case "none":
                                modal.css({ 'top': top, 'visibility': 'visible', 'z-index': '9999' });
                                modalBG.css({ 'display': 'block' });
                                locked = false;
                                break;
                            default:
                                modal.css({ 'visibility': 'visible', 'z-index': '9999' });
                                modalBG.show().css({ 'display': 'block' });
                                locked = false;
                                break;
                        }
                        modal.unbind('reveal:open');
                    }
                });

                modal.bind('reveal:close', function () {
                    var mbgmum = modalBG.data('mbgmun');

                    var top = $(document).scrollTop() + (($(window).height() - modal.outerHeight()) / 2);

                    if (!locked) {
                        locked = true;
                        switch (options.animation) {
                            case "fadeAndPop": // 从上直下显示
                                if (mbgmum == 1) modalBG.animate({ 'opacity': 0 }, options.animationspeed / 2, function () { modalBG.hide(); });
                                modal.animate({ 'top': 0, 'opacity': 0 }, options.animationspeed / 2, function () {
                                    modal.css({ 'opacity': 1, 'visibility': 'hidden' });
                                    locked = false;
                                });
                                break;
                            case "fade":
                                if (mbgmum == 1) modalBG.animate({ 'opacity': 0 }, options.animationspeed / 2, function () { modalBG.hide(); });
                                modal.animate({ 'opacity': 0 }, options.animationspeed / 2, function () {
                                    modal.css({ 'opacity': 1, 'visibility': 'hidden' });
                                    locked = false;
                                });
                                break;
                            default:
                            case "none":
                                modal.css({ 'visibility': 'hidden' });
                                if (mbgmum == 1) modalBG.css({ 'display': 'none' });
                                locked = false;
                                break;
                        }

                        modal.unbind("reveal:close");
                        if (modal.data('ismodal') != true) modal.remove();

                        mbgmum -= 1;
                        modalBG.data('mbgmun', mbgmum);
                        $(options.former).data('look', false);
                    }
                });

                modal.trigger('reveal:open');

                modal.find('input:button').unbind('click').click(function () {
                    options.callbutton.call(this, modal, options.former);
                });

                if (options.closeonbgclick) {
                    modalBG.click(function () {
                        modal.trigger('reveal:close');
                    });
                }

                if (options.modalclass != '') {
                    options.modalclass = ',.' + options.modalclass;
                }
                $('.close-reveal-modal' + options.modalclass, modal).click(function (e) {
                    e.preventDefault();
                    modal.trigger('reveal:close');

                });

                $('body').keyup(function (e) {
                    if ((e.keyCode || e.which) == 27) {
                        modal.trigger('reveal:close');
                        $('body').unbind('keyup');
                    }
                });

                if (options.closetime > 0) {
                    setTimeout(function () {
                        modal.trigger('reveal:close');
                    }, options.closetime);
                }
            });
        },//reveal 结束



        /*
            重绘Select
            $("SELECT").yb_drawSelect();
        */
        yb_drawSelect: function () {

            $(this).each(function () {
                var $this = $(this), h = 330, oplg = $this.find("option").length;
                var ulh = oplg > 15 ? h : oplg * 22,
                    ttop = $this.offset().top + ulh;


                if (oplg == 0) return;
                $this.hide(); //隐藏本身
                var width = $this.width();
                if (width == 0) width = 100;

                var DIV = $("<div>", { 'class': $this.attr("newclass") || 'YB_SELECT' }).css('width', width),
                    INPUT = $("<span/>").css('width', width - 25),
                    UL = $("<ul>"), tOut;

                if (ttop > $(document).height()) {
                    UL.css('top', -0 - (ulh + 2));
                }

                UL.width(width);
                //创建选项
                $this.find("option").each(function () {
                    var $$this = $(this);
                    //新增：specialIcon特殊标签判断，可自行添加到li的html代码中，适应图标样式  BY SMILE 2013.06.07
                    $("<li>", { 'id': $$this.val() || $$this.html(), 'html': ($this.attr("specialIcon") || "") + $$this.html() }).click(function () {

                        var val = $(this).attr("id"),
                            //婷姐--注释原因：因为加了$this.attr("specialIcon")这个，导致li本身的html有可能带有特殊标签，所以此处txt值取原html值  BY SMILE 2013.06.07  注释行：txt = $(this).html();
                            //txt = $(this).html();
                            txt = $$this.html();

                        INPUT.html(txt);
                        UL.hide();
                        if ($this.find("option:selected").html() == txt) return false;

                        $this.find("option").removeAttr("selected");
                        if (val) {
                            $this.find("option[value='" + val + "']").attr("selected", true);
                        } else {
                            $this.find(":contains('" + txt + "')").attr("selected", true);
                        }

                        //将控件的onclick 附加到当前控件中  修改 20130610 
                        //var fn = $this.attr("onclick");
                        //if (fn) Function($this.attr("onclick")).call($(this));

                        $this.triggerHandler("change");

                        return false;
                    }).appendTo(UL)
                });
                if (oplg > 15) UL.css("height", h);
                INPUT.html($this.find("option:selected").html() || $this.find("option:eq(0)").html());
                INPUT.appendTo(DIV);
                UL.appendTo(DIV);
                INPUT.focus(function () { UL.hide(); return false; });
                //展开选择项
                DIV.click(function () {
                    clearTimeout(tOut);
                    UL.css({ 'z-index': parseInt(UL.css("z-index")) + 1 }).show();
                    return false;
                }).hover(function () {
                    clearTimeout(tOut);
                }, function () {
                    tOut = setTimeout(function () { UL.hide(); }, 500);
                    return false;
                });
                $this.after(DIV);
            });

        },


        /*
            重绘Select
            $("SELECT").yb_drawSelect();
        */
        yb_drawSelectEdit: function () {

            return this.each(function () {
                var $this = $(this), h = 330, oplg = $this.find("option").length;
                var ulh = oplg > 15 ? h : oplg * 22,
                    ttop = $this.offset().top + ulh;

                //把之前绑定的删除掉
                if ($this.next().hasClass("YB_SELECTedit")) {
                    $this.next(".YB_SELECTedit").remove();
                }


                // if (oplg == 0) return;
                $this.hide(); //隐藏本身
                var width = $this.width();
                if (width < 50) width = 100;


                var DIV = $("<div>", { 'class': $this.attr("newclass") || 'YB_SELECTedit' }).css('width', width).click(function () {
                    if ($this.find('option').size() <= 0) {
                        DIV.find("ul").css({ "border": "none" }).removeClass("havaData")
                    }
                }),
                    //.append("<b></b>")
                    INPUT = $("<input type='text' value='输入或选择' style='border:none' />").css({ 'width': width - 25, 'opacity': 0.5 })
                    .click(function () {
                        $(this)[0].select()
                        if ($(this).val() == "输入或选择") {
                            $(this).css({ opacity: 1 }).val('');
                            return;
                        }

                    })
                    .change(function () {
                        if ($(this).val() == "") {
                            $(this).css({ opacity: .5 }).val('输入或选择');
                            return;
                        }
                        $this.find("option").removeAttr("selected");
                        if ($this.find("option").last().attr('isCreate')) {
                            $this.find("option").last().val($(this).val());
                            $this.find("option").last().html($(this).val())
                        }
                        else {
                            $this.append("<option  isCreate=true selected=true value=" + $(this).val() + ">" + $(this).val() + "</option>")
                        }
                        $this.triggerHandler("change");
                    }).keyup(function () {
                        //////选
                        //DIV.find("ul li").each(function () {
                        //    if ($(this).text().indexOf(INPUT.val()) < 0) {
                        //        $(this).hide();
                        //    }
                        //    else {
                        //        $(this).show();
                        //    }
                        //})
                    })
                    .blur(function () {
                        if (INPUT.val() == "") {
                            INPUT.css({ opacity: .5 }).val('输入或选择');
                        }
                    })
                    ,
                    UL = $("<ul>"), tOut;

                if ($this.find('option').size() > 0) {
                    DIV.append('<b></b>');
                    UL.width(width);

                }
                else {
                    INPUT.css('width', '96%');

                }



                //创建选项
                $this.find("option").each(function () {
                    var $$this = $(this);
                    //新增：specialIcon特殊标签判断，可自行添加到li的html代码中，适应图标样式  BY SMILE 2013.06.07
                    $("<li>", { 'id': $$this.val() || $$this.html(), 'html': ($this.attr("specialIcon") || "") + $$this.html() }).click(function () {

                        //var val = $(this).attr("id"),
                        var val = $(this)[0].getAttribute("id");
                        //婷姐--注释原因：因为加了$this.attr("specialIcon")这个，导致li本身的html有可能带有特殊标签，所以此处txt值取原html值  BY SMILE 2013.06.07  注释行：txt = $(this).html();
                        //txt = $(this).html();
                        txt = $$this.html();

                        INPUT.val(txt);
                        UL.hide();
                        if ($this.find("option:selected").val() == txt) return false;

                        $this.find("option").removeAttr("selected");
                        if (val) {
                            $this.find("option[value='" + val + "']").attr("selected", true);
                        } else {
                            $this.find(":contains('" + txt + "')").attr("selected", true);
                        }

                        //将控件的onclick 附加到当前控件中  修改 20130610 
                        //var fn = $this.attr("onclick");
                        //if (fn) Function($this.attr("onclick")).call($(this));

                        $this.triggerHandler("change");

                        return false;
                    }).appendTo(UL)
                });
                if (oplg > 15) UL.css("height", h);
                if ($this.find("option").size() > 0) {
                    INPUT.val($this.find("option:selected").html() || $this.find("option:eq(0)").html());
                }
                INPUT.appendTo(DIV);
                UL.appendTo(DIV);
                INPUT.focus(function () {
                    UL.hide();
                    return false;
                });
                //展开选择项
                DIV.click(function () {
                    clearTimeout(tOut);
                    UL.css({ 'z-index': parseInt(UL.css("z-index")) + 1 }).show();
                    /*得到控件的位置*/
                    var thisTop = $(this).position().top;
                    var thisLeft = $(this).position().left;
                    // if (ttop > $(document).height()) {
                    UL.css({ 'top': thisTop + 25, 'left': thisLeft });
                    // }

                    return false;
                }).hover(function () {
                    clearTimeout(tOut);
                }, function () {
                    UL.hide();
                    //if (INPUT.val() == "") {
                    //    INPUT.css({ opacity: .5 }).val('请输入或选择');
                    //}
                    return false;
                });
                $this.after(DIV);


            });

        },

        /*
            数据绑定

            $("#拉取数据后绑定的位置").yb_DataSource({
                url: '/AjaxConnonHandler.ashx?page=1&size=168',       //数据来源，地址中page=1&size=168 两个参数必须存在。必须填
                data: $("#a,#b,.c"),                                  //提交数据。 [ $("#a,#b,.c") | #a,#b,.c ]  默认为空  可不填
                tmpl: '#模板ID',                                      //模板名称。必须填
                pagin: '#分页ID',                                     //分页控件位置。必须填 
                callback: function (a) { 
                      // this = 当前表单
                      // a = 后台返回数据集对象
                },
                error: function () { }
            });



             @options = {
                url: 'ajax.aspx',           //数据来源，必须填
                data: '',                   //提交数据。 [ $("#a,#b,.c") | #a,#b,.c ]  默认为空  可不填
                tmpl: '',                   //模板名称，          必须填
                pagin: '',                  //分页控件位置，      可不填
                callback: function (a) {
                      // this = 当前表单
                      // a = 后台返回数据集对象
                },   //绑定成功后执行函数，  可不填
                error: function () {}       //错误执行函数， 可不填
            };
        */
        yb_DataSource: function (options, mark) {
            if (mark !== true) {
                $.MarkNext = [];
                $.Mark.push({ self: this, option: options, idx: $.Mark.length });
            }
            var $this = this;
            $.yb_wait();
            var defaults = {
                url: '/AjaxConnonHandler.ashx?page=1&size=168',
                data: '',
                tmpl: '',       //模板名称
                pagin: '',      //分页控件位置
                callback: function () { },
                error: function () { }
            };

            var options = $.extend({}, defaults, $.extend({}, $(this).data(), options));
            var pam = $.yb_SerializeURL2Json(options.url);


            if (options.data == '') {
                options.data = this;
            }

            if (typeof options.data === 'string' && (options.data.charAt(0) == '#' || options.data.charAt(0) == '.')) {
                options.data = $(options.data);
            }

            if (typeof options.data === 'object') {
                var data = [];
                $(options.data).each(function () {
                    //if (this.childElementCount > 0) {
                    if (this.children == undefined) return;
                    if (this.children.length > 0) {
                        $.merge(data, $("input,select,textarea", this));
                    } else {
                        $.merge(data, $(this));
                    }
                });

                options.data = $(data).serialize();
            }

            //if (typeof options.data === 'string' && (options.data.indexOf('#') > -1 || options.data.indexOf('.') > -1)) {
            //    options.data = $(options.data);
            //    if (options.data.get(0).childElementCount > 0) {
            //        options.data = options.data.find("input,select,textarea").serialize();
            //    }
            //}

            $.ajax({
                url: options.url,
                type: 'POST',
                data: options.data
            })
            .done(function (jsonData) {
                $this.empty();
                if (!jsonData || jsonData == '' || !jsonData[0]) {
                    options.callback.call($this, null);
                    $.yb_wait("无数据呈现！", 2).hide();;
                    return;
                }
                var DATA = jsonData[0].data || '',
                  Count = jsonData[0].rcount;
                if (!DATA) {
                    //$.yb_wait("无数据呈现", 3).hide();
                    return;
                }
                if (DATA.length > 20) {
                    var dl = DATA.length,
                       // c = dl % 20 == 0 ? parseInt(dl / 20) : parseInt(dl / 20) + 1,
                        //c = Math.ceil(parseInt(dl / 20));
                        c = Math.ceil(dl / 20),
                        d = 1;

                    var tempData = $.grep(DATA, function (n, i) { return i >= (d - 1) * 20 && i <= d * 20; });
                    $this.append($(options.tmpl).render(tempData));
                    $('select:not(:hidden)', $this).yb_drawSelect();

                    //$.yb_wait("数据已呈现", 1).hide();  
                    $.yb_wait().hide();
                    d++;
                    setTimeout(function () {
                        for (; d <= c; d++) {
                            var tempData = $.grep(DATA, function (n, i) { return i > (d - 1) * 20 && i <= d * 20; });
                            var _html = $(options.tmpl).render(tempData);
                            $this.append(_html);
                            $('select', _html).yb_drawSelect();
                        }
                    }, 200);
                } else {
                    $this.append($(options.tmpl).render(DATA));    //绑定数据 
                    ///$.yb_wait("数据已呈现", 1).hide();
                    $.yb_wait().hide();
                    $('select:not(:hidden)', $this).yb_drawSelect();
                }
                $(window).trigger("resize");
                options.callback.call($this, jsonData);
                if (options.GO) {
                    $(options.pagin).removeData('look').empty();
                    delete options.GO;
                }


                //自动编号
                $(this).yb_autoNnumber({ isserial: options.isserial, currPage: (this.current || pam.page), PageLength: pam.size || 20 });

                if (options.pagin && $(options.pagin).length > 0) {
                    $(options.pagin).yb_Pagination({
                        count: Count,
                        current: options.current,
                        size: pam.size || 20,
                        callback: function () {
                            var url = options.url;
                            var ops = $.extend({}, options, { url: url.replace(/page=\d+/ig, 'page=' + (this.current || pam.page)) });// options.url = options.url.replace(/page=\d+/ig, 'page=' + (this.current || pam.page));
                            $($this).yb_DataSource(ops);
                        }
                    });


                    if (options.GO) {
                        $(options.pagin).data('look', false);
                    }
                }
            })
            .fail(function () {
                options.error();
                $.yb_wait().hide();
            })
        },

        /*
            分页控件
                @options = {
                current: 1, //当前页
                count: 0,   //总条数
                size:20,    //每页显示数据
                callback: function () {  }
            };
            例：
                1. $("#Pagination").yb_Pagination(options); 
                2. <div class="ybPaginate"  id="page3" data-count='158000' data-size="168" data-current="5"></div>
        */
        yb_Pagination: function (options) {
            var defaults = {
                current: 1,
                count: 0,
                size: 20,
                callback: function () { },
                redraw: false
            };

            var options = $.extend({}, defaults, $.extend({}, options, $(this).data()));

            var countPage = options.count % options.size == 0 ?
                options.count / options.size :
                parseInt(options.count / options.size) + 1;


            var CreateA = function (c) {
                DIV.empty();
                if (c == undefined) c = 0;

                if (countPage < c)
                    c = countPage;

                var beg = 1, end = 1;
                if (c > 10) {
                    beg = c - 10;
                }

                if (c + 10 > countPage) {
                    end = countPage;
                } else {
                    end = c + 10;
                }

                if (end < 10) end = 20;

                for (var i = beg; i <= end ; i++) {
                    var op = i > countPage ? {
                        href: 'javascript:void(0);',
                        html: i,
                        'style': 'color:#aaa; border-color:#aaa;'
                    } : {
                        href: 'javascript:void(0);',
                        html: i, click: function () {
                            DIV.temp = options.current;
                            options.current = parseInt($(this).html());
                            animation.call(options);
                            options.callback.call(options);
                        }
                    };

                    DIV.append($('<a/>', op).attr('t', i));
                }
            }

            var animation = function () {

                var index = (this.current || 1);

                CreateA(index);

                INFO.html('共' + options.count + '条 每页' + options.size + '条 当前第' + options.current + '页 共' + countPage + '页');

                var $this = DIV.find("a[t='" + index + "']").addClass('ybPag-current'),
                    $div = $this.parents('.ybPag-center'),
                    Df = Math.abs(parseInt(DIV.css('left'))),
                    Lf = $this.offset().left + Df - $div.offset().left;

                Lf -= $div.width() / 2;

                if (Lf + $div.width() > DIV.width())
                    Lf = DIV.width() - $div.width();

                if (Lf < 0) Lf = 0;  //

                //还原上次位置，否则无动画效果
                var $temp = DIV.find("a[t='" + DIV.temp + "']");
                if ($temp.length > 0 && DIV.temp > 5) {
                    var t = $temp.offset().left + Df - $div.offset().left - $div.width() / 2;
                    if (t + $div.width() > DIV.width())
                        t = DIV.width() - $div.width();

                    DIV.css({ "left": 0 - t });
                }

                DIV.stop().animate({ "left": 0 - Lf }, 'fast');

            }

            //if (options.redraw) {
            //    $(this).removeData('look');
            //    $(this).empty();
            //    options.redraw = false;
            //}

            // var DIV, INFO;
            if (options.look == undefined) {
                $(this).data('look', false);

                var INFO = $("<div>", { 'class': 'ybPag-info', style: 'float:right' });
                //.html('共' + options.count + '条 每页' + options.size + '条 当前第' + options.current + '页 共' + countPage + '页');;
                INFO.appendTo(this);

                var First = $("<a>", {
                    href: 'javascript:void(0);', 'class': 'first_last',
                    html: '首   页', click: function () {
                        DIV.temp = options.current;
                        options.current = 1
                        animation.call(options);
                        options.callback.call(options);
                    }
                });

                var First_1 = $("<a>", {
                    href: 'javascript:void(0);', 'class': 'up_down',
                    html: '上一页', click: function () {
                        DIV.temp = options.current;
                        if (options.current > 1) {
                            options.current -= 1;
                        }
                        animation.call(options);
                        options.callback.call(options);
                    }
                });

                $("<div>", { 'class': 'ybPag-back' }).append(First).append(First_1).appendTo(this);

                var DIV = $('<div id="index_item"/>');
                DIV.find('a:eq(' + options.current + ')').addClass('ybPag-current');

                $("<div>", { 'class': 'ybPag-center' }).append(DIV).appendTo(this);

                var Last = $("<a>", {
                    href: 'javascript:void(0);', 'class': 'up_down',
                    html: '下一页', click: function () {
                        DIV.temp = options.current;
                        if (options.current < countPage) {
                            options.current += 1;
                        }
                        animation.call(options);
                        options.callback.call(options);
                    }
                });

                var Last_1 = $("<a>", {
                    href: 'javascript:void(0);', 'class': 'first_last',
                    html: '末   页', click: function () {
                        DIV.temp = options.current;
                        options.current = countPage
                        animation.call(options);
                        options.callback.call(options);
                    }
                });


                $("<div>", { 'class': 'ybPag-front' }).append(Last).append(Last_1).appendTo(this);

                var GO = $("<div/>", { html: '转到', 'class': 'page_goto' });
                var INPUT = $("<input/>", { type: 'text', 'class': 'page_text' }).yb_enter(function () {
                    button.trigger('click');
                    return false;
                }).appendTo(GO);

                GO.append("页")

                var button = $("<input/>", { type: 'button', 'class': 'page_deter', value: '确定' }).click(function () {
                    var val = parseInt(INPUT.val());
                    if (/^\d+$/ig.test(val)) {
                        if (val >= 1 && val <= countPage) {
                            options.current = val;
                            animation.call(options);
                            options.callback.call(options);
                            DIV.temp = val;
                        }
                        else {
                            //$(INPUT).yb_gips({ outtrigger: 1500, content: '不存在的页码！' });
                            alert("不存在的页码!");
                        }
                        //$.yb_wait("不存在的页码！").hide(1000);
                    } else {
                        //(INPUT).yb_gips({ outtrigger: 1500, content: '请输入正确的数字页码！' });
                        alert("请输入正确的数字页码!");
                        //$.yb_wait("请输入正确的数字页码！").hide(1000);
                    }
                    INPUT.select();
                    return false;
                });

                GO.append(button).appendTo(this);

                animation.call(options);
            }


            return this;
        },

        /*
            泡泡提示
            @options={
                trigger:'',          //激活提示事件。（隐藏属性）
                outtrigger: 'blur',  //激活删除事件,可设置消失事件
                place: 'top',        //提示方向 
                content: ''          //提示内容，当content无设置参数时。 自动获取其他内容次序为 content | input.val() | 标签.html() 
            }
            允许将options直接设置为提示文字，如 $('').yb_gips("设置提示文字")
        */
        yb_gips: function (options) {
            var defaults = {
                // trigger:'',       //隐藏属性，激活提示事件
                outtrigger: 'blur',  //激活删除事件 ，可设置消失事件
                place: 'top',        //提示方向 
                content: ''          //提示内容，当content无设置参数时。 自动获取其他内容次序为 content | input.val() | 标签.html() 
            };


            var $this = $(this), isopStr = false;
            var toolTip = $("<div class='ybgips-container'><div class='ybgips-body'></div><div class='ybgips-icon'></div></div>");

            if (typeof options == 'string') {
                isopStr = true;
                options = { content: options };

                if (!$this.is("input")) {
                    options.outtrigger = 3000;
                }
            }


            var toolTipBody = $('.ybgips-body', toolTip),
                toolTipIcon = $('.ybgips-icon', toolTip);

            options = $.extend({}, defaults, options || $this.data());


            $this.bind("gips:open", function () {

                if (window.cleargips) clearTimeout(cleargips);
                $('.ybgips-container').remove();


                if (options.content == '') {
                    options.content = $(this).val() || $(this).html();
                    //options.content = options.content.replace(/\<[^>]\>/ig, '');
                }
                toolTipIcon.addClass(' ybgips-icon-' + options.place);

                // $this.offsetParent().after(toolTip);

                // if ($this.parent().css("position") == "static") {

                //  }

                $this.after(toolTip);
                //$this.parent().css("position", "relative");
                var scrolHeight = $this.parent().scrollTop();

                //$("body").append(toolTip);
                toolTipBody.html(options.content);

                var pn = $(this).offset();
                var L = pn.left,
                    T = pn.top,


                    LL = $this.position().left - 6,
                    TT = $this.position().top - 6 + scrolHeight;
                //         LL = L
                //TT = T;


                switch (options.place) {
                    case 'top':
                        TT -= toolTip.outerHeight();
                        toolTipIcon.css('top', toolTip.height());
                        toolTip.css({ opacity: 0, left: LL, top: TT - 20 });
                        break;
                    case 'bottom':
                        TT += toolTip.outerHeight();
                        toolTipIcon.css('top', -toolTipIcon.outerHeight());
                        toolTip.css({ opacity: 0, left: LL, top: TT + 20 });
                        break;
                    case 'left':
                        LL -= $this.width();
                        // LL -= toolTip.width();
                        toolTipBody.css({ 'float': 'left' });
                        toolTipIcon.css({ 'left': toolTip.outerWidth() - 1 });
                        toolTip.css({ opacity: 0, left: LL - 20, top: TT });
                        break;
                    default: case 'right':
                        LL += $this.outerWidth();
                        //LL += toolTip.width();
                        toolTipBody.css({ 'left': toolTipIcon.outerHeight(), 'float': 'left' });
                        toolTipIcon.css('left', 0);
                        toolTip.css({ opacity: 0, left: LL + 20, top: TT });
                        break;
                }

                toolTip.show().animate({ opacity: 1, left: LL, top: TT }, 300);//, left: L, top: T 

                if (typeof options.outtrigger == 'number') {
                    cleargips = setTimeout(function () { $this.trigger("gips:close"); }, options.outtrigger);
                }
            });

            $this.bind("gips:close", function () { toolTip.fadeOut("slow", function () { toolTip.remove(); }); });

            if (options.trigger === undefined) {
                $this.trigger("gips:open");
                //setTimeout(function () { $this.trigger("gips:close"); }, options.outtrigger || 1500);
            }
            else {
                $this.bind(options.trigger, function () {
                    $this.trigger("gips:open");
                });
            }

            if (typeof options.outtrigger == 'string') {
                $this.bind(options.outtrigger, function () {
                    $this.trigger("gips:close");
                });
            }

            return $this;

        },

        /*
           同步外部滚动条
        */
        yb_scrollSync: function (w) {
            $(this).scroll(function () {
                var $h = (this.scrollHeight - ($(this).outerHeight() - $(this).height()));

                var winTop = $(w || window).scrollTop() + $(w || window).height(),
                wh = $(w || "body").height();
                if (winTop != wh) $(w || 'html, body').animate({ scrollTop: wh }, 100);
                //if (winTop != wh) {
                //    if (w)
                //        $(w).animate({ scrollTop: wh }, "fast");
                //    else
                //        $(window).scrollTop(wh);
                //}

            });
        },
        /*
        作者：周魏
        验证控件
        @options={
            rg:'',                      //验证类型，支持正则表达式。固定验证类别【counts|name|tel|pw|email】
            fun: function () { return false; }          //验证函数（同rg二者择一）
            content:
        }
        */
        yb_verify: function (options) {
            var defaults = {
                rg: '',
                fun: function () { return false; },
                content: ''
            };
            options = $.extend({}, defaults, $.extend(options || {}, $(this).data()));

            switch ($.trim(options.rg)) {
                case 'counts':
                    options.rg = "^(10000|(?!0)\\d{1,4})$";
                    break;
                case 'name':
                    options.rg = "^[a-zA-Z0-9]{6,12}$";
                    break;
                case 'tel':
                    options.rg = "^1[3,5,8][0-9]{9}$";
                    break;
                case 'pw':
                    options.rg = "^.{6,18}$";
                    break;
                case 'email':
                    options.rg = "^([a-z0-9_\\.-]+)@([a-z\d\.-]+)\.([a-z\.]{2,6})$";
                    break;
                case '':
                    options.rg = '.*';
                    break;
            }

            var re = new RegExp(options.rg, 'ig');
            if (!re.test($(this).val()) || options.fun.call(this)) {  //匹配不通过 
                $(this).yb_gips(options);//{ place: op.place, content: op.content }
                $(this).focus();
                $(this).select();
                return false;
            }
            return true;
        },
        /*
            作者：张胜
            tab层切换
            options={
                tabslideId:    //对应的隐藏层ID
                name:       //同一切换组的名称
                className:  //当前切换标签样式
                callbark: function () { } //切换后执行操作
            };
        
           实例:
             $(this).yb_slide({ 
                    callbark: function () {
                        alert(1);
                    }
                });
        */
        yb_slide: function (options) {
            options = $.extend({}, $.extend({}, options, $(this).data() || {}));
            var modeclass = options.tabslideId;// 获得自定义属性的值

            var $this = $("[name='" + options.name + "']:visible");
            var thId = $this.attr("id");
            var modeElement = $("#" + modeclass);
            switch (modeElement.attr("impact")) { // 判断执行效果
                case "slide":
                    if (thId != modeclass) {
                        $this.slideUp(600);

                    }
                    modeElement.stop(true, true).slideToggle(600);
                    break;
                default:
                    $this.hide();

                    modeElement.toggle();
                    break;
            }
            $('.' + options.className).removeClass(options.className);// 删除本来制定了这个class的元素的class

            //给指定元素换字
            var $thisArray = $("[data-toggle-text]");
            var thName = $(this).data("name");//获取该组的dataname
            for (var i = 0; i <= $thisArray.length; i++) {
                var $hides = $("[data-toggle-text]:eq(" + i + ")");
                var $hidestext = $hides.data("toggletext");
                if ($hidestext != undefined && $hides.data().tabslideId != modeclass && $hides.data("name") == thName) {
                    if ($hides.is("input") && $hides.val() == $hides.data().toggleText) {
                        var $hidesval = $hides.val();
                        $hides.val($hidestext);
                        $hides.data("toggletext", $hidesval);
                    } else if ($hides.text() == $hides.data().toggleText && $hides.data("name") == thName) {
                        var $hidesval = $hides.text();
                        $hides.text($hidestext);
                        $hides.data("toggletext", $hidesval);
                    }
                }
            }

            var togtext = options.toggleText;
            if ($(this).attr("click") == undefined) {//防止单击同一元素重复变化字体
                $("[click]").removeAttr("click");
                if (togtext != undefined) {
                    if ($(this).data("toggletext") == undefined) {
                        $(this).data("toggletext", togtext);
                    }

                    if ($(this).is("input")) {
                        var yuan = $(this).val();
                        $(this).val($(this).data("toggletext"));
                        $(this).data("toggletext", yuan);
                    } else {
                        var yuan = $(this).text();
                        $(this).text($(this).data("toggletext"));
                        $(this).data("toggletext", yuan);
                    }
                    if (modeElement.attr("impact") != "slide") {
                        $(this).attr("click", "true");
                    }


                }

            }
            $(this).addClass(options.className);// 给单击元素添加指定的class
        },

        yb_showhideli: function () {
            $this = $(this);
            var control = $this.data().controlId;//获得需要控制的className
            var togClass = $this.data().thisClass;
            ($this.data().thisClass != undefined) ? $this.toggleClass(togClass) : "";
            $("#" + control).toggle();
        },
        /*
            数据提交
            m:目标大类
            c:目标小类
            d:外部数据，支持url字符串，筛选器，对象 
            callback：匿名函数，成功后提交执行。
            cache: 缓存
             
             $("#btnDel").click(function () { 
            
                     $("提交的表单").yb_londData(1, 4, "CGURGUID=我是参数", function (a) {
                         // this = 当前表单
                         // a = 后台返回数据集对象
                     });
               
             })
        */
        yb_londData: function (m, c, d, callback, cache) {
            $(this).yb_load(m, c, d, callback, cache, true);
        },
        yb_load: function (m, c, d, callback, cache, iswait) {

            if (cache) cache = true;
            var that = $(this);
            var $this = this, isVerify = true;
            var $data = $this.data() || { formId: Math.random() };

            if ($.isPlainObject($data) && $data.m != undefined && $data.c != undefined) {
                m = $data.m;
                c = $data.c;
                d = $data.d;
            }

            if (typeof callback === 'boolean') {
                cache = callback;
            }

            if ($.isFunction(d)) {
                callback = d;
                d = '';
            }


            var defaults = {
                url: '/AjaxConnonHandler.ashx?maintype=' + m + '&childtype=' + c + (cache ? '' : '&' + Math.random()),
                data: '',
                dataType: 'json',
                type: "post",
                //beforeSend: function () {
                //    that.attr('disabled', 'disabled');
                //},
                success: function (jsdata) { //所有返回结构为{code:0,msg:'',data:{}}
                    if (!jsdata || jsdata == '' || !jsdata[0]) {
                        if ($.isFunction(callback)) {
                            callback.call($this, null);
                        }
                        if (iswait) {
                            $.yb_wait("无数据呈现", 3).hide(1000);
                        }
                        return;
                    }

                    $this.removeAttr('disabled');
                    jsdata = jsdata[0];
                    if (jsdata.code == 0) {
                        if ($.isPlainObject(jsdata.data) || $.isArray(jsdata.data) || !$data) {
                            $($data.temp).render(jsdata.data).appendTo($data.source);
                            $($data.show).show();
                            $($data.hide).hide();
                        }
                        if ((jsdata.msg != null || $.trim(jsdata.msg) != '') && iswait) {
                            $.yb_wait(jsdata.msg, 0).hide(1000);
                        }
                        if ($.isFunction(callback)) {
                            callback.call($this, jsdata.data);
                        }

                    } else {
                        if (iswait) {
                            $.yb_wait(jsdata.msg, 2).hide(1000);
                        }
                    }
                },
                error: function (x, t, e) {
                    //  setTimeout(function () {王宇峰9：30
                    $this.removeAttr('disabled');
                    if (iswait) {
                        $.yb_wait("错误：" + (e || '我努力也没用，因为它出错了！！！'), 2).hide(1500);
                    }
                }
            };


            var FORM = $('#' + $data.formId);
            if (FORM.length == 0) {
                FORM = $this;
            }

            FORM.find("[data-verify-id]").each(function () {
                if (!$(this).yb_verify()) {
                    return isVerify = false;
                }
            });

            if (!isVerify) return false;

            if (iswait) { $.yb_wait(); }

            var options = $.extend({}, true, defaults, options || FORM.data(), d);

            if (FORM.is('form')) {
                FORM.submit(function () { return false; });
                var action = FORM.attr('action');
                if (action) {
                    options.url = action;
                }
                options.data = FORM.serialize();
            } else {
                if (options.data == '') {
                    options.data = this;
                }

                if (typeof options.data === 'string' && (options.data.charAt(0) == '#' || options.data.charAt(0) == '.')) {
                    options.data = $(options.data);
                }

                if (typeof options.data === 'object') {
                    var data = [];
                    $(options.data).each(function () {
                        if (this.children == undefined) return;
                        if (this.children.length > 0) {
                            $.merge(data, $("input,select,textarea", this));
                        } else {
                            $.merge(data, $(this));
                        }
                    });

                    options.data = $(data).serialize();
                }
            }

            if (d) {
                if (d.charAt(0) != '&') options.data += '&';
                options.data += d;
            }

            $.ajax(options);
        },
        //鼠标拖拽
        //例：$("绑定拖拽目标").Drag("要移动的目标。此处可以为空，当空时默认为绑定拖拽的目标");
        //drag:要移动的目标
        yb_drag: function (drag) {
            return $(this).mousedown(function (e) {
                var BODY = $('body'), zidx = BODY.data("zidx");
                if (!zidx) {
                    BODY.data("zidx", zidx = 999);
                }
                BODY.data("zidx", ++zidx);

                if (document.onselectstart) document.onselectstart = function () { return false; };

                var $this = $(drag || this).css({ 'z-index': zidx });
                var os = $this.offset(),
                    md = { x: e.clientX - os.left, y: e.clientY - os.top };

                //创建影子
                var shadow = $("<div>", { 'style': 'position:absolute;background: #43A7FD;z-index:99999;cursor:move;', width: $this.width(), height: $this.height() }).offset($this.offset()).fadeTo(20, 0.3);

                shadow.mouseup(function () {
                    $(document).unbind("mousemove");
                    if (document.onselectstart) document.onselectstart = function () { return true; }
                    $this.css({ 'position': 'absolute' }).css($(this).offset());
                    $(this).remove();
                });

                $(document).mousemove(function (em) {

                    var lt = { left: em.clientX - md.x, top: em.clientY - md.y },
                       wh = { width: $(window).width() - $this.outerWidth(), height: $(document).height() - shadow.height() };
                    if (lt.left <= 0) lt.left = 0;
                    if (lt.top <= 0) lt.top = 0;
                    if (lt.left >= wh.width) lt.left = wh.width;
                    if (lt.top >= wh.height) lt.top = wh.height;

                    $(shadow).offset(lt);
                });

                shadow.appendTo('body');

            });
        },

        /*
        作者：李想
        日期:2013年9月1日
        下拉列表
        $(选择器).YbSelectSimu({
            Mode: "Auto",        //参数"Auto","Manual"  "Auto"为自动识别html元素模拟下拉，需要一定格式，  ”Manual“：为手动指定html元素模拟下拉
            EditMode: "Off",     //可编辑模式；还需完善
            Active: "click",     //参数"click" 预留
            Attribte: "value",   //可自定义多个属性取值 
            ValueBox: ".ValueBox",      //取值元素  Mode: "Manual" 下起作用
            MainBox: ".MainBox",        //显示元素  Mode: "Manual" 下起作用
            DownBox: ".DownBox",        //下拉效果容器元素  Mode: "Manual" 下起作用  
            DownListBox: ".DownListBox",   //下拉列表容器元素  Mode: "Manual" 下起作用  预留
            DownListBoxChild: ".DownListBoxChild"   //下拉列表元素  Mode: "Manual" 下起作用  
        });
        $("#xuSelect01").yb_SelectSimu();     //默认模式
        $("#xuSelect02").yb_SelectSimu({ Attribte: "value,value1,value2" });//自定义多个属性取值 
        $(".YbSelectSimu").yb_SelectSimu();   //多个同时调用
        $(".xuSelectManual").yb_SelectSimu({  //"Manual"  自定义模式
            Mode: "Manual",
            ValueBox: ".ValueBox",
            MainBox: ".MainBox",
            DownBox: ".DownBox",
            DownListBoxChild: "li"
        });
        */
        YbSelectSimu: function (options) {
            $(this).yb_selectSimu(options);
        }
        ,
        yb_selectSimu: function (options) {
            var defaults = {
                Mode: "Auto", EditMode: "Off", Active: "click", Attribte: "value", ValueBox: ".ValueBox", MainBox: ".MainBox", DownBox: ".DownBox", DownListBox: ".DownListBox", DownListBoxChild: ".DownListBoxChild"
            };
            var options = $.extend(defaults, options);
            var obj = $(this);
            var sMode = defaults.Mode;
            var sEditMode = defaults.EditMode;
            var sActive = defaults.Active;
            var aAttribte = defaults.Attribte.split(",");
            if (sMode == "Auto") {
                var nObjIndex;
                function fAutoDownListBoxClick() {
                    obj.eq(nObjIndex).children().last().children().unbind("click").click(function () {
                        for (i = 0; i < aAttribte.length; i++) {
                            $(this).parent().siblings("input").attr(aAttribte[i], this.getAttribute(aAttribte[i])); // $(this).attr(aAttribte[i])
                        };
                        $(this).parent().siblings().not("input").first().html($(this).html());
                    });
                };
                if (sActive == "click") {
                    obj.click(function () {
                        nObjIndex = obj.index(this);
                        $(this).children(":not(input):hidden").length > 0 ? $(this).children().not("input").last().show() : $(this).children().not("input").last().hide();
                        fAutoDownListBoxClick();
                    });
                    obj.mouseleave(function () {
                        $(this).children().not("input").last().hide();
                    });
                };
                if (sEditMode == "On") {
                    var sMainBoxHtml;
                    obj.eq(nObjIndex).children().not("input").first().click(function () {
                        $(this).attr({
                            "contenteditable": "true"
                        });
                        $(this).empty().focus();
                    });
                    obj.children().focus(function () { });
                    obj.children().blur(function () {
                        if ($.trim($(this).text()) == "") {
                            $(this).siblings().last().children().show();
                        };
                        $(this).attr("value", $(this).siblings().children().last(":visible").attr("value"));
                        $(this).html($(this).siblings().children().last(":visible").html());
                    });
                    obj.children().change(function () { });
                    obj.children().keyup(function () {
                        var sValue = $.trim($(this).text());
                        $(this).siblings("input").attr("value", $(this).val());
                        $(this).siblings().last().children(":not(:contains(" + sValue + "))").hide();
                        $(this).siblings().last().children(":contains(" + sValue + ")").show();
                    });
                };
            }
            else if (sMode == "Manual") {
                var sValueBox = defaults.ValueBox;
                var sMainBox = defaults.MainBox;
                var sDownBox = defaults.DownBox;
                var sDownListBox = defaults.DownListBox;
                var sDownListBoxChild = defaults.DownListBoxChild;
                var nObjIndex;
                function fManualDownListBoxClick() {
                    obj.eq(nObjIndex).find(sDownListBoxChild).unbind("click").click(function () {
                        for (i = 0;
                        i < aAttribte.length;
                        i++) {
                            obj.eq(nObjIndex).find(sValueBox).attr(aAttribte[i], $(this).attr(aAttribte[i]));
                        };
                        obj.eq(nObjIndex).find(sMainBox).html($(this).html());
                    });
                };
                if (sActive == "click") {
                    obj.click(function () {
                        nObjIndex = obj.index(this);
                        (obj.eq(nObjIndex).find(sDownBox + ":hidden").length > 0) ? obj.eq(nObjIndex).find(sDownBox).show() : obj.eq(nObjIndex).find(sDownBox).hide();
                        fManualDownListBoxClick();
                    });
                    obj.mouseleave(function () {
                        obj.eq(nObjIndex).find(sDownBox).hide();
                    });
                };
            };
        },

        /*
        作者：李想
        日期:2013年9月1日
        隐藏层的生成、显示及其隐藏；隐藏按需生成，页面初始化时不写入，当鼠标单击时载入并显示出来
        button_objs 按钮对象集，用于监听鼠标单击事件,请按页面中的出现顺序排列，只支持id
        URLs 模板页面，请与button_objs一一对应
        layers 模板层的ID，请与button_objs一一对应
        callbacks 回调函数 请与button_objs一一对应
        
        var button_objs = $("#moer_query,#commun");
        var URLs = ["/static/template/directory_morequeries.html", "/static/template/communication_manage.html"];
        var layers = ["#more_queries", "#file_manage"];
        var callbacks = ["more_queries", "file_manage"];
        $("#insert_before").yb_hiddenLayers(button_objs, URLs, layers, callbacks);
        */
        hidden_layers: function (button_objs, URLs, layers, callbacks, auto_fix_height) {
            $(this).yb_hiddenLayers(button_objs, URLs, layers, callbacks, auto_fix_height);
        }
        ,
        yb_hiddenLayers: function (button_objs, URLs, layers, callbacks, auto_fix_height) {
            auto_fix_height = auto_fix_height || "#content";

            var insert_obj = $(this);
            var h_this = $(auto_fix_height).height();
            button_objs.each(function (i) {
                $(this).click(function () {
                    if ($(layers[i]).length == 0) {
                        $.ajax({
                            type: "GET",
                            url: URLs[i] + "?para=" + Math.random(),
                            data: {
                                requestType: "file"
                            },
                            success: function (msg) {
                                insert_obj.before(msg);
                                if (typeof callbacks == "object") {
                                    if (typeof eval(callbacks[i]) == "function") {
                                        eval(callbacks[i])();
                                    }
                                }
                                show_layer();

                                //点击关闭按钮收起层
                                $("[data-close-button]", $(layers[i])).click(function () {
                                    button_objs.eq(i).trigger("click");
                                });
                            }
                        });
                    } else {
                        show_layer();
                    };

                    function show_layer() {
                        //层展开/收起
                        var fix_height = 0;
                        $(auto_fix_height).height(h_this);
                        $(layers[i]).stop(true, true).slideToggle(800, function () {
                            fix_height += $(layers[i]).not(":hidden").outerHeight(true);
                            $(auto_fix_height).height(h_this - fix_height);
                        });
                        //换背景色
                        button_objs.eq(i).toggleClass("background_change");
                        for (var j = 1; j < button_objs.length; j++) {
                            $(layers[(i + j) % layers.length]).stop(true, true).slideUp(800);
                            button_objs.eq((i + j) % layers.length).removeClass("background_change");
                        };
                        //更换文字
                        button_objs.each(function () {
                            if ((typeof $(this).data().changeText != "undefined") && (typeof $(this).data().defaultText != "undefined")) {
                                $(this).hasClass("background_change") ? $(this).val($(this).data().changeText) : $(this).val($(this).data().defaultText)
                            }
                        });
                    };

                });
            });
        },

        /*
        容器高度计算
        height_fix 用来修改容器的高度
        selector   容器中的子元素，一般为table
        method     高度计算方法[0，1]
                   0　求和法　计算出所有应该减去的高度和（此方法受边距、浮动及后插入容器的影响）
                   1　求差法　计算出BODY与目标容器的高度差
        
        var height_fix = 0;
        selector = "table";
        method = 1;
        $("#container").yb_heightCalc(height_fix,selector,method);
        */
        heightCalc: function () {
            $(this).yb_heightCalc(arguments[0], arguments[1], arguments[2]);
        },
        yb_heightCalc: function () {
            var height_fix = arguments[0] ? arguments[0] : 0;
            var selector = arguments[1] ? arguments[1] : ".layout_div";
            var method = arguments[2] ? arguments[2] : 0;
            var obj = $(this);
            var w_before = obj.prev().find("th").eq(-1).width();
            var w_after = w_before + 17;

            if (obj.css("overflow-y") != "hidden") obj.css({ "overflow-y": "auto" });
            function heightCalc() {
                var h_all = 0;
                var $this = obj;
                var obj_height = 0;

                switch (method) {
                    case 0://求和
                        while ($this.get(0).tagName != "BODY") {
                            $this.siblings().not(":hidden").each(function (i) {
                                h_all += $(this).outerHeight();
                            });
                            h_all += $this.outerHeight() - $this.height();
                            $this = $this.parent();
                        };
                        break;
                    case 1://求差
                        h_all = $("body").height() - obj.height();
                        break;
                }

                obj_height = $(window).height() - h_all + (height_fix ? height_fix : 0);
                obj.height(obj_height);
                if ($(selector, obj).height() > obj_height) {//调整标题栏最后一个th的宽度
                    //obj.css({ "overflow-y": "scroll" });
                    obj.prev().find("th").eq(-1).width(w_after);
                } else {
                    //obj.css({ "overflow-y": "auto" });
                    obj.prev().find("th").eq(-1).width(w_before);
                };
            };
            setTimeout(function () {
                heightCalc();
            }, 500);
            $(window).resize(function () {
                heightCalc();
            });
        },


        /*
             文本框自动智能提示效果
        
        yb_autoComplete: function (option) {
            var defOption = {autoUIBox:"",autoLITempID};
            $this = $(this);
            var options = $.extend({},defOption, $this.data(), option);
            var $this = $(this);
            var queryLike = $this.val();
            //定位
            $("#dataPock").wrap("<span class='autoBox'  style='position:relative' ><span>")           
            $this.yb_londData(options.m, options.c,function (result) {
                $("#"+defOption.autoUIBox).append($("#"+defOption.autoLITempID).render(result.data))
            });
        }, */



        /*
            时间控件
            使用方法 <input id="dataPock" type="text" onclick="$(this).yb_datePickern()">
            
            
        */
        yb_datePickern: function (option) {
            var $this = $(this);
            if (!$this.DatePicker) {
                return;
            }
            var defOption = { nextPick: undefined, ybtime: false, format: 'Y/m/d' };
            defOption = $.extend(defOption, $(this).data(), option || {});

            var defDate = new Date().formatDate('yyyy/MM/dd');
            // var defDate = new Date().getFullYear() + "/" + new Date().getMonth + 1 + "/" + new Date().getDate();
            if ($this.val() == "") {
                $this.val(defDate);
            }
            $this.DatePicker({
                format: defOption.format,
                date: $this.val(),
                current: $this.val(),
                starts: 1,
                ybtime: defOption.ybtime,
                onBeforeShow: function () {
                    $this.DatePickerSetDate($this.val(), true);
                },
                onChange: function (formated, dates) {
                    $this.val(formated);
                    //$this.DatePickerHide();
                    //联动
                    if (defOption.nextPick) {
                        $this.DatePickerHide();
                        $("#" + defOption.nextPick).yb_datePickern().DatePickerShow();
                    };
                }
            })
            return $this;
        },


        //自动编号的使用    绑定数据的时候会自动调用
        yb_autoNnumber: function autoNnumber(option) {
            try {
                setTimeout(function () {
                    var options = { isserial: false, currPage: 1, PageLength: 10 }
                    options = $.extend(options, option);
                    $(".public_forms  tr").each(function () {
                        var indexStart = 0;
                        //连续编码
                        if (options.isserial) {
                            indexStart = (options.currPage - 1) * options.PageLength;
                        }
                        var indexVal = $(this).index() + 1 + indexStart;
                        $(this).find(".numberIndex").html(indexVal);
                    })
                }, 500)

            }
            catch (e) { }
        },

        yb_changeText: function () {
            /*
            点击时改变文字和背景（单一按钮）
            李想 2013年9月8日
            data-changetext-id  托管的属性名
            data-defaulttext    元素默认的文本
            data-changetext     点击后元素的文本
            data-toggleclass    点击时切换的样式 
            */
            $(this).click(function () {
                var $this = $(this).data();
                var flag = $this.flag || false;
                if (flag) {//还原
                    $(this).val($this.defaulttext).removeClass($this.toggleclass);
                    $(this).data("flag", false);
                } else {//换背景，换文本
                    $(this).val($this.changetext).addClass($this.toggleclass);
                    $(this).data("flag", true);
                }
            });
        },

        yb_changeTextBox: function () {
            /*
            点击时改变文字和背景(组合)
            李想 2013年9月8日
            data-changetextbox-id  托管的属性名
            data-selector            子元素选择器
            data-defaulttext        子元素默认的文本
            data-changetext         子元素点击后元素的文本
            data-toggleclass        子元素点击时切换的样式 
            */
            var selector = this.data().selector;
            $(selector, $(this)).each(function () {
                $(this).click(function () {
                    var $this = $(this).data();
                    $(this).val($this.changetext).addClass($this.toggleclass).siblings(selector).each(function () {
                        var $thisdata = $(this).data();
                        $(this).val($thisdata.defaulttext).removeClass($thisdata.toggleclass);
                    });
                });
            });
        },
        /**
        * 下拉层全部删除
        * 作者:张胜
        * 时间:2013/9/11日
        */
        yb_showDialog: function (options, domclass) {

            var oldManip = options;
            var del_allBo = true;
            var $this = $(this);
            var head = oldManip.header;//表头 

            $this.click(function () {
                if ($("#" + domclass.divId).is("div") && domclass.clickYN != undefined) {
                    if (oldManip.bodyer.length > 1 && yn != domclass.clickYN) {
                        for (var i = 0; i < oldManip.bodyer.length; i++) {

                            var age = new Array();
                            age.push(oldManip.bodyer[i].id);
                            age.push(oldManip.bodyer[i].YYYY);
                            age.push(oldManip.bodyer[i].XXXX);
                            age.push(oldManip.bodyer[i].userName);
                            age.push(oldManip.bodyer[i].pwd);

                            var tr = $("<tr></tr>");
                            forGetVal(age, tr, true);
                            $("#" + domclass.divId).find("table").last().append(tr);
                        }
                        yn = domclass.clickYN;
                    }
                    $("#" + domclass.divId).show();
                } else {
                    if (oldManip != "" && $this.data().showhide) {
                        //console.log(oldManip.header[1]);
                        //console.log(domclass.divclass); 
                        /*表头开始*/
                        var div = $("<div></div");
                        div.addClass(domclass.divclass);
                        div.attr("id", domclass.divId);//给当前表格添加唯一标识
                        var table = $("<table border='0' cellpadding='0' cellspacing='0'></table>");
                        table.addClass(domclass.toptableclass);
                        var th = $("<tr></tr>");

                        var arg = new Array();
                        arg.push(head.id);
                        arg.push(head.YYYY);
                        arg.push(head.XXXX);
                        arg.push(head.userName);
                        arg.push(head.pwd);

                        forGetVal(arg, th, false);
                        table.append(th);
                        div.append(table);
                        /*表头结束*/

                        /*内容开始*/
                        var texTable = $("<table border='0' cellpadding='0' cellspacing='0'></table>");
                        texTable.addClass(domclass.texTableclass);

                        if (oldManip.bodyer.length > 1) {
                            for (var i = 0; i < oldManip.bodyer.length; i++) {

                                var age = new Array();
                                age.push(oldManip.bodyer[i].id);
                                age.push(oldManip.bodyer[i].YYYY);
                                age.push(oldManip.bodyer[i].XXXX);
                                age.push(oldManip.bodyer[i].userName);
                                age.push(oldManip.bodyer[i].pwd);

                                var tr = $("<tr></tr>");
                                forGetVal(age, tr, true);
                                texTable.append(tr);
                            }
                        }

                        var overflowDiv = $("<div></div>");
                        var docHeight = $(document).height();//提前记录document高
                        overflowDiv.append(texTable);
                        div.append(overflowDiv);
                        /*内容结束*/

                        $("body").append(div);
                        /*给弹出层定位置*/
                        var le;
                        var top;
                        var domxy = domclass.domXY;
                        (domxy == undefined) ? le = $this.offset().left : le = $("#" + domxy).offset().left;
                        (domxy == undefined) ? top = $this.offset().top : top = $("#" + domxy).offset().top;
                        top += $this.height() + 5;
                        if (div.height() * 1 + top * 1 + 5 * 1 + 1 * $this.height() > docHeight) {
                            top = top - div.height() - $this.height() - 10;
                        }


                        div.css({ "position": "absolute", "left": le + "px", "top": top + "px", "display": "block" });
                        /*给弹出层定位置结束*/

                        var overHeight = div.height() - table.height();
                        overflowDiv.css({ "height": overHeight + "px", "overflow-y": "auto" });
                        $this.data().showhide = false;//判断是新建还是显示

                    } else {
                        $("#" + domclass.divId).show();
                    }

                }


                //鼠标移开隐藏
                $("#" + domclass.divId).hover(function () { }, function () {
                    $(this).css("display", "none");
                });
                //全部删除
                $("#" + domclass.divId + " .del_all").unbind("click").click(function () {
                    //console.log(del_allBo);
                    //del_allBo?$("#" + domclass.divId + " span").addClass(domclass.toggleClass):$("#" + domclass.divId + " span").removeClass(domclass.toggleClass); 
                    //del_allBo?del_allBo=false:del_allBo=true;
                    $(this).val() == "全部删除" ? $(this).val("全部撤销") : $(this).val("全部删除");
                    if (del_allBo) {
                        $("#" + domclass.divId + " span").addClass(domclass.toggleClass);
                        $("#" + domclass.divId + " span input").val("撤销");
                        del_allBo = false;
                    } else {
                        $("#" + domclass.divId + " span").removeClass(domclass.toggleClass);
                        $("#" + domclass.divId + " span input").val("删除");
                        del_allBo = true;
                    }
                });
                //单个删除
                $("#" + domclass.divId + " span").unbind("click").click(function () {
                    $(this).toggleClass(domclass.toggleClass);
                    if ($(this).find("input").val() == "删除") {
                        $(this).find("input").val("撤销");
                    } else {
                        $(this).find("input").val("删除");
                    }
                });
            });

            function forGetVal(dom, ths, valBo) {
                var leng = dom.length + 1;
                for (var i = 0; i < dom.length; i++) {
                    var td = $("<td></td>");
                    (!valBo) ? td = $("<th></th>") : "";
                    td.text(dom[i]);
                    ths.append(td);
                    if (dom.length - 1 == i) {
                        //表头还是内容的判断
                        if (!valBo) {
                            ths.append($("<th></th>").append($("<input type='button' class='del_all' value='全部删除'>")));
                        } else {
                            ths.append($("<td></td>").append($("<span class='" + domclass.deleteSpan + "'></span>").append($("<input type='button' value='删除'>"))));
                        }
                    }
                }
            }
        }

    });


    $.extend({
        /*
            取被选中的VALUE值
            @name checkbox ID的前缀
        */
        yb_ChkVal: function (name) {
            var arr = new Array();
            $("input:checkbox[id^='" + name + "']").each(function () {
                if ($(this).attr("checked") && !this.disabled && this.id != name)
                    arr.push(this.value);
            });
            return arr;
        },


        /*
            清除指定文档里面所有文本框的内容
            @className  文档的类名字
        */
        yb_ClearVal: function (className) {
            $("." + className).find("textarea").val("");
            $("." + className).find(":input").each(function () {
                if ($(this).is(":text")) {
                    $(this).val("");
                }
                else if ($(this).is(":checkbox")) {
                    $(this).attr("checked", false)
                }
            });
        },

        /*
            取被选中控件的ID
            @name checkbox ID的前缀
        */
        yb_ChkID: function (name) {  //取被选中名称
            var arr = new Array();
            $("input:checkbox[id^='" + name + "']").each(function () {
                if ($(this).attr("checked") && !this.disabled && this.id != name)
                    arr.push($(this).attr("id"));
            });
            return arr;
        },
        /*
            取被选中对象
            @name checkbox ID的前缀
        */
        yb_ChkObj: function (name) {
            return $("input:checkbox[id^='" + name + "']");
        },
        /*
            取被选中对象
            @name checkbox 名字的前缀
            @isrev 默认至为空且为全选，当为true时反选
        */
        yb_ChkOpt: function (name, isrev) { //反选 复选
            $("input:checkbox[id^='" + name + "']").each(function () {
                if (this.id != name && !this.disabled) {
                    if (typeof (isrev) === 'boolean' && isrev) {
                        if ($(this).attr("checked"))
                            $(this).removeAttr("checked");
                        else {
                            $(this).attr("checked", 'true');
                        }
                    } else $(this).attr("checked", 'true');
                }
            });
        },



        /*
          序列化URL
        
          例：
          $.yb_SerializeURL2Json("a.aspx?A=1&B=2"); 序列为Json对象。 不填写 默认为当前地址 
          
          @url 序列为Json对象。 不填写 默认为当前地址 
        */
        yb_SerializeURL2Json: function (url) {
            var result = {};
            $.yb_SerializeURL2KeyVal(url).each(function () {
                result[this.key] = this.value;
            });
            return result;
        },
        /*
         序列化URL 
         例： 
         $.yb_SerializeURL2KeyVal("a.aspx?A=1&B=2")  序列为键值对。 不填写 默认为当前地址
        
         @url 序列为键值对。 不填写 默认为当前地址
        */
        yb_SerializeURL2KeyVal: function (url) {
            url = url || window.location.search;
            url = url.split("?"), url = url.length >= 2 ? url[1] : '';
            var parameter = url.split("&");
            var result = [];
            for (var i = 0; i < parameter.length; i++) {
                var val = parameter[i].split("=");
                result.push({ key: val[0].toLowerCase(), value: $.trim(val[1]) });
            }
            return $(result);
        },
        /*
            XML装换为JSON对象
            @url        数据来源
            @data       提交数据。 [ $("#a,#b,.c") | #a,#b,.c ]
            @fun        绑定成功后执行函数 
            @funerr     错误执行函数
        */
        yb_Xml2Json: function (url, data, fun, funerr) {
            $.ajax({
                type: 'post',
                'url': url,
                'data': data,
                success: function (o) {
                    if (o.nodeType == 9) {
                        fun(paramXML(o));
                    }
                },
                error: function (x, t, e) {
                    if ($.isFunction(funerr))
                        funerr(x, t, e);
                    else
                        alert("错误：调用Xml2Json出错，" + (t || e));
                }
            });

            function paramXML(node) {
                var obj = null, txt = '';
                node = node.childNodes ? node : node[0];

                if (node.childNodes) {
                    if (node.childNodes.length > 0) {
                        /* nodeTyp 类型值说明 1.元素、2.属性、3.文本、8.注释、9.XML文档 */
                        $.each(node.childNodes, function (n, cn) {
                            var cnt = cn.nodeType, cnn = String((cn.localName || cn.nodeName) || '').replace(/-/ig, '_'); //JSON对象名称
                            var cnv = cn.text || cn.nodeValue || '';
                            if (cnt == 8) return;
                            else if (cnt == 3 || cnt == 4 || !cnn) {
                                if (cnv.match(/^\s+$/)) return;
                                txt += cnv.replace(/(^\s+)|(\s+$)/g, '');
                            } else {
                                obj = obj || {};
                                if (obj[cnn]) {
                                    obj[cnn] = toArr(obj[cnn]);
                                    obj[cnn][obj[cnn].length] = paramXML(cn);
                                    obj[cnn].length = obj[cnn].length;
                                } else {
                                    obj[cnn] = paramXML(cn);
                                }
                            }
                        });
                    }
                }

                if (obj) {
                    obj = $.extend((txt == '' ? new String(txt) : {}), obj || {});
                }
                var out = obj || txt;
                return out;
            }

            function toArr(o) {
                if (!$.isArray(o)) o = [o];
                o.length = o.length;
                return o;
            }
        },
        /*
          警告提示
           $.yb_wait("正在加载数据中。。。"); 
        
           @content:提示信息 
           @index:状态数组
        */
        yb_wait: function (content, index) {
            var WAIT = $("<div/>", { 'class': 'wait' }), t;
            var WAITBG = $("<div/>", { "id": "WAITBG", "class": "WAITBG" });
            WAITBG.css({ "opacity": 0.1, "height": $(window).height(), "width": $(window).width() });
            var arr_class = ["waitting", "success", "failed", "warning_tri", "warning_cir"];
            var myClass = arr_class[index || 0];

            $(".ybwait").remove();  //移除已存在的 
            $(".WAITBG").remove();
            WAIT.removeClass().addClass('ybwait');
            WAIT.html(content || '正在努力,请稍候');

            var XY = { top: ($(window).height() / 2), left: $(window).width() / 2 };
            $("body").append(WAIT);  //添加到当前页 
            $("body").append(WAITBG);
            var dot = $("<div/>", { 'class': myClass });
            //var fn = function () { dot.animate({ left: WAIT.innerWidth()-5 }, 800).animate({ left: '0px' }, 800, fn); }
            dot.prependTo(WAIT);
            //fn();

            WAIT.css({ left: XY.left - parseInt(WAIT.width()) / 2, top: XY.top - parseInt(WAIT.height()) / 2 }).show(); //显示位置

            /*
            隐藏警告提示
                content:标题
                tims: 停留时间   
            */
            this.hide = function (content, tims) {
                if (typeof content === 'number') {
                    tims = content;
                    content = '';
                }
                WAIT.removeClass().addClass('ybwait');
                if (content != '') WAIT.html(content);

                WAIT.delay(tims || 500).animate({ opacity: 0 }, 400, function () {
                    $(this).fadeOut(function () { $(this).remove(); $(".WAITBG").remove(); });
                }); //隐藏动画
                return this;
            };
            return this;
        },
        /*
            获取文档选择内容做准备
            在页面加载完成后立即执行 $.yb_readyPick()
        
            获取选择内容用 $.yb_pick()
        */
        yb_readyPick: function () {
            $(window.document).mouseup(function () {
                _containerCache = document.createElement("div");
                var WINDOC = this;
                (WINDOC.getSelection && $.browser.version != 9.0 ? function () {
                    var range = WINDOC.getSelection().getRangeAt(0);
                    return _containerCache.appendChild(range.cloneContents());
                } : function () {
                    return _containerCache.innerHTML = WINDOC.selection.createRange().htmlText;
                })();
            });
        },
        /*
             获取选择内容用 $.yb_pick()
             在页面加载完成后立即执行 $.yb_readyPick() 做好获取内容的准备
        */
        yb_pick: function () {
            try {
                return $(_containerCache);
            } catch (e) {
                alert("没有检测到，$.yb_readyPick()的执行痕迹。\n请在页面加载完成后立执行 $.yb_readyPick() 做好获取内容的准备。");
            }
        }, //重绘Select结束
        Mark: [],
        MarkNext: [],
        yb_GoNext: function () {
            var next = $.MarkNext.shift();
            if (next) {
                if (next.idx == 0) {
                    $.Mark.push(next);
                    next = $.MarkNext.shift();
                }
                var G = /page=(\d+)/.exec(next.option.url) || [0, 1];
                $.extend(next.option, { GO: 1, current: parseInt(G[1]) });
                $(next.self).yb_DataSource(next.option, true);
                $.Mark.push(next);
                return true;
            }
            return false;
        },
        yb_GoBack: function () {
            var back = $.Mark.pop();
            if (back) {
                if (back.idx == ($.Mark.length + $.MarkNext.length)) {
                    $.MarkNext.reverse().push(back);
                    $.MarkNext.reverse();
                    back = $.Mark.pop();
                }
                var G = /page=(\d+)/.exec(back.option.url) || [0, 1];
                $.extend(back.option, { GO: 1, current: parseInt(G[1]) });
                $(back.self).yb_DataSource(back.option, true);
                $.MarkNext.reverse().push(back);
                $.MarkNext.reverse();
                return true;
            }
            return false;
        },

        cookie: function (name, value, options) {
            if (typeof value != 'undefined') { // name and value given, set cookie
                options = options || {};
                if (value === null) {
                    value = '';
                    options.expires = -1;
                }
                var expires = '';
                if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                    var date;
                    if (typeof options.expires == 'number') {
                        date = new Date();
                        date.setTime(date.getTime() + (options.expires * 60 * 1000)); //按天计算时间 
                        //                                t = options.expires = new Date();
                        //                                seconds = options.expires;

                        //                                t.setTime(t.getTime() + (seconds*1000));   //按秒计算时间

                    } else {
                        date = options.expires;
                    }
                    expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
                }
                // CAUTION: Needed to parenthesize options.path and options.domain
                // in the following expressions, otherwise they evaluate to undefined
                // in the packed version for some reason...
                var path = options.path ? '; path=' + (options.path) : '; path=/';
                var domain = options.domain ? '; domain=' + (options.domain) : '';
                var secure = options.secure ? '; secure' : '';
                document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
            } else { // only name given, get cookie
                var cookieValue = null;

                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = jQuery.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
        }
    });


    $(document).ready(function () {

        /*上下全屏*/
        document.onmousewheel = function (e) {
            try {
                e = e || window.event;
                var t;
                if (window != parent) {
                    t = parent.Dif();
                }
                else {
                    t = Dif();
                }

                if (t >= 230) {
                    if (e && e.preventDefault) {
                        e.preventDefault();
                        e.stopPropagation();
                    } else {
                        e.returnValue = false;
                        return false;
                    }
                }
            }
            catch (e) { }
        }


        //悬浮窗体
        $("[data-reveal-id]").click(function (e) {
            e.preventDefault();
            $(this).yb_prompt();
        });

        //数据列表绑定
        $("[data-datasource-id]").click(function (e) {
            e.preventDefault();
            var data = $(this).data();
            $("#" + data.datasourceId).yb_DataSource({ GO: 1 });
            //delete isClick;
        }).each(function () {
            var data = $(this).data();
            if (data.initiate != undefined) {
                $("[data-initiate]").trigger(data.initiate, true); //首次加载改进
            }
        });

        //泡泡提示
        $('[data-gips-id]').each(function () {
            $(this).yb_gips();
        });

        //准备选择内容
        if ($('body[data-pick-id]').length == 1) {
            $.yb_readyPick();
        }

        //重绘SELECT
        $("select[class!='edit']").each(function () {
            $(this).yb_drawSelect();
        })

        $("[data-tabslide-Id]").click(function (e) {
            e.preventDefault();
            $(this).yb_slide();

        });

        /*绑定日历控件*/
        $('[data-Picker]').each(function () {
            $(this).yb_datePickern();
        })

        //文本框变密码框
        $("[data-text2password]").yb_text2password();

        $("[data-form-id]").each(function () {
            $(this).click(function () {
                $(this).yb_londData();
                return false;
            });
        });

        //单个按钮改变文字，更换背景
        $("[data-changetext-id]").each(function () {
            $(this).yb_changeText();
        });

        //组合按钮改变文字，更换背景
        $("[data-changetextbox-id]").each(function () {
            $(this).yb_changeTextBox();
        });

        //二级菜单显示隐藏
        $("[data-control-id]").click(function () {
            $(this).yb_showhideli();
        });
    });

    /*
       html 编码
   */
    String.prototype.htmlEncode = function () {
        var div = document.createElement('div');
        var text = document.createTextNode(this.toString());
        div.appendChild(text);
        var ret = div.innerHTML;
        return ret;//.replace(/"/g, '&quot;');
    }
    /*
        html 解码
    */
    String.prototype.htmlDecode = function () {
        var div = document.createElement("div");
        div.innerHTML = this.toString().replace(/<[^>]*>/gi, '');
        return div.childNodes[0] ? div.childNodes[0].nodeValue || '' : '';
    }


    //过滤内容的html标签
    String.prototype.removeHTML = function () {
        return this.replace(/<\/?([a-z]+)( [^>]+|\/)?>/ig, "");
        //var t = arguments;
        // t = t.join('|');
        //return this.replace(/<\/?([a-z]+)( [^>]+|\/)?>/ig, function () {
        //    var arg = arguments;
        //    var tag = arg[1].toLowerCase();
        //    if (t && RegExp("(" + t + ")", ig).test(tag)) {
        //        return arg[0];
        //    }
        //    return "";
        //});
    }


    ////格式化时间戳 时间戳转日期格式
    //; String.prototype.ToDateTime = function () {
    //    if (!/^\d+(.\d{1,2})?$/.test(this)) return new Date(0);
    //    try {
    //        var dt = new Date(parseInt(this));
    //        dt.setYear(dt.getYear() - 69);

    //        return dt;
    //    }
    //    catch (e) {
    //        return this;
    //    }
    //}

    ; Date.prototype.formatDate = function (format) {
        var dt = this;
        try {

            this.Year = dt.getFullYear();
            //月份
            this.Month = (dt.getMonth() + 1) < 10 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1;
            //日期
            this.Day = dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate();
            //星期几,数字
            this.Week = dt.getDay();
            //星期几，中文
            this.WeekDay = '日一二三四五六'.charAt(dt.getDay());
            //24制小时
            this.Hours24 = dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours();
            //12制小时
            this.Hours12 = this.Hours24 > 12 ? this.Hours24 - 12 : this.Hours24;
            this.Hours12 = this.Hours12 < 10 ? "0" + this.Hours12 : this.Hours12;
            //分钟
            this.Minutes = dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes();
            //秒
            this.Seconds = dt.getSeconds() < 10 ? "0" + dt.getSeconds() : dt.getSeconds();

            format = format.replace(/y+/ig, this.Year);
            format = format.replace("MM", this.Month);
            format = format.replace("dd", this.Day);
            format = format.replace("HH", this.Hours24);
            format = format.replace("hh", this.Hours12);
            format = format.replace("mm", this.Minutes);
            format = format.replace("ss", this.Seconds);
            format = format.replace("ww", this.Week);
            format = format.replace("WW", this.WeekDay);
            return format;
        }
        catch (e) {
            return dt;
        }
    }

    //格式化时间戳 时间戳转日期格式
    //格式化时间 /Date(-13568954655892)/
    ; String.prototype.formatDate = function (format) {
        var dt = this.toString();
        if (/Date\([\d\+]+\)/ig.test(dt)) {
            if (dt.charAt(0) == '/')
                dt = dt.replace(/\//ig, '');

            dt = Function("return new " + dt)();
            return dt.formatDate(format);
        }
        else {
            if (!/^\d+(.\d{1,})?$/.test(this)) dt = new Date(0);
            dt = new Date(parseInt(this.toString()));
            // dt.setYear(dt.getYear() - 69);
        }

        return dt.formatDate(format);
    }

})(jQuery);


function log() {
    if (!!console.log) {
        console.log.call(arguments);
    }
}


/*
 * jQuery Templating Plugin
 *   NOTE: Created for demonstration purposes.
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
(function (jQuery) {
    // Override the DOM manipulation function
    var oldManip = jQuery.fn.domManip;

    jQuery.fn.extend({
        render: function (data) {
            return this.map(function (i, tmpl) {
                return jQuery.render(tmpl, data);
            });
        },

        // This will allow us to do: .append( "template", dataObject )
        domManip: function (args) {
            // This appears to be a bug in the appendTo, etc. implementation
            // it should be doing .call() instead of .apply(). See #6227
            if (args.length > 1 && args[0].nodeType) {
                arguments[0] = [jQuery.makeArray(args)];
            }

            if (args.length === 2 && typeof args[0] === "string" && typeof args[1] !== "string") {
                arguments[0] = [jQuery.render(args[0], args[1])];
            }

            return oldManip.apply(this, arguments);
        }
    });

    jQuery.extend({
        render: function (tmpl, data) {
            var fn;

            // Use a pre-defined template, if available
            if (jQuery.templates[tmpl]) {
                fn = jQuery.templates[tmpl];

                // We're pulling from a script node
            } else if (tmpl.nodeType) {
                var node = tmpl, elemData = jQuery.data(node);
                fn = elemData.tmpl || jQuery.tmpl(node.innerHTML);
            }

            fn = fn || jQuery.tmpl(tmpl);

            if (jQuery.isArray(data)) {
                return jQuery.map(data, function (data, i) {
                    return fn.call(data, jQuery, data, i);
                });

            } else {
                return fn.call(data, jQuery, data, 0);
            }
        },

        // You can stick pre-built template functions here
        templates: {},

        /*
         * For example, someone could do:
         *   jQuery.templates.foo = jQuery.tmpl("some long templating string");
         *   $("#test").append("foo", data);
         */
        tmplcmd: {
            "each": {
                _default: [null, "$i"],
                prefix: "jQuery.each($1,function($2){with(this){",
                suffix: "}});"
            },
            "if": {
                prefix: "if($1){",
                suffix: "}"
            },
            "else": {
                prefix: "}else{"
            },
            "html": {
                prefix: "_.push(typeof $1==='function'?$1.call(this):$1);"
            },
            "=": {
                _default: ["this"],
                prefix: "_.push($.encode(typeof $1==='function'?$1.call(this):$1));"
            }
        },

        encode: function (text) {
            return text != null ? document.createTextNode(text.toString()).nodeValue : "";
        },

        tmpl: function (str, data, i) {
            // Generate a reusable function that will serve as a template
            // generator (and which will be cached).
            var fn = new Function("jQuery", "$data", "$i",
                "var $=jQuery,_=[];_.data=$data;_.index=$i;" +

                // Introduce the data as local variables using with(){}
                "with($data){_.push('" +

                // Convert the template into pure JavaScript
                str
                    .replace(/[\r\t\n]/g, " ")
                    .replace(/\${([^}]*)}/g, "{{= $1}}")
                    .replace(/{{(\/?)(\w+|.)(?:\((.*?)\))?(?: (.*?))?}}/g, function (all, slash, type, fnargs, args) {
                        var tmpl = jQuery.tmplcmd[type];

                        if (!tmpl) {
                            throw "Template not found: " + type;
                        }

                        var def = tmpl._default || "";

                        return "');" + tmpl[slash ? "suffix" : "prefix"]
                            .split("$1").join(args || def[0])
                            .split("$2").join(fnargs || def[1]) + "_.push('";
                    })
                + "');}return $(_.join('')).get();");

            // Provide some basic currying to the user
            return data ? fn.call(this, jQuery, data, i) : fn;
        }
    });
})(jQuery);


if (!this.JSON) {
    this.JSON = {};
}
(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear() + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate()) + 'T' +
                 f(this.getUTCHours()) + ':' +
                 f(this.getUTCMinutes()) + ':' +
                 f(this.getUTCSeconds()) + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {
        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }
        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':
                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':
                return String(value);

            case 'object':

                if (!value) {
                    return 'null';
                }

                gap += indent;
                partial = [];

                // Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }


                    v = partial.length === 0 ? '[]' :
                        gap ? '[\n' + gap +
                                partial.join(',\n' + gap) + '\n' +
                                    mind + ']' :
                              '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

                v = partial.length === 0 ? '{}' :
                    gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                            mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {
            var i;
            gap = '';
            indent = '';

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

            } else if (typeof space === 'string') {
                indent = space;
            }

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

            return str('', { '': value });
        };
    }

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {
            var j;

            function walk(holder, key) {

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {


                j = eval('(' + text + ')');

                return typeof reviver === 'function' ?
                    walk({ '': j }, '') : j;
            }

            throw new SyntaxError('JSON.parse');
        };
    }
}());
