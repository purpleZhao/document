/**
 * 封装mui的tab切换
 * @author  yangjinlai 2017-03-03
 *
 * 例子见user/views/test.html
 */


;(function($, window, document,undefined) {
 

	var tabAction = function(opts) {

			//默认参数 
			this.defaults = {

				needNavAction: true, //需要导航滑动效果
				needBlock: false, //需要显示block节点
				wrapper: '', //容器节点
				navList: [], //导航数组
				contentList: [{
					id: '',
					content: ''
				}],
				contentLength: 3, 
				callback: $.noop()
			}

			this.options = $.extend({}, this.defaults, opts);
	}


	tabAction.prototype = {

		/*
			初始化
			进行弹层结构的生成并插入，绑定各事件等
		 */
		 init: function(){	
		 		var that = this;

		 		//生成结构并插入
		 		that.creatDom();

		 		//监听事件
		 		that.events();
		 },


		 /*
		 	生成弹层的DOM结构，并插入到body标签的最底部
		  */
		 creatDom : function(){
		 	var that = this;

		 	var html = '<div id="slider" class="mui-slider">';

		 	html += '<div class="nav-wrapper flexbox">';

		 	//添加导航
		 	html += '<div class=" mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">';

		 	//是否可以滑动
		 	if( that.options.needNavAction ){
		 		html += '<div class="mui-scroll manyItem tab-scroll-wrap">';
		 	}else{
		 		html += '<div class="mui-scroll tab-scroll-wrap">';
		 	}
		 			
		 	$.each( that.options.navList, function(i, el){
		 		html += '<a class="mui-control-item" href="#move_'+i+'" code='+el.code+'>'+el.type+'</a>';
		 	})
		 	html += '</div></div>';

		 	if( that.options.needBlock ){
		 		//需要显示block节点
		 		html += '<div class="block"></div>';
		 	}

			html += '</div>'; 	
			 	


		 	//添加切换区域

		 	html += '<div class="mui-slider-group tab-scroll-action">';

		 	for(var i = 0; i< that.options.contentLength; i++){

		 		html += '<div id="move_'+i+'" class="mui-slider-item mui-control-content">'+
		 				'<div id="scroll'+(i+1)+'" class="mui-scroll-wrapper" data-scroll="'+i+'">'+
		 				'<div class="mui-scroll">';

		 		$.each( that.options.contentList, function(j, el){
		 			if( el.id == i){
		 				html += el.content;	
		 			}
		 		})

		 		html += '</div></div></div>';
		 	}

		 	html += '</div></div></div>';

		 	//html += '</li></ul>';

		 	//添加到滚动容器里
		 	that.options.wrapper.append(html);

		 	$.each( $('.contentWrapper') ,function(i, el){
		 		$(el).attr('id', 'wrapper_'+i);
		 	})

		 	$('.tab-scroll-wrap a:first-child').addClass('mui-active');
		 	$('.mui-slider-group .mui-slider-item:first-child').addClass('mui-active');

		 	if ( !that.options.needNavAction ){
		 		//不需要导航滑动效果
		 		
		 		$('.tab-scroll-wrap').css('width','100%');

		 		var width = (100 / that.options.contentLength).toFixed(2);

		 		$('.tab-scroll-wrap a').css('width',width+'%').css('display', 'inline-block');
		 	}

		 	mui.init(); 
		 },

		 events: function(){
		 	var that = this;

		 	//监听mui的tab滑动事件
		 	document.getElementById('slider').addEventListener('slide', function(e) {

		 		console.log('当前索引    '+e.detail.slideNumber);

		 		//有内容，不执行
		 		if( $('.mui-scroll-wrapper').eq(Number(e.detail.slideNumber)+1).find('.listCont').hasClass('hasData') ){
		 			console.log('有内容，不执行');
		 			return false;
		 		}

		 		//callback应该是ajax请求数据，
		 		//调用callback函数，并传回e.detail.slideNumber
		 		//这个slideNumber是轮播mui-scroll-wrapper的索引，根据这个索引
		 		//可以将获取到的数据放入页面中
		 		that.options.callback( $('#scroll'+(Number(e.detail.slideNumber)+1) ));
		 	
		 	})
		 }
	}


	/*
	 * 给jQuery插件扩展elasticLayer方法
	 * 外部调用方式：$.elasticLayer(obj);
	 *
	 * 弹层在使用的时候初始化，因此初始化的时候只会有一个弹层
	 */
   $.extend($,{

   		tabScroll : function( options ) {

		   	//初始化弹层
			var tab_scroll = new tabAction(options);
			tab_scroll.init();
	      
	  	}
	})


})(Zepto, window, document);