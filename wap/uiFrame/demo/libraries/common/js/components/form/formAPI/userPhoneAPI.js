/**
 * 忘记密码页面，获取联系人手机号
 */

//黑色提示条的显示和隐藏
var tipAction = require('../../tipAction.js');

//刷新图文验证码
var getTwyzm = require('../../getNewTwyzm.js');

//短信验证码倒计时
var timeCount = require('../timeCount.js');

module.exports = function(phone ){

	var r = '';

	//手机验证页面，需要获取联系人手机号
	var phoneObj = [{
	    url: site_url.userPhone_api,
	    data: {
	        hmac:"", //预留的加密信息     
	        params:{//请求的参数信息 
	            mobile_no_internet: phone,//注册手机号（登录账号） 
	            cust_type: $('body').find('.idType .selectCopy').attr('num') //客户类型1个人0机构 
	        }
	    },
	    async: false, //同步
	    needDataEmpty: false, 
	    needLogin: true, //判断登录状态
	    callbackDone: function(json){
	        
	        r = json.data.phone;

	        //将这个手机号设置到body标签上
	        $('body').attr('phoneVerify', json.data.phone);
	    },
	    callbackFail: function(json){
	        //显示错误提示

	        tipAction( json.msg );

	        getTwyzm();
	    }
	}]
	$.ajaxLoading(phoneObj);

	return r;

}