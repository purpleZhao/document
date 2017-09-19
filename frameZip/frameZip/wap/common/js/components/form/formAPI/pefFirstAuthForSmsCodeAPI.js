/**
 * 实名认证页面，获取短信验证码的接口-----鉴权第一步
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
		 hmac:"", //预留的加密信息    
		 params:{//请求的参数信息  
	 		custName: sessionStorage.name, //持卡人姓名 
			custIdNo: sessionStorage.idNum, //证件号码
			custIdType: sessionStorage.idTypeNum, //证件类型【参照备注】 
			bankName: sessionStorage.bankInfoTxt, //银行名称
			bankIdNo: sessionStorage.bankInfoNum, //银行代号 
			bankCardNo: sessionStorage.bankNum, //银行卡号
			mobileNo: $('[check=bankPhone]').val(), //预留手机号码 
			province: sessionStorage.province, //省份 
			city: sessionStorage.city, //市
			branchNo: sessionStorage.branchNo, //支行代码
			clientType: envType == 'wap' ? "wap" : 'wx', //客户端类型（微信）
			imgCode: $('[check=twyzm]').val(), //图文验证码
			//uid: String(window.twyzmId) //产生图文验证码页面的随机数
    	}
	};
	            	
	var realObj = [{
		url: site_url.sms_api,
		data: realData,
		needLogin: true,
		needDataEmpty: true,
		callbackDone: function(json){

			//$('.dxyzmBtn').css({color:"#bbb"}).addClass('countDown');//点击按钮变色

	        $('body').attr('serialNo', json.data.serialNo); //设置body的属性

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