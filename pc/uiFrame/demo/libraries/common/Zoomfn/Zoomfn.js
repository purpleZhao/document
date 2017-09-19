/*
 * 图片查看器插件
 * @author  jiaxiaolu  2016-12-24
 *确保页面中有以下结构
 *<div class="mask"></div>
 *<i class="iconfont closebtn">&#xe631;</i>
 *<div class="enlargebox"><img class="enlarge" src=""></div>
 *使用：对象.Zoomfn(); eg：$(".vipSection img").Zoomfn();
 */

;(function($, window, document,undefined) {
    //构造函数
    var ZoomFunction = function(ele) {

        this.$element = ele;//点击查看的图片
    }
    //定义方法
    ZoomFunction.prototype = {
        getElements : {
            Zoomfn: $('.Zoomfn'),
            //mask :$(".mask"),//遮罩层
            closebtn :$(".closebtn"),//关闭按钮
            enlargebox :$(".enlargebox"), //全屏查看图片的盒子
            enlarge :$(".enlargebox .enlarge"),//全屏查看的图片
            
        },
        init : function() {
            var that = this; 
            that.events();
        },
        events : function() {
            var that = this; 
            //点击图片，全屏打开
            that.$element.on('click',function(){
                //将点击图片的地址赋予全屏的打开的img
                var newsrc=$(this).attr("src");
                that.getElements.enlarge.attr("src",newsrc);
                //获取屏幕的宽高
                var w1=$("body").width();
                var h1=$(window).height();
                //获取当前图片的宽高
                var w2=$(this).width();
                var h2=$(this).height();
                //定义图片全屏显示时的宽高
                var w3=0;
                var h3=0;
                //设置全屏图片相对于屏幕的宽高，按屏幕80%等比例显示
                /*如果图片的宽高比大于屏幕，应按屏幕的宽为基准设置图片的宽，并等比设置图片的高*/
                if(w2/h2>w1/h1){
                    w3=w1*0.8;
                    h3=h2*(w3/w2);
                }else{
                    h3=h1*0.8;
                    w3=w2*(h3/h2);              
                }
                that.getElements.enlarge.width(w3);
                that.getElements.enlarge.height(h3);
                //显示图片、遮罩、关闭按钮
                that.getElements.Zoomfn.show();
                // that.getElements.closebtn.show();
                // that.getElements.mask.show();
                // that.getElements.enlargebox.show();
                //定义图片首次打开的位置
                var t=20;
                var l=(w1-w3)/2;
                that.getElements.enlarge.css("top",t);
                that.getElements.enlarge.css("left",l);
            }) 
            //点击关闭按钮
            that.getElements.closebtn.on('click',function(){
                that.getElements.Zoomfn.hide();
                // $(this).hide();
                // that.getElements.mask.hide();
                // that.getElements.enlargebox.hide();
            })
            //滚动鼠标图片放大缩小
            that.getElements.enlarge.on('mousewheel DOMMouseScroll',function(e){
                //判断并设置鼠标滚轮的滚动方向，1代表向上，-1代表向下
                var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||// chrome & ie
                        (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox          
                var ratioL = (e.clientX - $(this).position().left) / $(this).width(),
                    ratioT = (e.clientY - $(this).position().top) /$(this).height();


                //定义放大缩小的系数
                var ratioDelta=0;
                if (delta > 0) {
                    // 向上滚，系数1.1
                    var ratioDelta=1.1;
                    console.log("wheelup");
                } else if (delta < 0) {
                    // 向下滚，系数0.9
                    var ratioDelta=0.9;
                    console.log("wheeldown");
                }
                w = parseInt($(this).width() * ratioDelta),
                h = parseInt($(this).height() * ratioDelta),
                l = Math.round(e.clientX - (w * ratioL)),
                t = Math.round(e.clientY - (h * ratioT));
                //如果图片的宽度已小于200将不再缩小
                if(w<200){
                    return false;
                }
                $(this).width(w);
                $(this).height(h);
                $(this).css({"left":l,"top":t});
                return false;
            })
            //移动鼠标图片跟随移动
            that.getElements.enlarge.on('mousedown',function(e){
                var that=$(this);
                var disX = e.clientX - $(this).position().left;
                var disY = e.clientY - $(this).position().top;
                $(document).on('mousemove',function(e){
                    var w = e.clientX - disX;
                    var h = e.clientY - disY;
                    that.css({"left":w,"top":h});

                })
                $(document).on('mouseup',function(e){
                    $(document).off("mousemove mouseup");
                })
                return false;               
            })    
        }

    }
    $.fn.Zoomfn = function() {
        //生成实例，this指当前调用的元素
        var zoomfn = new ZoomFunction(this);
        //调用插件方法
        return zoomfn.init();
    }

})(jQuery, window, document);


