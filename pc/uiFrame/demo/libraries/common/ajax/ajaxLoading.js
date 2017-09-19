/**
 * ajax请求的封装
 * @author  yangjinlai  
 * 
 * 参数说明：
 * 1. obj是传进来的ajax发送请求的配置，是一个数组，里面每一条数据都是一个对象，对应一个ajax请求，
 * 		数组里有几个对象，就会发几个请求
 * 	  obj格式：
 * 	  var obj = [
	 * 	  {
	 * 	  	url: site_url.banner_url,
	        data: {
	            ……
	        },
	        callbackDone: function(){},
	        callbackFail: function(){},  
	        ……
	 * 	  },
	 * 	  {
	 * 	  	url: site_url.banner_url,
	        data: {
	            ……
	        },
	        callbackDone: function(){},
	        ……
	 * 	  },
	 * 	  ……
 * 	  ]
 * 2. headAjax标识是否是头部的接口，传true意思为头部，不传或者传其他值表示不是头部接口
 *    accountLeft标识是否是我的资产-左树的接口，true-是，false或不传-不是
 *    在判断整个页面的ajax初始化请求是否完成时，会根据headAjax和accountLeft判断是否有头部/左树接口
 *
 * 
 * obj中，每一条数据(ajax请求)的默认参数说明：
 *  url: '', //接口地址
	data: {}, //需要传给接口的数据
	type: 'POST', //post/get
	dataType: 'JSON', 
	async: true, //true-异步  false-同步
	needLogin: false, //发送请求时，需要判断登录是否过期  true-需要，false-不需要，默认false
	needCrossDomain: false,  //true-跨域, false-不跨域，默认false
	needDataEmpty: true, //需要判断data是否为空  true-需要  false-不需要，默认true
	needLoading: false, //不需要显示loading遮罩  true-需要，false-不需要，默认false
	
	callbackDone: function(){},  
	//接口成功的回调函数（如果needDataEmpty=true，则需要判断data.data是否为空，如果为空，不调用
	callbackDone，而调用callbackNoData） 
	
	callbackFail: function(){},  
	//请求失败，或接口成功但data.status=1时的回调函数
	
	callbackNoData: function(){}   
	//接口成功，但data.data没有数据时的回调函数（此时needDataEmpty=true）


 * 									 
 * 3个函数：
 * 1. ajaxFunc  发送请求
 * 2. sendAjax  循环obj 调用ajaxFunc，发送每一次的请求
 * 3. isEmpty 判断data.data是否为空
 *
 * 
 * 本插件使用方式：
 * $.ajaxLoading(obj);  
 * 
 * 
 */

  
;(function($) {


	$.extend($,{

		ajaxLoading : function(param){
			
			//默认配置
			var defaults = {
				url: '',
			    data: {}, 
		        type: 'POST',
		        dataType: 'json',
		        async: true, //true-异步  false-同步
		        needCrossDomain: false,  //true-跨域, false-不跨域
		        callbackDone: function(){},
		        callbackFail: function(){},
		        callbackNoData: function(){},

		        //formData
		       	formData: false //判断是否需要使用formData上传
		    };

		    //合并配置
		    var obj = [];
		    $.each(param,function(i,el){
		    	obj.push($.extend({}, defaults, el));
		    })


			//发送ajax请求
			var ajaxFunc = function(obj){

				var ajax = $.Deferred();  //声明一个deferred对象

				//设置ajax请求的contentType  data数据添加JSON.stringify
				var contentType =  'application/json; charset=UTF-8',
					
					data = !obj.formData ?  JSON.stringify(obj.data) : obj.data; 

				if(obj.needCrossDomain){
						//obj.needCrossDomain为true
					ajax = $.ajax({
  							url: obj.url,
		      				data: data,
		      				contentType : contentType,
		      				type: obj.type,
		      				dataType: obj.dataType,
		      				async: obj.async,
		      				//跨域需要以下配置
					       	jsonp: "callback",
						    jsonpCallback: 'callback',
						    crossDomain:true,
						    //这段代码不能注释，否则跨域时cookie带不过去
						    xhrFields:{   
							   withCredentials: env != 0 ? true : false   
						    },
						    headers:{
						    	"X-Requested-With": 'XMLHttpRequest',
						    },
			  			});

				}else if ( obj.formData ){
					//使用formData格式上传
					ajax = $.ajax({
	      				url: obj.url,
				      	data: data,
				      	contentType : contentType,
				      	type: obj.type, 
				      	dataType: obj.dataType,
				      	async: obj.async,
				      	contentType : false, 
				      	processData: false
				  	})  
				}else{
					//不使用formData格式上传
					ajax = $.ajax({
	      				url: obj.url,
				      	data: data,
				      	contentType : contentType,
				      	type: obj.type, 
				      	dataType: obj.dataType,
				      	async: obj.async,
				  	})  
				}
					

			  	ajax.done(function(data){

			  		//该接口请求成功
		  			//执行成功的回调函数
		  			obj.callbackDone(data);
			  	})

			  	//ajax错误的情况
			  	ajax.fail(function(data, result, msg){

			  	})
				
				return ajax;
			}


			//循环调用ajaxFunc，
			//发送ajax请求前后的各种逻辑，
			//判断页面初始化请求是否全部成功
			var sendAjax = function(){

				var dtd = $.Deferred(); // 新建一个deferred对象


				var length = obj.length, //当前ajax请求的数量
					arr = 0; //存放已成功的请求数量

				//循环obj数组
				$.each(obj,function(i,el){

					
					//调用ajaxFunc，发送ajax请求
					var ar = ajaxFunc(el);

					//ajax请求之后的处理
					ar.fail(function(){
						//ajax请求不成功的时候
						//手动将dtd置为reject
						dtd.reject();
				  	})
				  	.done(function(){
				  		//ajax请求成功，arr+1
				  		arr  += 1;
				  		if(length == arr){  //如果所有接口都已发送完毕
			  				dtd.resolve();
			  			}
				  	})
				})

				//监听dtd的状态，进行遮罩loadiing处理
				$.when(dtd)
		  		.fail(function(){
		  			//失败状态
		  			console.log('失败了');
		  		})
		  		.done(function(){
		  			//成功状态
					console.log('ajax请求全部成功')
		  		})
			}

			//调用sendAjax，发送请求
			sendAjax();

		},

	})

})(Zepto);

 

