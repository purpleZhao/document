/**
 * 注册、忘记登录密码，获取短信验证码接口
 * 
 */


//黑色提示条的显示和隐藏
var tipAction = require('../../tipAction.js');
//刷新图文验证码
var getTwyzm = require('../../getNewTwyzm.js');
//短信验证码倒计时
var timeCount = require('../timeCount.js');

//当前页面地址
var windowHref = window.location.href;

if( windowHref.indexOf('phoneVerify.html') != -1 ){
  //忘记登录密码页面，获取联系人手机号
  var getUserPhone = require('./userPhoneAPI.js');
}


module.exports = function( phone ){

	//不同功能业务类型的值
	var typeArr = [10, 11, 1, 14, 15];

	if( windowHref.indexOf('register.html') != -1){
		//注册页面
		type = typeArr[0];
	}
	else if( windowHref.indexOf('phoneVerify.html') != -1){
		//找回密码页面
		type = typeArr[1];
	}
	else if( windowHref.indexOf('resetLinkPhone.html') != -1){
		//修改手机号
		type = typeArr[2];
	}

	else if( windowHref.indexOf('prvPayRansomTwo.html') != -1 ){
		//产品赎回
		type = typeArr[4];
	}

	//忘记登录密码页面，需要先获取联系人手机号
	if( windowHref.indexOf('phoneVerify.html') != -1 ){
	  	
	  	phone = getUserPhone( phone );
	  	if( !phone ){
	     	//phone是空的，说明userPhone_api失败了
	     	return false;
	  	}
	}

	//发送短信验证码
    var phoneCodeObj = [{
	        url: site_url.sms_api,
	        data: { 
		        hmac:"", 
		        params : {
		        	imgCode: $('input[check=twyzm]').val(), //图文验证码值
		          	phone : phone, //手机号码value值
		          	type : type, //修改手机号传值1.
		          	//custType: $('body').find('.selectCopy').attr('num') //客户类型
		        }
		    },
	        needDataEmpty: false,  //不需要判断data是否为空
	        //async: false, //同步
	        needLogin: true, //判断登录状态
	        callbackDone: function(json){

	            timeCount.timeCountDown(120, $('.dxyzmBtn'), 59);
	        },
	        callbackFail: function(json){
	            
	            timeCount.dxyzmReset();
	            tipAction(json.msg);

	            getTwyzm();
	        }

	    }]
    $.ajaxLoading(phoneCodeObj);
}