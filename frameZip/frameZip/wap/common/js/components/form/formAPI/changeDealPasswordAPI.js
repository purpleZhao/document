/**
 * 校验原交易密码是否正确接口
 */

//黑色提示条的显示和隐藏
var tipAction = require('../../tipAction.js');

module.exports = function( str ){

	var r = false; //默认设置为校验不通过

	var obj = [{
		url: site_url.checkOldDealPassword_api,
		data: {   
		  	hmac: "", //预留的加密信息 非必填项
		  	params:{
		       	oldPassword: str        //客户旧密码 必填项
		    }//请求的参数信息
		},
		needLogin: true,
		needDataEmpty: false,
		async: false, //同步
		callbackDone: function(json){
			r = true;
		},
		callbackFail: function(json){
			//输入错误，显示提示信息
			tipAction(json.msg);
		}
	}]
	$.ajaxLoading(obj);

	return r;
}