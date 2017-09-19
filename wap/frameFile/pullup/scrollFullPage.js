/**
 * 基于iscroll4改造的插件
 * @author purpleZhao.
 * @version 2017-01-16.
 *
 */


/*
*调用此插件的时候需要保证几点要完全一致
*1，上拉加载的结构代码，样式可自己自定义
*<div id="pullUp">
    <span class="pullUpIcon iconfont"></span><span class="pullUpLabel"></span>
</div>
*
*2，下拉滚动区域加 id="scroller" 其父元素加 id="wrapper"这是iscroll本身的用法
* 
*3，如果有回到顶部功能，则需要在结构代码中引入回到顶部的代码
*
*   <!-- 回到顶部 -->
    <div class="upTop" id="goTop" style="display:none;">
        <span class="iconfont">&#xe74a;</span>
    </div>
    <!-- 回到顶部 -->
*/


;(function($, window, document, undefined) {

    /*
     * 给Zepto插件扩展slideFullPage方法
     * 外部调用方式：$.slideFullPage(obj);
     *
     *本插件涉及到2个功能
     *1，上拉加载更多
     *2，回到顶部
     *
     *使用方法：
     *在需要初始化下拉加载事件中添加方法
     *      var obj = {

                callback : function(){ //下拉分页的回调函数
                            that.upPage(); 
                } 

            }
            $.slideFullPage(obj);//弹出层初始化 
     *
     */
   $.extend($,{

        slideFullPage : function(options) {

            var page = function(opts) {

                //默认参数
                this.defaults = {

                    //isGoTop : true,//是否显示回到顶部

                    callback : $.noop,//加载更多回调  
                }

                this.options = $.extend({}, this.defaults, opts);
            }

            page.prototype = {

                //初始化
                init: function(){

                    var that=this;  

                    var myScroll,pullDownEl, pullDownOffset,pullUpEl, pullUpOffset,generatedCount = 0;
                    //初始化绑定iScroll控件 
                    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
                    window.addEventListener("load",that.loaded,false);

                 },

                 //点击事件
                 event:function(){
                    var that=this; 

                   // if( that.options.isGoTop == true) { //配置回到顶部变量为true时

                        $("#goTop").on("click",function(){

                            myScroll.scrollTo(0, 0);//回到顶部

                            $("#goTop").hide();//按钮隐藏
                            
                        })
                    //}

                 },



                /*
                    分页加载
                 */
                loaded: function(){
                    var that=this;  

                    pullUpEl = $('#pullUp');   
                    //pullUpOffset = pullUpEl.offsetHeight;
                    
                    /**
                     * 初始化iScroll控件
                     */

                    setTimeout(function(){
                        myScroll = new iScroll('wrapper', {
                            vScrollbar : false,//滚动条不现实
                            bounceLock : false,
                            onRefresh : function () {

                                if (pullUpEl.hasClass('loading')) {

                                    pullUpEl.className = '';
                                    //pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多0...';
                                }
                            },
                            onScrollMove: function () {

                                console.log( "this.y:"+this.y);

                                console.log("this.topOffset:"+this.topOffset);

                                console.log( "this.maxScrollY:"+this.maxScrollY);

                                console.log(this.y < (this.maxScrollY - 5) && !pullUpEl.hasClass('flip'));

                                if (this.y > 5) {
                                    //pullDownEl.className = 'flip';
                                    //pullUpEl.querySelector('.pullUpIcon').innerHTML = '&#xe602;'; 
                                    //pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手开始更新...';
                                    //this.minScrollY = 0;
                                } else if (  this.y < (this.maxScrollY - 5) && !pullUpEl.hasClass('flip')) {
                                    pullUpEl.addClass('flip');
                                    pullUpEl.find('.pullUpIcon').html('&#xe602;'); 
                                    pullUpEl.find('.pullUpLabel').html('松手开始更新...');
                                } 

                            },
                            onScrollEnd: function () {

                                if (pullUpEl.hasClass('flip')) {
                                    pullUpEl.removeClass('flip').addClass('loading');
                                    pullUpEl.find('.pullUpIcon').html('&#xe602;'); 
                                    pullUpEl.find('.pullUpLabel').html('拼命加载中...');
                                    $('#pullUp').css('visibility', 'visible');      

                                    //if( that.options.isGoTop == true) { //配置变量为true时
                                        //回到顶部按钮隐藏
                                         $("#goTop").hide();
                                    //} 

                                    setTimeout(function(){

                                        page.options.callback();//拉取数据执行回调
                                        myScroll.refresh();//重新渲染

                                    },600);

                                }

                                if( this.y < 0 ) { //上拉动作显示回到顶部按钮

                                    //if(that.options.isGoTop == true){

                                        $("#goTop").show();
                                        //console.log(this.y);

                                    //}

                                }else{//回到顶部按钮隐藏

                                    $("#goTop").hide();
                                    //console.log("this.y:" + this.y);
                                }
            
                            }
                        });
                    },1000 );
                },
            }

            //初始化
            var page = new page(options);
            page.init(); //初始化下拉刷新 

            page.event();//回到顶部
          
        }

    })


})(Zepto, window, document);