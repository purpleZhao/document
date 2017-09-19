/*
 * 轮播图插件
 * @author  yangjinlai  2016-08-24
 *
 * 轮播方式：
 * 1--渐隐渐显切换，2--左右，3--上下，4--3D
 *
 * DOM结构使用createDOM()生成并插入到页面上，所有模式的结构是一样的，只有3D模式多了一个标题
 *
 * 轮播图容器的高度需在页面css上设置，轮播方式为1、2、3时，轮播图片的宽高默认为100%充满容器，
 * 轮播方式为4时，
 *
 * 去掉了根据浏览器窗口大小改变而重置轮播区域宽高的功能
 */

;(function($, window, document,undefined) {

	//构造函数
    var SliderFunction = function(ele, opt) {

        this.$element = ele,  //轮播区域元素

        //默认参数
        this.defaults = {

            img: [], //默认没有图片

            //轮播区域相关
            height: 460, //默认高度
            width: '100%', //默认宽度
            dotStyle : 1, //焦点样式，1为长扁椭圆形，2为圆形，默认为1
            dotBottom: 30, //焦点距轮播区域底部的距离，默认为30px

            //需要跟着浏览器大小变化改变轮播容器宽度
            //countHeight: false, //是否根据图片宽高和浏览器宽度计算轮播区域高度，默认false-不需要计算
            //minHeight: 0, //最小高度，如果不传，默认为0

            //轮播逻辑
            type: 1,  //type默认为渐隐渐显切换的
            time: 4000, //默认轮播时间为3000ms
            actTime: 1000, //动画改变的时间，如果不传，默认为1000ms



            //轮播相关事件
            dotEvent: true, //默认启动焦点点击切换轮播事件
            hoverEvent : true, //默认启动鼠标放上去停止轮播和离开时开始轮播
            showSideBtn: false, //默认不显示左右两边的<>按钮，如果该项传true，表示显示按钮且绑定点击事件
            showSideType: 0, //左右两边的<>按钮样式，0--大且无背景，1--小且有黑色透明背景
            
            //渐隐渐显模式需要的参数
            opacity : 0.3, //透明度，如果不传，默认为0.3

            //3D模式需要的参数
            three_d_height: 550, //3D模式的轮播区域高度，与上面的height不同，上面的height在3D模式里不需要
            hotWidth : 1200, //hot-event的宽度，需要传递，默认1200px

            three_aside: { //初始化时，左边和右边2个轮播块的宽高 top left
                rightLeft: 560,
                top: 50,
                imgHeight: 363,
                imgWidth: 636,
            }, 
            three_mid:{ //初始化时，中间块的宽高 top left
                midLeft: 200,
                top: 0,
                imgHeight: 453,
                imgWidth: 776
            },
            titleHeight : 43,  //图片块里，标题的高度
            imgPadding: 12 //图片块里，图片的padding（白边）
        },

        //把defaults和opt合并，后面使用this.options
        this.options = $.extend({}, this.defaults, opt),
        this.i = 0; //轮播图片的第一个索引
        this.action_type = 'normal'; //上下、左右轮播时需要
        //this.changeDOM = 'normal'; //根据normal和resize判断轮播区域是否改变，启动setInterval
        this.num = 0;  //轮播图片张数，初始化会默认计算

    }

    //定义方法
    SliderFunction.prototype = {

    	/**
         * 初始化，设置容器宽高及绑定各事件
         */
        init: function() {
            var that = this;

            //如果调用本插件却没有传图片，提示'未传图片'
            if( that.options.img.length == 0){
                that.$element.html('没有向插件中传图片'); 
                return false;
            }

            /*
                有数据时，进行一下预处理
                1. 没有传src，将src设为空
                2. 没有传url，将url设为'javascript:;'
                3. 3D模式，且未传title，将title设为空
            */
            //var imgArr = [];
            $.each(that.options.img,function(i,el){
                if(!el.hasOwnProperty('src')){
                    //没有传src，将src设为空
                    el.src = '';
                }
                if(!el.hasOwnProperty('url')){
                    //没有传url，将url设为空
                    el.url = 'javascript:;';
                }
                if(that.options == 4 && !el.hasOwnProperty('title')){
                    //3D模式，且未传title，将title设为空
                    el.title = '';
                }
                //imgArr.push(el);
                // if(el.hasOwnProperty('src') && !!el.src){
                //     if(!el.hasOwnProperty('url') || el.hasOwnProperty('url') && !el.src){
                //         el.url = 'javascript:;';
                //     }
                //     if(!el.hasOwnProperty('title')){
                //         el.title = '';
                //     }
                //     imgArr.push(el);
                // }
            })
            //that.options.img = imgArr;
            

            //创建轮播结构
            that.creatDom();

            //设置焦点样式
            if(that.options.dotStyle){
                //根据that.options.dotStyle设置焦点样式
                that.setDotStyle();
            }
            

            //绑定鼠标放上去停止轮播和启动轮播的事件
            if(that.options.hoverEvent){
                //如果hoverEvent为true，需要绑定
                that.setHoverEvent();
            }

            //绑定焦点点击事件
            if(that.options.dotEvent){
                //如果dotEvent为true，需要绑定
                that.setDotEvent();
            }

            //绑定左右<>点击事件
            if(that.options.showSideBtn){
                //如果showSideBtn为true，需要绑定
                that.setSideEvent();
            }

            //获取对应的模式逻辑处理函数，赋给that.func
            that.func = that.autoChange();
            //that.st = setInterval(that.func, that.options.time); 

            //设置轮播区域宽高
            that.setHeight();
        },


        /********************************初始化相关的各个函数*************************/

        /**
         * 1. 创建轮播区域DOM结构并插入到页面中
         * 
         * 逻辑：
         * html是轮播图片部分，switch_html是焦点部分，循环时分别生成并插入 
         * 循环需要判断是否为3D模式，3D模式只取3条img，且多了一个标题的h3标签
         * 焦点结构，3D模式多了一个three_d的class
         * 第一张图片块添加class show-item
         * 第一个焦点添加class  current
         * 3D模式下，3个图片块按照左中右的顺序，分别添加class left、middle、right
         */
        creatDom: function(){
            var that = this;

            var html = '<div class="hot-event">', //轮播图片部分
                switch_html = ''; //焦点结构

            if(that.options.type != 4){ // 不是3D模式
                $.each(that.options.img,function(i,el){
                    //轮播图片部分
                    html += '<div class="event-item num_'+i+'" num="'+i+'"><a href="'+el.url+'" target="_blank" style="background:url('+el.src+') no-repeat center center;background-size:cover;">'+
                        '</a></div>';

                    //轮播焦点结构
                    switch_html += '<a class="" onclick="return false;" href="javascript:;"></a>';
                    that.num += 1;
                })
            }else{ //3D模式
                $.each(that.options.img,function(i,el){
                    //如果img过多，只取前3条
                    if(i < 3){
                        //轮播图片部分
                        html += '<div class="event-item num_'+i+'"><a href="'+el.url+'" target="_blank">';
                        if(!!el.title){
                            html += '<h3>'+el.title+'</h3>';
                        }
                        html +='<img src="'+el.src+'" class="show_images_1_img"></a></div>';

                         //轮播焦点结构
                        switch_html += '<a class="" onclick="return false;" href="javascript:;"></a>';
                        that.num += 1;
                    }
                })
            }

            //轮播部分的整个结构
            if(that.options.type != 4){
                html += '</div><div class="switch-tab">'+switch_html+'</div>';
            }else{
                html += '</div><div class="switch-tab three_d">'+switch_html+'</div>';
            }

            if(that.options.showSideBtn){
                //两边的点击<>按钮结构
                // .side_btn_box 用于控制按钮显示的范围。
                if(that.options.showSideType == 0){
                    //大且无背景
                    var side_html = '<div class="side_btn side_left_btn showSideType_1"><img src="/common/img/Slider/left.png"></div>'+
                        '<div class="side_btn side_right_btn showSideType_1"><img src="/common/img/Slider/right.png"></div>';
                }else if(that.options.showSideType == 1){
                     //小且有黑色透明背景
                    var side_html = '<div class="side_btn side_left_btn showSideType_2"><img src="/common/img/Slider/left.png"></div>'+
                        '<div class="side_btn side_right_btn showSideType_2"><img src="/common/img/Slider/right.png"></div>';
                }
                html += side_html;
            }

            //将轮播结构插入到轮播容器
            //并给第一个图片和第一个焦点添加标识当前状态的class
            that.$element.html(html).addClass('sliderBanner');
            that.$element.find('.event-item:eq(0)').addClass('show-item');
            that.$element.find('.switch-tab a:eq(0)').addClass('current');

            //给3D模式的3个图片块分别加class
            if(that.options.type == 4){
                that.$element.find('.event-item:eq(0)').addClass('left');
                that.$element.find('.event-item:eq(1)').addClass('middle');
                that.$element.find('.event-item:eq(2)').addClass('right');
            }

        },


        /**
         * 2. 设置轮播区域宽高，并绑定浏览器窗口改变时，轮播区域大小改变的事件
         * 
         * 逻辑：
         * sh函数为设置容器和容器内部元素宽高和最小高度等属性的函数
         * 判断是否绑定根据浏览器窗口变化改变轮播区域大小的事件
         * 如果不绑定，直接执行sh()，如果绑定，ch函数为改变轮播区域大小的函数，并在这里调用sh()
         * 直接执行ch()，并在window.resize里面添加ch()
         *
         * window.resize时，会clearInterval且调用ch()，ch()会调用sh()，sh()里重新setInterval
         * 
         * 只有that.options.countHeight为true且width是'100%'、非3D模式时才可以根据浏览器改变宽高
         * 
         */
        setHeight : function(){
            var that = this;

            //各种属性初始化设置
            //var sh = function(){
            
                //设置容器的宽高和最小高度
                that.$element.height(that.options.height).width(that.options.width).css('min-height',that.options.minHeight);
                
                //焦点距容器底部距离
                that.$element.find('.switch-tab').css('bottom',that.options.dotBottom);

                //左右<>的宽高
                // that.$element.find('.side_btn').css({
                //                                     'border-top-width': that.options.height*0.3,
                //                                     'border-bottom-width': that.options.height*0.3,
                //                                     'border-right-width': that.options.height*0.1
                //                                 })


                //各个模式的另外设置
                if(that.options.type == 2){
                    //左右模式，设置event-item的width和left
                    $.each(that.$element.find('.event-item'),function(i,el){
                        $(this).css('left', i * that.$element.width()).width(that.$element.width());
                    })
                }

                if(that.options.type == 3){
                    //上下模式，设置event-item的height和min-height，width默认是100%
                    $.each(that.$element.find('.event-item'),function(i,el){
                        $(this).css('top', i * that.options.height).height(that.options.height);
                        //.css('min-height',that.options.minHeight);
                    })
                }

                if(that.options.type == 4){//3D模式
                    //区域宽高
                    that.$element.height(that.options.three_d_height).width(that.options.width);
                    //hot-event宽度
                    that.$element.find('.hot-event').width(that.options.hotWidth);
                    //title
                    that.$element.find('h3').height(that.options.titleHeight).css('line-height',that.options.titleHeight+that.options.imgPadding+'px');
                    
                    //左右的图片块
                    that.$element.find('.num_0').css({
                        'left':0,
                        'top':that.options.three_aside.top+'px'
                    });
                    that.$element.find('.num_2').css({
                        'left':that.options.three_aside.rightLeft+'px',
                        'top':that.options.three_aside.top+'px'
                    });   
                    that.$element.find('.num_0 img,.num_2 img').width(that.options.three_aside.imgWidth)
                                                    .height(that.options.three_aside.imgHeight)
                                                    .css({
                                                        'padding': that.options.imgPadding+'px'
                                                    });                                    

                    //中间的图片块
                    that.$element.find('.num_1 img').height(that.options.three_mid.imgHeight)
                                                .width(that.options.three_mid.imgWidth)
                                                .css({
                                                    'padding': that.options.imgPadding+'px'
                                                });                        
                    that.$element.find('.num_1').css({
                        'left': that.options.three_mid.midLeft+'px',
                        'top': that.options.three_mid.top+'px'
                    })   

                }

                //启动interval
                that.beginSc();
           // };


            //只有that.options.countHeight为true且width是'100%'、非3D模式时才可以根据浏览器改变宽高
            // if(that.options.countHeight && that.options.width == '100%' && that.options.type != 4){
                
            //     //计算高度
            //     var ch = function(){
            //         var w1 = $(window).width(),
            //             h1 = $(window).height(); 
            //         var img = new Image();
            //         img.src = that.options.img[0].src; //用第一张轮播图计算高度

            //         //设置整个轮播图区域的高度
            //         if (img.complete) {
            //             var h = parseInt(img.height*w1/img.width);
            //             var hp = h/that.options.height;

            //             //焦点距底部的距离
            //             that.options.dotBottom *= hp;
            //             //轮播区域高度
            //             that.options.height = parseInt(img.height*w1/img.width);
            //             //轮播区域宽度，因为只有全浏览器宽的轮播图需要响应变化，所以使用w1就可以
            //             that.options.width = w1;
            //             sh();
            //         } else {
            //             img.onload = function () {
            //                 var h = parseInt(img.height*w1/img.width);
            //                 var hp = h/that.options.height;

            //                 //焦点距底部的距离
            //                 that.options.dotBottom *= hp;
            //                 //轮播区域高度
            //                 that.options.height = parseInt(img.height*w1/img.width);
            //                 //轮播区域宽度，因为只有全浏览器宽的轮播图需要响应变化，所以使用w1就可以
            //                 that.options.width = w1;
            //                 sh();
            //             };    
            //         };

            //     };
            //     ch();

            //     //浏览器窗口大小改变，重新设置轮播区域宽高
            //     $(window).resize(function() {
            //         clearInterval(that.st);
            //         //将动画直接完成
            //         that.$element.find('.event-item').stop(true,true); 
            //         //设置that.changeDOM
            //         //that.changeDOM = 'resize';
            //         ch();
            //     });
            // }else{
                //sh();
            //}
            
           
        },


        /**
         * 3. 设置焦点样式
         * 根据that.options.dotStyle参数设置，给swich-tab添加class
         * type_1时是长扁椭圆形，type_2时是圆形
         */
        setDotStyle : function(){
            var that = this;
            that.$element.find('.switch-tab').addClass('type_'+that.options.dotStyle);
        },


        /**
         * 4. 绑定鼠标放上去停止轮播和启动轮播的事件
         *
         * 非3D模式时，给$element绑定即可
         * 3D模式时，需要给event-item和switch-tab绑定，而不是直接绑定到$element上
         * 鼠标放上时，clearinterval
         * 鼠标离开时，setinterval
         */
        setHoverEvent : function(){
            var that = this;
            if(that.options.type != 4){
                //非3D模式
                $el = that.$element;
            }else{
                //3D模式
                $el = that.$element.find('.event-item,.switch-tab');
            }
            $el.hover(function () {
                //进入
                clearInterval(that.st);
                return false;
            }, function () {
                //离开
                that.beginSc()
                that.action_type = 'normal';
                return false;
            })
        },


        allBeginFunc: function(){
            var that = this;

            if(that.options.type == 5){
                that.options.type = 2;
            }
            
            that.func();
        },

        /**
         * 轮播启动
         * @return {[type]} [description]
         */
        beginSc: function(){
            var that = this;
            that.st = setInterval(function(){
                //console.log('当前第'+(that.i+1)+'张');

                that.i == (that.num - 1) ? that.i = 0 : that.i += 1;

                that.allBeginFunc();

            }, that.options.time);
        },


        /**
         * 5. 绑定焦点点击事件
         *
         * 点击时clearInterval
         * 设置that.i的值
         * 设置that.action_type为'click'
         * 执行that.func()
         */
        setDotEvent : function(){
            var that = this;

            that.$element.on('click','.switch-tab>a', function () {
                clearInterval(that.st);

                //var i = $('.switch-tab .current').index(); //当前的焦点
                
                that.newIndex = $(this).index() ;

                console.log(that.i);
                console.log(that.newIndex);

                if(that.i == that.newIndex){  //就是当前的，不做操作
                    return false;
                }

                if(that.options.type == 5 || that.options.type == 2){
                    if(that.i > that.newIndex){
                        //在左边
                        that.options.type = 5;  //从左往右
                    }else{
                        that.options.type = 2; //从右往左
                    }
                }else{
                    that.i = that.newIndex;
                }
                
                that.action_type = 'click';

                that.func();

                return false;
            });
        },

        /*
            绑定左右<>点击事件
         */
        setSideEvent: function(){
            var that = this;
            that.$element.on('click','.side_btn', function () {

                clearInterval(that.st);

                var $hot = that.$element.find('.hot-event');

                if($(this).hasClass('side_left_btn')){
                    //点击的是左边的
                    
                    if(that.options.type == 1 || that.options.type == 3 || that.options.type == 4){
                        
                        if(that.i == 0){
                            that.i  = that.num - 1;
                        }
                        else{
                            that.i -= 1;
                        }
                        that.action_type = 'click';
                    }else if(that.options.type == 5 || that.options.type == 2){
                        if(that.i == (that.num -1)  || that.isAnimate){
                            //最后一张，不能移动
                            //console.log('最后一个');
                            return false;
                        }
                        that.isAnimate = true;
                        that.i += 1;
                        that.action_type = 'side_left';
                        that.options.type = 2;
                    }
                }else{
                    //点击的是右边的
                    if(that.options.type == 1 || that.options.type == 3 || that.options.type == 4){
                        if( that.i == (that.num-1)){
                            that.i = 0;
                        }else{
                            that.i += 1;
                        }
                        that.action_type = 'click';
                    }else if(that.options.type == 5 || that.options.type == 2){
                        if(that.i == 0 || that.isAnimate){
                            //当前第一张，不能移动
                            return false;
                        }
                        that.isAnimate = true;
                        that.i -= 1;
                        that.action_type = 'side_right';
                        that.options.type = 5;
                    }
                }

                that.func();
                return false;
            });
        },


        /**
         * 6. 根据that.options.type判断轮播模式，添加不同的样式，并调用不同的逻辑处理
         */
        autoChange : function(){
            var func,
                that = this;

            switch(that.options.type){
                case 1: //渐隐渐显模式
                    that.$element.addClass('hideShow');
                    func = that.HideShow();
                    return func;
                case 2 : //从右向左
                case 5 : //从左向右
                    that.$element.addClass('leftRight')
                    func = that.LeftRight();
                    return func;
                case 3 :  //上下模式
                    that.$element.addClass('upDown');
                    func = that.UpDown();
                    return func;
                case 4 :  //3D模式
                    that.$element.addClass('three_d');
                    func = that.threeD();
                    return func;
                default:
                    return fasle;
            }
        },

       



        /***************************各种模式的逻辑处理****************************/

        /**
         * 焦点切换，所有模式共用
         */
        dotChange: function(){
            var that = this; 
            that.$element.find('.switch-tab>a:eq(' + that.i + ')').addClass('current').siblings().removeClass('current');
        },


        /**
         * 1. 渐隐渐显切换方式
         *
         * 逻辑：
         * 先停止动画，切换焦点，图片的切换使用display和opacity结合
         * 动画结束后，设置that.i的值
         */
        HideShow: function(){
            var that = this;

            return function(){
                
                //先停止动画
                that.$element.find('.event-item').stop(true); 

                //焦点切换
                that.dotChange();

                //that.i = that.i + 1 === that.num ? 0 : that.i + 1;

                that.$element.find('.event-item').css({display: 'none', opacity: that.options.opacity});

                //图片切换
                that.$element.find('.event-item:eq(' + that.i + ')').css({
                    display: 'block',
                    opacity: that.options.opacity
                }).animate({ opacity: 1 }, that.options.actTime)
                //.siblings('.event-item').css({display: 'none', opacity: that.options.opacity});
            }
        },


        /**
         * 2. 左右切换模式
         *
         * 逻辑：
         * 因为点击焦点时，直接滚动到对应图片，所以在动画执行时，不能做其他操作
         * 如果that.action_type为click，说明是点击焦点，需要设置对应的index，用于计算滚动距离
         * 如果不是click，index为1，只滚动一张图片的距离
         *
         * 最后一张图片的动画执行完毕后，把滚动过去的图片都顺移到图片结构末尾，
         * 并设置对应的距离，实现无缝滚动
         *
         * 该模式不需要自增that.i
         * 
         */
        LeftRight : function(){
            var that = this;
            return function(){

                var $hot = that.$element.find('.hot-event'),
                    w = that.$element.width();

                if($hot.find('.event-item').is(":animated")){
                    //如果正在执行动画，不做其他的动作
                    return false;
                }

                var index;
                
                if(that.options.type == 5){
                    if(that.action_type == 'click'){
                        index =  that.i - that.newIndex;  //当前的减去新的的距离
                    }else{
                        index = 1;
                    }

                    //从左向右
                    $hot.find('.event-item').animate({
                        "left": '+='+ index * w + "px"
                    },that.options.actTime, function(){
                        that.isAnimate = false;
                    })
                }else{
                    //从右向左
                    if(that.action_type == 'click'){
                        index =  that.newIndex - that.i;  //当前的减去新的的距离
                    }else{
                        index = 1;
                    }

                    if( that.i == 0){
                        $.each($hot.find('.event-item'),function(i,el){
                            if( parseInt($(this).css('left')) < 0){
                                //如果left<0
                                var t = parseInt($(this).css('left')) + that.num * w;
                                $(this).css('left',t+'px').insertAfter($hot.find('.event-item:eq('+(that.num-1)+')'));
                            }
                        })
                    }
                    if( that.i == 1){
                        $.each($hot.find('.event-item'),function(i,el){
                            if( $(this).attr('num') != 0 && parseInt($(this).css('left')) < 0){
                                //如果left<0
                                var t = parseInt($(this).css('left')) + that.num * w;
                                $(this).css('left',t+'px').insertAfter($hot.find('.event-item:eq('+(that.num-1)+')'));
                            }
                        })
                    }

                    $hot.find('.event-item').animate({
                        "left": '-='+ index * w + "px"
                    }, that.options.actTime, function(){
                        that.isAnimate = false;
                    })
                }

                if(that.action_type == 'click'){
                    that.i = that.newIndex;
                }
                

                //焦点切换
                that.dotChange();

            }
        },


        /**
         * 3. 上下切换方式
         *
         * 逻辑：
         * 因为点击焦点时，直接滚动到对应图片，所以在动画执行时，不能做其他操作
         * 如果that.action_type为click，说明是点击焦点，需要设置对应的index，用于计算滚动距离
         * 如果不是click，index为1，只滚动一张图片的距离
         *
         * 最后一张图片的动画执行完毕后，把滚动过去的图片都顺移到图片结构末尾，
         * 并设置对应的距离，实现无缝滚动
         *
         * 该模式不需要自增that.i
         */
        UpDown : function(){
            var that = this;
            return function(){

                var $hot = that.$element.find('.hot-event');

                if($hot.find('.event-item').is(":animated")){
                    //如果正在执行动画，不做其他的动作
                    //that.i += 1;
                    return false;
                }

                if(that.action_type == 'click'){
                    index =  $hot.find('.num_'+that.i).index();
                }else{
                    index = 1;
                }

                $hot.find('.event-item').animate({
                    "top": '-='+ index * that.options.height + "px"
                },that.options.actTime,function(){
                    if($(this).index() == (that.num -1)){
                        //最后一个
                        $.each($hot.find('.event-item'),function(i,el){
                            if($(this).css('top').indexOf('-') != -1){
                                //如果top<0
                                var t = parseInt($(this).css('top')) + that.num * that.options.height;
                                $(this).css('top',t+'px').insertAfter($hot.find('.event-item:eq('+(that.num-1)+')'));
                            }
                        })
                    }

                })
                //焦点切换
                that.dotChange();
                //that.i = that.i + 1  == that.num ? 0 : that.i + 1;
            }
        },


        /**
         * 4. 3D模式
         *
         * 逻辑：
         * toRight()为滚动到右边位置的动画
         * toLeft()为滚动到左边位置的动画
         * toMiddle()为滚动到中间位置的动画
         * LeftToRight()为从左往右滚动
         * RightToLeft()为从右往左滚动
         *
         * 
         * 因为点击焦点时，直接滚动到对应图片，所以在动画执行时，不能做其他操作
         * 
         * that.callback为执行第二次轮播的方向，当点击焦点为第一个或者第三个，当前位置为第三个或第一个时，
         * 需要连着滚动2次，设置that.callback后，执行完toMiddle()的动画后，再执行一次对应的轮播事件
         * 并在轮播完之后将that.callback设置为null
         *
         * 执行两次轮播时，动画速度改为300ms，正常轮播时，600ms
         *
         * 执行that.RightToLeft或that.LeftToRight时，要把that传进去，否则在动画里that.callback后执行时
         * 会改变that的指向，导致轮播出现错误
         *
         * 
         *
         * 该模式不需要自增that.i
         */
        threeD : function(){
            var that = this;

            return function(){

                if(that.$element.find('.event-item').is(":animated")){
                    //如果正在执行动画，不做其他的动作
                    //that.i += 1;
                    return false;
                }
                that.callback = null;

                if(that.action_type == 'click'){
                    that.actTime = 300;
                    var i = that.$element.find('.switch-tab a.current').index();
                    if(that.i == '-1'){
                        that.RightToLeft(that);
                        //从左往右倒回来。。。
                        if(i == 2){
                            that.callback = 'LeftToRight';
                        }
                    }else if(that.i == 0){
                        if(i == 2){
                            that.RightToLeft(that);
                        }else if(i == 0){
                            that.LeftToRight(that);
                        }
                    }else if(that.i == 1){
                         that.LeftToRight(that);
                        if(i == 0){
                            that.callback = 'RightToLeft';
                        }
                    }
                }else{
                    that.actTime = 600;
                    that.LeftToRight(that);
                }

                //焦点切换
                that.dotChange();
                //that.i = that.i + 1  == that.num ? 0 : that.i + 1;

            }
        },

        //这三个移动函数，需要改变图片块的z-index，left，top，class
        //和图片块里面img的width，height
        toRight : function($el,className){
            var that = this;
            //移动到最右边的
            $el.animate({
                'z-index': 10
            },100).animate({
                'left': that.options.three_aside.rightLeft+'px',
                'top': that.options.three_aside.top + 'px',
            },that.actTime,function(){
                $(this).removeClass('left').removeClass('middle').removeClass('right').addClass(className)
            }).find('img').animate({
                'width': that.options.three_aside.imgWidth + 'px',
                'height': that.options.three_aside.imgHeight + 'px',
            },(that.actTime+100));
        },

        toLeft : function($el,className){
            var that = this;
            //移动到最左边的
            $el.animate({
                'z-index': 20
            },100).animate({
                'left': 0,
                'top': that.options.three_aside.top + 'px',
            },that.actTime,function(){
                $(this).removeClass('left').removeClass('middle').removeClass('right').addClass(className)
            }).find('img').animate({
                'width': that.options.three_aside.imgWidth + 'px',
                'height': that.options.three_aside.imgHeight + 'px',
            },(that.actTime+100));
        },

        toMiddle : function($el,className){
            var that = this;
            //移动到最中间
            $el.animate({
                'z-index': 30
            },100).animate({
                'top': 0,
                'left': that.options.three_mid.midLeft+'px',
            },that.actTime,function(){
                $(this).removeClass('left').removeClass('middle').removeClass('right').addClass(className)
            }).find('img').animate({
                'width': that.options.three_mid.imgWidth + 'px',
                'height': that.options.three_mid.imgHeight + 'px',
            },(that.actTime+100),function(){

                if(!!that.callback ){

                    if(that.callback == 'RightToLeft'){
                        //从右往左
                        that.RightToLeft(that);
                    }else{
                        that.LeftToRight(that);
                    }
                    that.callback = null;
                }
                
            });
        },

        //从右往左
        LeftToRight : function(that){

            //var that = this;
            that.toRight(that.$element.find('.left'),'right');
            that.toLeft(that.$element.find('.middle'),'left');
            that.toMiddle(that.$element.find('.right'),'middle');
        },

        //从左往右
        RightToLeft : function(that){
            //var that = this;
            that.toRight(that.$element.find('.middle'),'right');
            that.toLeft(that.$element.find('.right'),'left');
            that.toMiddle(that.$element.find('.left'),'middle');
        }

        
    }


    /*
    	创建Slider
    	options是外部调用Slider时传进来的对象
        例：
    	$('#banner').Slider({
            type:4,  
            img:imgArr, //轮播的图片
            countHeight: true
        }); 
    	$('#banner')为整个轮播区域
    
     */
    $.fn.Slider = function(options) {
        //生成实例，绑定默认元素和options
        //this指当前调用的元素，所以options里不用再把元素传递进来了
        var slider = new SliderFunction(this, options);
        //调用插件方法
        return slider.init();
    }



})(jQuery, window, document);


