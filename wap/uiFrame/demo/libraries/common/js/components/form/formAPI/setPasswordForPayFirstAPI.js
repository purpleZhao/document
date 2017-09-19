/**
 * 忘记网站交易密码 重置密码（发送短信验证码)
 */

//黑色提示条的显示和隐藏
var tipAction = require('../../tipAction.js');
//刷新图文验证码
var getTwyzm = require('../../getNewTwyzm.js');
//短信验证码倒计时
var timeCount = require('../timeCount.js');

module.exports = function( ){

	//实名认证页面
	var realData = {    
		 hmac:"",  //预留的加密信息    
		 params:{ //请求的参数信息  
		 	//发卡银行代码 必填项
 		    bankIdNo: $('.forgetForm').find('input[check=bankNum]').attr('bankIdNo'),
 		   	//银行卡号 必填项          
      		bankCardNo: $('.forgetForm').find('input[check=bankNum]').attr('bankAccount'), 
      		//手机号码 必填项
      		mobileNo: $('.forgetForm').find('input[check=bankPhone]').val(),               
    	}
	};
	            	
	var realObj = [{
		url: site_url.setPasswordForPayFirst_api,
		data: realData,
		needLogin: true,
		needDataEmpty: true,
		async: false, //同步
		callbackDone: function(json){

			$('body').attr('serialNo', json.data.serialNo); 

	        //$('.noCode').show(); //出现发送语音验证码按钮
	        timeCount.timeCountDown(60);

		},
		callbackFail: function(json){

			timeCount.dxyzmReset();
			tipAction( json.msg )
			//重置图文验证码
            getTwyzm();
		},
		callbackNoData: function(json){
			//data没有数据
		}
	}]
	$.ajaxLoading(realObj);
}