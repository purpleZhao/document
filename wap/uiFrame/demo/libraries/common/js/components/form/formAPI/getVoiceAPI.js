/**
 * 发送语音验证码
 */

//弹层
var elasticLayer = require('../../elasticLayer.js');
//刷新图文验证码
var getTwyzm = require('../../getNewTwyzm.js');
//黑色提示条的显示和隐藏
var tipAction = require('../../tipAction.js');
//黑色提示条的显示和隐藏
var timeCount = require('../timeCount.js');

module.exports = function(){

	//获取手机号输入框的内容
	var typeArr = [10, 11, 1, 14, 15],
		phone = $('.phone input').val(),
		path = window.location.href,
		type = '';

	if( !!$('body').attr('phoneVerify') ){
		phone = $('body').attr('phoneVerify');
	}

	if( path.indexOf('register.html')  != -1 ){ 
		//注册
		type = typeArr[0];
	}else if( path.indexOf('phoneVerify.html')  != -1 ){ 
		//忘记登录密码
		type = typeArr[1];
	}else if( path.indexOf('resetLinkPhone.html') != -1 ){ 
		//设置--修改手机号
		type = typeArr[2];
	}
	// else if( path.indexOf('realNameStepTwo.html') != -1){
	// 	//实名认证
	// 	type = typeArr[3];
	// }
	else if( path.indexOf('prvPayRansomTwo.html') != -1){
		type = typeArr[4];
	}

	//出现弹层
	var showObj = {
	    id : 'cancel' , //该弹层的id，不传的话，默认为 'elasticLayer'
	    //title: '尊敬的用户', //大标题
	    p: '<p class="elastic_p">是否通过手机号<span class="sTxt">'+phone+'</span>接收语音验证码？</p>',
	    yesButtonPosition: 'right',                
	    callback : function(t){ //确定按钮的回调函数

	        t.$yes.attr('disabled', true).addClass('disable');

	        //发送语音验证码
	        var obj = [{
	            url: site_url.voice_api,
	            data: {    
	                hmac:"", //预留的加密信息    
	                params:{//请求的参数信息 
	                    phone: phone, //手机号码 
	                    imgCode: $('input[check=twyzm]').val(), //图文验证码
	                    type: type,  //业务类型 【10.用户注册 11.找回密码 1.修改手机号 14.实名认证 15.产品赎回】    
	                }
	            },
	            needLogin: true, 
	            needDataEmpty: false, //不需要判断data是否为空
	            callbackDone: function(){
	                t.hide();
	                t.$yes.removeAttr('disabled').removeClass('disable');
	            },
	            callbackFail: function(json){
	                t.hide();

	                t.$yes.removeAttr('disabled').removeClass('disable');

	                tipAction(json.msg);

	                getTwyzm();

	                timeCount.dxyzmReset();

	            }
	        }]
	        $.ajaxLoading(obj);
	    },  
	    zIndex: 100, 
	}
	$.elasticLayer(showObj);
}