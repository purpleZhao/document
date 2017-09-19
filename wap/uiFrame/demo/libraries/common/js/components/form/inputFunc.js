/**
 * input.js中的校验函数list
 */


//引入xssFilter及配置
var xssFilter = require('xssfilter');
var xssfilter = new xssFilter({
    matchStyleTag: false,
    matchScriptTag: false,
    removeMatchedTag: false,
    escape: true
});


//当前页面地址
var windowHref = window.location.href;

//刷新图文验证码
var getTwyzm = require('../getNewTwyzm.js');


//黑色提示条的显示和隐藏
var tipAction = require('../tipAction.js');


//校验原交易密码接口
if( windowHref.indexOf('changeDealPassword') != -1 ){
	//当前是设置网站交易密码界面
	//require判断原交易密码接口
	var changeDealPasswordAPI = require('./formAPI/changeDealPasswordAPI.js');
}

module.exports = {

	  //是否为空的校验
    isEmpty : function(str){
        console.log('1.是否为空   str:'+str);
        if(!str && str != '0'){
            return false;
        } 
        return true;
    },

    //字符串长度校验  
    isLength: function(str,leng){
        var that = this;
        console.log('手机号格式校验（调用数字校验）   str:'+str);

        if(str.length != leng.length){
            return false;
        }
        return true;
    },

    //确认新密码校验
    isQrnpCheck : function(str){

      var that = this;

        if( that.attrCheck == 'qrnp' ){
          //新登录密码
          var password = $('input[check=newLoginPassword]').val();

        }else if( that.attrCheck == 'qrNewDealPassword'){
          //新交易密码
          var password = $('input[check=newDealPassword]').val();
        }
        else if( that.attrCheck == 'qrDealPassword'){
          //确认交易密码
          var password = $('input[check=newDealPassword]').val();
        }
        //var password = $('.newpassword-row input[needCheck=true]').val();
        if(str != password){
            //两个密码不一致
            return false;
        }
        return true;
    },


    //校验原交易密码
    isCheckOldDealPassword: function(str){
      var that = this;

      return changeDealPasswordAPI(str);

    },


    //是否全数字
    isAllNumber: function(str){
        var that = this;

        var r = $.util.regList.isAllNumber(str);
        if( !r){ //格式错误
            return false;
        }
        return true;
    },


    //判断输入的姓名的格式
    isNameCheck: function(str){
    	var that = this;
        var r = $.util.regList.isNameCheck(str);
        if( !r){ //格式错误
            return false;
        }
        return true;
    },

    /*
      是否是全部一样的字符
     */
    isSameNumber: function(str){
       var that = this;

       var beginNum = str.charAt(0); //第一个字符

       var r = $.util.regList.isSameNumber( str, beginNum );

       if(r){
          return false;
       }
       return true;
    },


    /*
        是否是全连续数字
     */
    isContinuityNumber: function(str){
        var that = this;

        var strArr = str.split(''),
            beginNum = Number(strArr[0]),
            result = true,
            plus = 0;
            minus = 0;

        $.each( strArr, function(i,el){
            if( i > 0){
                if ( el == (beginNum + 1) ){
                    //自加的
                    plus++;  //index自加
                    beginNum = Number(el);

                }
            }
        })
        var l = str.length-1;

        if( plus == l ) {
          //全自加
          return false;
        }else{
          $.each( strArr, function(i,el){
              if( i > 0){
                  if ( el == (beginNum - 1) ){
                      //自减的
                      minus++;  //index自加
                      beginNum = Number(el);
                  }
              }
          })
          if( minus == l ){
            //全自减 
            return false;
           }
        }
        return true;
    },

    /**
	               * 密码校验
	               * str---传入进来的输入框的值
	               * 
	               * 根据对应的情况判断
	               * 校验通过，返回true
	               * 校验不通过，返回false
	               */
	        isPassCheck: function (str) {
	            var that = this,
	                check = $('body').find('.password-check'),
	                ac_length = check.find('.active').length,
	                length = check.find('span').length;

	            var re_e = /[a-z]/g,
	                re_e_b = /[A-Z]/g,
	                re_n = /[0-9]/g,
	                l = str.length;

	            var re_e_l = 0,
	                re_n_l = 0,
	                re_e_b_l = 0;
	            if (!!str.match(re_e)) {
	                re_e_l = str.match(re_e).length;
	            }
	            if (!!str.match(re_n)) {
	                re_n_l = str.match(re_n).length;
	            }
	            if (!!str.match(re_e_b)) {
	                re_e_b_l = str.match(re_e_b).length;
	            }
	            var re_e_num = re_e_l + re_e_b_l; //英文字母共同的长度

	            //改变密码等级
	            //highlight为等级变化的背景变色
	            var $pwd = $('body').find('.pwdStrenth');
	            if (l >= 6 && l <= 12 && re_e_num >= 2 && re_n_l >= 2) {
	                //通过校验
	                return true;
	            } else {
	                //没有通过校验
	                return false;
	            }
	        },

    /*
        校验图文验证码是否正确
        @params str 图文验证码输入框的值
     */
    isTwyzmCheck : function(str,param,check){
        var that = this;
        //成功后校验图文验证码是否正确
        var twyzmCheck = true; 

        var obj = [{
          url: site_url.checkTwyzm_api,
          data: {
            hmac: "",
            params: {
                checkCode: str,
               // uid: String(window.twyzmId)
            }
          },
          type: 'POST',
          dataType: 'json',
          async: false, //同步
          needDataEmpty: false,
          callbackDone: function(json){

            // //输入成功，不做操作
          },
          callbackFail: function(json){
            //twyzmCheck设为false
            twyzmCheck = false;
            //重新请求验证码，发送输入框的check属性值
            getTwyzm();
          }
        }]
        $.ajaxLoading(obj);
        return twyzmCheck;

    },


    

    //获得数据，不进行任何操作，用于获得回显数据
    getValue: function( elCheck ){
        var that = this,
            $el = $('[check='+elCheck+']');

        if( that.type != 'select' ){ 

          return $el.val();

        }else{
          //如果是下拉列表
          return $el.attr('num');
        }
          

    },

}