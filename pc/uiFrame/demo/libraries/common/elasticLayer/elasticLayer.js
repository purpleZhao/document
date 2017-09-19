/**
 * 弹出层插件
 * @author yangjinlai 
 * @time 2016-09-19
 *
 * 生成弹出层结构并插入到body标签的最底部
 * 在调用弹出层的地方插入，因此一次只会初始化一个弹出层
 * 如果一个页面有多个弹出层，需要时在传参时传入id
 * 
 * 
 *
 * 使用方式：
 * 引入本文件，调用$.elasticLayer(obj);
 * obj是传入的对象，格式：
 * obj = {
 * 		id : '' , //该弹层的id，不传的话，默认为 'elasticLayer'
 * 		title: '', //大标题，如果不传，默认为'弹层'
 * 		p: '', //弹层上显示的文案，因为不确定有几行文字，因此把所有文案放在一起传过来
 * 				格式：
 * 				'<p class="elastic_p">文字文字文字<span>变色文字变色文字</span>文字文字文字</p>'+
				'<p class="elastic_p">文字文字文字<span>变色文字变色文字</span>文字文字文字</p>'
				……

				文案放在p标签中，span标签内为变色文字
				不传的话，默认为空
		

		yesTxt: '确定' , //确定按钮的文案，不传默认为确定
		celTxt : '返回', //返回按钮的文案，不传默认为返回

 * 		callback : function(){ },  //确定按钮的回调函数，不传的话，为空函数
 * 		zIndex: 100, //z-index，不传的话，默认为100
 * }
 *
 *
 * 每个弹层提供了一个隐藏当前弹层的函数，给确定按钮的callback函数中使用，
 * 使用方式：
 * 向弹层内传参时：
 * callback: function(t){  //t为当前弹层
 * 		
 * 	    t.hide();   //直接调用
 * }
 *
 */

;(function($, window, document,undefined) {


	var Layer = function(opts) {

			this.$body = $('body'),  //body元素

			//默认参数
			this.defaults = {
				id : 'elasticLayer', //弹层的唯一id 不传默认为elasticLayer，如果多个弹层的话要传，否则区分不了
				title: '弹层',  //如果不传默认为'弹层'
				p: '', 
				// p1: {
				// 	txt_1 : '', //第一行的中间文字前半部分
				// 	sTxt : '', //第一行的灰色文字
				// 	txt_2 : '', //第一行的中间文字后半部分
				// },
				// p2 : {
				// 	txt_1 : '', //第二行的中间文字前半部分
				// 	sTxt : '', //第二行的灰色文字
				// 	txt_2 : '', //第二行的中间文字后半部分
				// },
				yesTxt : '确定' , //确定按钮的文案，不传默认为确定
				celTxt : '返回', //返回按钮的文案，不传默认为返回
				callback : $.noop,  //确定按钮的回调函数，默认为空(jQuery的空函数，仅仅想要传递一个空函数的时候可以使用)
				callbackCel: $.noop, //取消按钮的回调函数
				zIndex: 100 //该弹层的z-index，因为不知道有几个弹层和弹层顺序，不传默认为100
			}

			this.options = $.extend({}, this.defaults, opts);
	}

	Layer.prototype = {

			/*
				初始化
				进行弹层结构的生成并插入，绑定各事件等
			 */
		 init: function(){	
		 		var that = this;

		 		var $id = $('#'+that.options.id);
		 		if( $id.length != 0){
		   			//如果页面上已经有这个弹层了，删除弹出层，重新进行页面初始化
		   			$id.remove();
		   		}

		 		//生成结构并插入
		 		that.creatDom();

		 		//绑定确定按钮和关闭按钮事件
		 		that.celEvent();
		 		that.yesEvent();
		 },


		 /*
		 	生成弹层的DOM结构，并插入到body标签的最底部
		  */
		 creatDom : function(){
		 	var that = this;

		 	//弹层DOM结构
		 	var html = '<div class="elasticLayer" id="'+that.options.id+'" style="z-index:'+that.options.zIndex+'">'+
		 						//'<div class="elasticMask"></div>'+
		 						'<div class="elasticWrapper">'+
		 							'<div class="elasticMid">'+
			 							'<div class="elasticTxt">'+
			 								 '<p class="elasticTitle">'+that.options.title+'</p>'+that.options.p+
			 								// '<p class="elasticP1">'+that.options.p1.txt_1+'<span class="sTxt">'+that.options.p1.sTxt+'</span>'+that.options.p1.txt_2+'</p>'+
			 								// '<p class="elasticP2">'+that.options.p2.txt_1+'<span class="sTxt">'+that.options.p2.sTxt+'</span>'+that.options.p2.txt_2+'</p>'+
			 							'</div>'+	
			 							'<div class="elasticButtons">'+
			 									'<input type="button" class="elasticYes" value="'+that.options.yesTxt+'">'+
			 									'<input type="button" class="elasticCel" value="'+that.options.celTxt+'">'+
			 								'</div>'+
			 							'</div>'+
			 						'</div>'
		 						'</div>';

		 	that.$body.append(html);

		 	//that.$yes为该弹层的确定按钮
		 	that.$yes = that.$body.find('#'+that.options.id+' .elasticYes');
		 	//that.$cel 为该弹层的关闭按钮
		 	that.$cel = that.$body.find('#'+that.options.id+' .elasticCel');
		 	//文案中间的span变颜色
		 	that.$body.find('#'+that.options.id+' .elastic_p span').addClass('sTxt');

		 	that.new_e = new elas( that.$body.find('#'+that.options.id) );

		 },


		 /*
		 	绑定关闭按钮点击事件
		  */
		celEvent : function(){
			var that = this;
			that.$cel.on('click',function(){
				//关闭按钮事件即隐藏当前弹层
				$(this).parents('.elasticLayer').hide();
				//调用的是callback回调函数
				that.options.callbackCel( that.new_e );
			})
		},

		/*
			确定按钮事件
		 */
		yesEvent: function(){
			var that = this;
			that.$yes.on('click',function(){

				//调用的是callback回调函数
				that.options.callback( that.new_e );
			})
		},

		/*
			隐藏当前弹出层
		 */
		// hide: function(){
		// 	var that = this;

		// 	that.$yes.parents('.elasticLayer').hide();
		// }
	}





	//暴露可以操作弹层的方法
	var elas = function( $el ){
		this.options = $el;
	}

	elas.prototype = {

		//隐藏当前弹层
		hide: function(){
			this.options.hide();

		}
	}



	/*
	 * 给jQuery插件扩展elasticLayer方法
	 * 外部调用方式：$.elasticLayer(obj);
	 *
	 * 弹层在使用的时候初始化，因此初始化的时候只会有一个弹层
	 */
   $.extend({

   	elasticLayer : function(options) {

	   	//初始化弹层
		var layer = new Layer(options);
		layer.init();
	      
	  }
	})


})(jQuery, window, document);