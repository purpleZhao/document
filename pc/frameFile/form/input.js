

//引入xssFilter及配置
var xssFilter = require('xssfilter');
var xssfilter = new xssFilter({
    matchStyleTag: false,
    matchScriptTag: false,
    removeMatchedTag: false,
    escape: true
});

(function($, window, document,undefined) {


    var checkFunc = function($el){
        
        this.$el = $el; //当前元素
        this.attrCheck = $el.attr('check'); //该元素的check属性值
        this.$body = $('body');

        //存放该元素的类别，下拉列表为select，input和textarea为inputAndText
        this.type = $el.attr('check').indexOf('select') != -1 ? 'select' : 'inputAndText';

        //存放该元素相关的其他元素
        this.siblingsEl = {
            iconfont : $el.siblings('.iconfont'),  //x
            error_tip : $el.siblings('.error-tip'), //错误提示
        }

        //相关class类名
        this.useClass = {
            focus: 'focus',  //获得焦点的class
            wrong: 'input_error', //错误时的class
        }

        //每个需要校验的元素的校验配置
        this.checkList = {

           'name' : {  //姓名  (风险评测中为联系人)
               checkEvent: [
                   {type: this.isEmpty , tip: '请输入姓名'}  
               ]
           },
           'address' : { //通讯地址，在结构input上限制了字数
               checkEvent: [ 
                   {type: this.isEmpty,tip: '请输入通讯地址'}
               ]
           },
           'careerTypeselect':{//职业类型
               checkEvent: [ 
                   {type: this.isEmpty,tip: '请选择您的职业类型'}
               ]
           }
       };
    }

    checkFunc.prototype = {

        init: function(){
            var that = this;

            //绑定统一的blur/focus/click 事件      
            that.bindEvents();
        },

        //页面初始化时，需要进行的操作
        openWindow: function(){
            var that = this;

            //如果有图文验证码，页面第一次打开时需要请求一次
            if(that.attrCheck == 'twyzm' || that.attrCheck == 'dlTwyzm'){
                that.getNewTwyzm();
            }
        },

        //绑定统一的blur/focus/click 事件      
        bindEvents: function(){
            var that = this;

            function blurEvent(){
                //输入框输入的信息为空时不校验
                // if (that.attrCheck == "startNum"&&that.$el.val().length == 0) {
                //   that.$el.next().html(that.$el.attr('startMoney')+"元起投")
                // }
                if((that.$el.val().length == 0) || that.$el.attr('needCheck') == 'false'){  
                    that.siblingsEl.iconfont.hide();
                    return false;
                }
                //如果离焦不校验
                // if (that.attrCheck == "startNum"&& Number(that.$el.val())>Number(that.$el.attr("maxnum"))) {
                //     that.$el.closest(".in_text").find(".error-tip ").hide();
                //     return false;
                // }
                // else if (that.attrCheck == "startNum"&&that.$el.val().length == 0) {
                // //现金宝转入金额为空校验 
                //     that.$el.next().html(that.$el.attr('startMoney')+"元起投")
                //      that.showError();
                // }else if(that.attrCheck == "takeOut"&&that.$el.val().length == 0){
                //     that.showError();
                // };
            
                //调用校验函数check
                //传递参数：
                //该元素的jquery节点，checkList中的checkEvent配置信息，'blur'字符串
                //身份证的输入框，走num_1的校验
                that.check(that.checkList[that.attrCheck], 'blur'); 

                //样式改变
                that.$el.removeClass(that.useClass.focus);
                that.siblingsEl.iconfont.hide();
            }

            //绑定blur/focus/iconfont  click事件 下拉列表不需要绑定
            if(that.type != 'select'){

                that.$el.on('blur', blurEvent);

                //为绑定输入框内x符号绑定事件
                that.siblingsEl.iconfont.on({

                    //鼠标放上，先解除$(el)的blur事件
                    //不解除的话，会先出发blur事件，导致有些浏览器不出发iconfont的点击事件
                    mouseover : function(e){
                        that.$el.off('blur',blurEvent);
                    },

                    //click事件，清除输入框内容
                    click : function(e){
                        //下拉列表没有这个功能，
                        if(that.attrCheck.indexOf('select') == -1){
                            that.$el.val('');
                          if (that.attrCheck == 'startNum') {
                            //针对现金宝转入，清楚内容时保留提示文本;
                            that.$el.next().html(that.$el.attr('startMoney')+"元起投");
                          }

                            //不是下拉列表的时候，才清空输入内容
                            //隐藏icon
                            $(this).hide();
                            if(that.siblingsEl.other_msg.attr('needDel') == 'true'){
                                that.siblingsEl.other_msg.html('').hide();
                            }
                          
                        }
                    },

                    //鼠标离开，再给$(el)绑定blur事件
                    mouseout: function(){
                        that.$el.on('blur',blurEvent);
                    }

                })

                //绑定focus函数
                that.$el.on('focus',function(){
                    //公募投资金额表单
                    if(that.$el.attr('check')=="investment_num" ||that.$el.attr('check')=="startNum" ) {
                      that.$el.attr('tip',false);
                    };
                    //公募赎回金额表单
                    if(that.$el.attr('check')=="gm_redemption_num") {
                      that.$el.attr({
                        gmtip1: 'false',
                        gmtip2: 'false',
                        gmtip3: 'false'
                      });
                    };
                    //样式改变
                    that.$el.removeClass(that.useClass.wrong).addClass(that.useClass.focus);
                    that.siblingsEl.error_tip.hide().html('');
                    that.siblingsEl.iconfont.show();
                });

            }else{ 
                //给下拉列表绑定click函数
                that.$el.on('click',function(e){
                  if (!$(this).hasClass("birthDay")) {
                    e.stopPropagation();
                  }
                    //样式改变
                    // that.$el.removeClass(that.useClass.wrong).addClass(that.useClass.focus);
                    that.siblingsEl.error_tip.hide();
                });
            }
        },

        //下拉列表校验
        selectCheck: function(checkListObj){
            var that = this;

            var num = that.$el.attr('num');
           
            //下拉列表是校验是否选择
            if(that.isEmpty(num)){
                //校验通过
                return num;
            }else{
                //校验不通过，显示错误信息
                that.showError();

                return false;
            }
        },

        //input和textarea校验
        inputCheck: function(checkListObj, type){
            var that = this;

            var str = that.$el.val(); //当前元素的输入值

            if(checkListObj.length == 0){
                //没有配置校验信息，不需校验
                return str;
            }

            var s_result = true, //存放是否所有校验都通过的结果
                obj = checkListObj.checkEvent; //对应的校验配置

            //循环obj，调用对应校验函数
            $.each(obj, function(i,s){

                var result = s.type.call(that, str, s.param, that.attrCheck);
                
                //校验结果的判断  
                if(!!result){
                    s_result = str;

                }else{
                  //未通过校验，显示错误信息
                  that.showError();
                
                  that.siblingsEl.error_tip.html(s.tip);
                  s_result = false;
                  return false;
                }        
            }) 

            if(!!s_result){ //所有校验都通过
                that.$el.removeClass(that.useClass.wrong);
                that.siblingsEl.error_tip.hide().html('');
            }

            //返回s_result
            return s_result;
        },


        //显示错误信息
        //下拉列表只把错误信息显示出来，输入框需要显示的同时设置对应的错误提示，这一步需要在
        //inputCheck里完成
        showError: function(){
            var that = this;

            //校验未通过
            console.log('校验未通过');

            //显示错误提示
            if(that.attrCheck.indexOf('password') != -1){
                 //不是密码类输入框
                if(that.$body.find('.newpassword_check').css('display') == 'none'){
                    that.siblingsEl.error_tip.css('top','66px');
                }else{
                    that.siblingsEl.error_tip.css('top','150px');
                }
            }
            //出生日期错误提示不加红色边框
            if (that.attrCheck != "birthDselect") {
             that.$el.removeClass(that.useClass.focus).addClass(that.useClass.wrong);//显示错误红色边框
            }
            that.siblingsEl.error_tip.show();//显示错误提示

        },

        //判断校验元素类型并进行分发
        check: function(checkListObj, type){
            var that = this;

            var str = '';

            //需要校验的时候
            var result = ''; //存放校验后的结果

            if(that.type == 'select'){ //如果是下拉列表
                result = that.selectCheck(checkListObj);
            }else{
                result = that.inputCheck(checkListObj, type);
            }

            var idNum = false;
            if( that.attrCheck == 'num_1' && that.$el.attr('numtype') == 'idNum'){
                //身份证时
               idNum = true;
            }
            
            if(!!result && (that.attrCheck == 'bankNum' || idNum)){
                //身份证和银行卡号去掉中间的空格
                result = $.util.regList.removeAllSpace(result);
            }

            return result;

        },

        //获得数据，不进行任何操作，用于获得回显数据
        getValue: function(elCheck){
            var that = this,
                $el = $('[check='+elCheck+']');

            if( $el.attr('check').indexOf('select') != -1){ 
              //如果是下拉列表
              return $el.attr('num');
            }else{
              //其他情况
              return $el.val();
            }

        },



        /***************************校验函数*********************************/
        /*
            所有校验函数，str参数为传进来的输入框的值
            校验通过，返回true
            校验不通过，返回false
         */


        /**
         * 是否为空的校验
         */
        isEmpty : function(str,$el){
            console.log('1.是否为空   str:'+str);
           
            //判断受益人是否为本人
              if ($el && $el.attr("flag") == "true") {
                return "noNeedCheck";
              }
            
            if(!str && str != '0'){
               if ($el && $el.attr("check") == 'startNum') {
                  $el.attr('sm',"0"); //判断转入金额的辅助条件
               } 
              
                return false;
            }
            return true;
        },


        /**
         * 确认新密码校验
         */
        isQrnpCheck : function(str){

            var password = $('input[check=loginPassword]').val();
            //var password = $('.newpassword-row input[needCheck=true]').val();
            if(str != password){
                //两个密码不一致
                return false;
            }
            return true;
        },

        isQrDealPassword: function(str){
          
            var password = $('input[check=dealPassword]').val();
            //var password = $('.newpassword-row input[needCheck=true]').val();
            if(str != password){
                //两个密码不一致
                return false;
            }
            return true;
        },

            
        /**
         * 邮箱 格式校验
         */
        isEmailCode : function(str){
            var that = this;

            var r = $.util.regList.checkEmail(str);
            if( !r){ //格式错误
                return false;
            }
            return true;

            //return that.emailCode(str);
        },

        /**
         * 我的积分  格式校验
         * @param  {[type]}  str [description]
         * @return {Boolean}     [description]
         */
        isPointCode : function(str){

        },

        /**
         * 身份证格式校验
         * @param  {[type]}  str [description]
         * @return {Boolean}     [description]
         */
        isIdCode : function(str){
            var that = this,
                Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];    // 加权因子   
                ValideCode = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];            // 身份证验证位值.10代表X   
            
            if(that.attrCheck == 'num_1' && that.$el.attr('numType') != 'idNum'){
                //不是身份证，不做此校验，直接返回true
                return true;
            }

            str = $.util.regList.removeAllSpace(str);  //先去所有空格

            /**  
              * 验证18位数身份证号码中的生日是否是有效生日  
              * @param idCard 18位书身份证字符串  
              * @return  
              */  
            function isValidityBrithBy18IdCard(idCard18){   
                var year =  idCard18.substring(6,10);   
                var month = idCard18.substring(10,12);   
                var day = idCard18.substring(12,14);   
                var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));   
                // 这里用getFullYear()获取年份，避免千年虫问题   
                if(temp_date.getFullYear()!=parseFloat(year)   
                      ||temp_date.getMonth()!=parseFloat(month)-1   
                      ||temp_date.getDate()!=parseFloat(day)){   
                        return false;   
                }else{   
                    return true;   
                }   
            }   

            /**  
             * 判断身份证号码为18位时最后的验证位是否正确  
             * @param a_idCard 身份证号码数组  
             * @return  
             */  
            function isTrueValidateCodeBy18IdCard(a_idCard) {   
                var sum = 0;    // 声明加权求和变量
                var lastId=a_idCard[17];                             
                if (a_idCard[17].toLowerCase() == 'x') {  
                    lastId = 10;                    // 将最后位为x的验证码替换为10方便后续操作  
                }   
                for ( var i = 0; i < 17; i++) {   
                    sum += Wi[i] * a_idCard[i];            // 加权求和   
                }   
                valCodePosition = sum % 11;                // 得到验证码所位置   
                if (lastId == ValideCode[valCodePosition]) {   
                    return true;   
                } else {   
                    return false;   
                }   
            }   

            /**  
           * 验证15位数身份证号码中的生日是否是有效生日   
           * @param idCard15 15位书身份证字符串  
           * @return  
           */  
            function isValidityBrithBy15IdCard(idCard15){   
                var year =  idCard15.substring(6,8);   
                var month = idCard15.substring(8,10);   
                var day = idCard15.substring(10,12);   
                var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));   
                // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
                if(temp_date.getYear()!=parseFloat(year)   
                      ||temp_date.getMonth()!=parseFloat(month)-1   
                      ||temp_date.getDate()!=parseFloat(day)){   
                        return false;   
                }else{   
                    return true;   
                }   
            }  

            if (str.length == 15) {   //15位的
                //进行15位身份证的验证
                return  isValidityBrithBy15IdCard(str);

            } else if (str.length == 18) {   
                //var a_idCard = idCard.split("");   

                if(isValidityBrithBy18IdCard(str) && isTrueValidateCodeBy18IdCard(str)){   
                    //进行18位身份证的基本验证和第18位的验证
                    return true;   
                }else {   
                    return false;   
                }  
            }
        },


        /*
            字符串长度校验（调用数字校验）
         */
        isLength: function(str,leng){
            var that = this;
            console.log('手机号格式校验（调用数字校验）   str:'+str);

            if(str.length != leng.length){
                return false;
            }
            return true;
        },

      
        // 手机号格式校验（调用数字校验）
       format:function(str){
          var reg = /^[0-9.,]*$/;
          return reg.test(str);
       },

        /*
            转入金额输入格式校验
         */
        isAllNumber: function(str){
            var that = this;
            var r = $.util.regList.isAllNumber(str);
            if( !r){ //格式错误
                return false;
            }

            return true;

            //return that.numberCode(str);
        },


        /**
         * 密码校验
         * str---传入进来的输入框的值
         * 
         * 根据对应的情况判断
         * 校验通过，返回true
         * 校验不通过，返回false
         */
        isPassCheck : function(str){
            var that = this,
                check = that.$body.find('.password-check'),
                ac_length = check.find('.active').length,
                length = check.find('span').length;
            
            if(ac_length != length){ 
                return false; 
            }
            return true;
        },


        /**
         * 是否含有空格校验
         */
        isHasSpace : function(str){
            var that = this;
            
            var newStr = $.util.regList.removeAllSpace(str);
            if(newStr.length != str.length){
                //有空格
                return false;
            }
            return true;
        },

        /*
            校验图文验证码是否正确
            @params str 图文验证码输入框的值
         */
        isTwyzmCheck : function(str,param,check){
            var that = this;
            //成功后校验图文验证码是否正确
            var twyzmCheck = true; 

            var data = {
                        hmac: "",
                        params: {
                            checkCode: str
                        }
                    };

            if($.ajaxSetting.needJSON){
                data = JSON.stringify(data);
            }

            $.ajax({ 
                url: site_url.checkTwyzm_url,
                data: data,
                type: 'POST',
                dataType: 'JSON',
                async: false, //同步
                contentType : $.ajaxSetting.contentType,
                success: function (json) {
                    if(json.status == '1'){ //输入错误
                        //twyzmCheck设为false
                        twyzmCheck = false;
                        //重新请求验证码，发送输入框的check属性值
                        that.getNewTwyzm();
                    }
                    //输入成功，不做操作
                },
                error: function() {

                }
            })
            return twyzmCheck;
        },

        /*
            赎回数据判断
         */
        isNumSmall: function(str, $el, bigNum){
            var that = this;

            if(Number(str) == bigNum){
                //全部赎回时不做校验
                return true;
            }
            if(Number(str) < 10000){
                $el.val('10,000');
                that.siblingsEl.other_msg.show().html(changeNumMoneyToChinese(10000, '份'));
                return false; 
            }
            return true;
        },

        /*
            判断是否超过最大赎回份额,最高投资金额
         */
        isNumBig: function(str, $el, bigNum){
            var that = this;

            if(Number(str) == bigNum){
                //全部赎回时不做校验
                return true;
            }

            if ($el.attr("isTransfer") == "1") {
               return true;
            }
            if(Number(str) > bigNum){
                if($el.attr('check')=="investment_num") {//公募投资金额
                   $el.attr('tip',true);
                };
                $el.attr('sm',"0");
                return false; 
            }

            return true;
        },
        //判断是否超出单日最大限额
         oneDayNum: function(str, $el,bigNum,oneNum){
            var that = this;

            
            if(Number(str) > oneNum){
                if($el.attr('check')=="investment_num") {//公募投资金额
                   $el.attr('tip',true);
                };
                $el.attr('sm',"0");
                return false; 
            }
            return true;
        },
        /*
            判断赎回份额格式——私募
         */
        isRedempCode: function(str, $el, bigNum){
            var that = this;
            if (($el.attr("check") == "startNum" || $el.attr("check")=="takeOut")&& /,/g.test(str)) {
                  $el.attr('sm',"0")
                  return false;
            }
            if(isNaN(Number(str))){
                //不是数字
                $el.attr('sm',"0")
                return false;
            }
            if (/^(0\.)[0-9]{1,2}$/.test(str)) {
              
               return true;
            }
            if (/(\.)$/.test(str)) {
              $el.attr('sm',"0")
              return false;
            }
            var l = str.replace(/\b(0+)/gi,"");
            if(l[0] != str[0]){
                //字符串前面有0
                if (Number($el.val()) != 0) {
                     $el.attr('sm',"0")
                     return false;
                }
            }
            if (str<0) {
              $el.attr('sm',"0")
              return false;
            };
            // $el.val(Number($el.val()).toFixed(2));是否保留两位小数
            return true;
        },
        /*
            判断赎回份额格式——公募
         */
        isGmRedempCode: function(str, $el, bigNum){
            var that = this;

            if(isNaN(Number(str))){
                //不是数字
                return false;
            }
            if (str<=0) {
              return false;

            };
            var l = str.replace(/\b(0+)/gi,"");
            if(l[0] != str[0]){
                //字符串前面有0
                return false;
            }
            return true;
        },
      

        /*
            判断赎回份额是否是一万的整数倍
         */
        isRedemMath: function(str, $el, bigNum){
            var that = this;

            if(Number(str) == bigNum){
                //全部赎回时不做校验
                return true;
            }

            //判断是否是一万的整数倍
            var r = Number(str)/10000+'';
            if(r.indexOf('.') != -1){
                return false;
            }
            return true;
        },

        /*
            赎回份额是否小于1000000
         */
        isRedemSurplus: function(str, $el, bigNum){
            var that = this;

            if(Number(str) == bigNum){
                //全部赎回时不做校验
                return true;
            }
            //判断赎回份额是否小于1000000
            if(bigNum - Number(str) < 1000000){
                return false;
            }
            return true;
        },

        /*
            公募最低起投金额10000元
         */
        isMinimum: function(str, $el){
            var that = this;
            //判断投资金额是否小于10000或者其他值
            if (that.attrCheck == 'startNum' && Number(str)<Number(that.$el.attr('startMoney'))) {
                    $el.attr("sm","1");
                    return false;
            }else if(that.attrCheck != 'startNum'&& Number(str) < 10000){
                return false;
            }
           
            return true;
        },
      
        //转出金额须大于0元
        isZero :function(str,$el){
          if (str == 0) {
            return false;
          }
          return true;
        },
        //快速转出不能超过300万
        isThreeM :function(str,$el){
          var that = this;
          if (that.$el.attr("quickTakeOut")=="true" && (Number(str)>3000000)) {
            return false;
          }
         
          return true;
        },
        /*
            公募判断客户输入金额是否超过两位小数
         */
        isTwodecimal: function(str,$el){
          var that = this;
          var arr=str.split(".");
          if(arr[1]){
            if (arr[1].length>2) {
              $el.attr('sm',"0")
              return false;

            }else{
              return true;
            }
          }else{
            return true;
          }
        },

         /*
            赎回数据判断，
         */
        isGmNumSmall: function(str, $el, bigNum,tradeLimitVal,enMinshare){
            var that = this;

            if(Number(str) == bigNum){
                //全部赎回时不做校验
                return true;
            }
            if(Number(str) < tradeLimitVal){
                $el.attr('gmtip1',true);
                return false; 
            }
            return true;
        },

        /*
            判断是否超过最大赎回份额
         */
        isGmNumBig: function(str, $el, bigNum,tradeLimitVal,enMinshare){
            var that = this;

            if(Number(str) == bigNum){
                //全部赎回时不做校验
               
                return true;
            }
            if(Number(str) > bigNum){
                $el.attr('gmtip2',true);
                return false; 
            }
          
            return true;
        },

        /*
            赎回份额是否小于1000000
         */
        isGmRedemSurplus: function(str, $el, bigNum,tradeLimitVal,enMinshare){
            var that = this;

            if(Number(str) == bigNum){
                //全部赎回时不做校验
                return true;
            }
            //判断赎回份额是否小于最低持有份额enMinshare
            if(bigNum - Number(str) < enMinshare){
                $el.attr('gmtip3',true);
                return false;
            }
            return true;
        },


        /*
            理财师工号若为空不做校验,若不为空需为6位数字
         */
        isPlanners: function(str,leng){
            var that = this;
            var r = $.util.regList.isAllNumber(str);
            if(!str){//为空不做校验
                return 'noNeedCheck';
            }
            if(str.length != leng.length){//长度校验
                return false;
            }
            if( !r){ //调用数字校验
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


        /*
            短信验证码校验、提交校验之前的处理
         */
        beforeCheck: function( el ){
            var that = this;

            var r = '',
                obj = el.checkObj,  //获取实例
                huiXian = false;

            if( el.checkEl.attr('needCheck') == 'true'){
                //需要做校验 
                r = obj.check(obj.checkList[obj.attrCheck]);  //调用校验
            }else{
                //后期修改成不需要校验（如回显数据）,直接获取
                r = obj.getValue( el.checkAttr );
                huiXian = true;
                //return true;
            }

            return [r, huiXian];
        },

        //短信验证码按钮点击
        dxButtonPost: function(data){
            var that = this,
                checkArr = [],
                cross=false;//判断是否跨域变量，默认不跨域，忘记交易密码及添加银行卡页面需要跨域

            /*短信验证码发送后倒计时*/
            var timeCountDown = function (time,$id,voiceTime) {

                //var that = this;
                
                var timeInterval = setInterval(function(){
                    time--;
                    if(time == 0){
                        $id.attr('disabled',false)
                            .css({background:"#fff",color:"#7d7c7d"})//点击按钮变色
                            .html("重新获取验证码")
                            .removeClass('timeout'); //回复默认未点击状态颜色
                        //0秒时
                        clearInterval(timeInterval);

                        that.siblingsEl.dx_button.siblings('.voice').hide();

                        //that.getElements.voice.hide();
                    }
                    else{
                        $id.html( time + "秒后重新获取").addClass('timeout');
                    }
                },1000);
            }

            if( that.siblingsEl.dx_button.attr('checkTop') == 'true'){
                //需要校验上面的元素
                $.each(allInputArr, function(i, el){

                    if(el.checkIndex < dxIndex){  //在短信验证码前面的

                        var b_r = that.beforeCheck( el );

                        if( !b_r[1] ){  //如果不是回显数据
                          if(!!b_r[0]){  //通过校验
                              if(b_r[0] == 'noNeedCheck'){
                                b_r[0] = '';
                              }
                              checkArr.push({ //添加到checkArr中
                                  check : el.checkAttr,
                                  result: $.trim(xssfilter.filter(b_r[0]))
                              })
                          }else{
                              checkArr = false;
                              return false;
                          }
                        }else{
                          checkArr.push({ //添加到checkArr中
                              check : el.checkAttr,
                              result: b_r[0]
                          })
                        }
                        //return checkArr;
                    }
                })


                if(!checkArr){
                    //未通过校验
                    return false;
                }else{

                    if( that.siblingsEl.dx_button.attr('redem') == 'true'){
                        //赎回的
                        that.dxRusltPhone = that.siblingsEl.dx_button.attr('phone');
                    }else{
                        if(window.location.href.indexOf('realName.html') != -1){
                            $.each(checkArr, function(i,el){
                                if(el.check == 'name'){
                                    that.dxName = el.result; //姓名
                                }
                                if(el.check == 'select'){
                                    that.dxIdSelect = el.result; //证件类型
                                }
                                if(el.check == 'num_1'){
                                    that.dxId = el.result; //证件号码
                                }
                                if(el.check == 'bankselect'){
                                    that.dxBankNum = el.result; //开户银行代号
                                    that.dxBankName = $('body').find('[check='+ el.check+']').html(); //开户银行名称
                                }
                                if(el.check == 'bankNum'){
                                    that.dxbankId = el.result; //银行卡卡号
                                }
                                if(el.check == 'shengFen_select'){
                                    that.dxShengfen = el.result; //省份
                                }
                                if(el.check == 'city_select'){
                                    that.dxCity = el.result; //城市
                                }
                                if(el.check == 'branch_select'){
                                    that.dxBranch = el.result; //发卡行支行
                                }
                                if(el.check == 'phone'){
                                    that.dxPhone = el.result; //银行预留手机号
                                }
                                if(el.check == 'twyzm'){
                                    that.dxTwyzm = el.result; //图文验证码
                                }
                                if(el.check == 'dlTwyzm'){
                                    that.dxTwyzm = el.result; //图文验证码
                                }
                            })
                        }else if(window.location.href.indexOf('addCard.html') != -1||window.location.href.indexOf('findDealPwd.html') != -1){
                          $.each(checkArr, function(i,el){
                                if(el.check == 'bankselect'){
                                    that.dxBankNum = el.result; //开户银行代号

                                    that.dxBankName = $('body').find('[check='+ el.check+']').html(); //开户银行名称
                                }
                                if(el.check == 'branch_select'){
                                    that.dxBranch = el.result; //发卡行支行
                                }
                                if(el.check == 'phone'){
                                    that.dxPhone = el.result; //银行预留手机号
                                }
                                if(el.check == 'bankNum'){
                                    that.dxbankId = el.result; //银行卡卡号
                                }
                                if(el.check == 'twyzm'){
                                    that.dxTwyzm = el.result; //图文验证码
                                }
                                if(el.check == 'dlTwyzm'){
                                    that.dxTwyzm = el.result; //图文验证码
                                }
                            })

                        }else{
                            $.each(checkArr, function(i,el){
                                if(el.check == 'phone'){
                                    that.dxRusltPhone = el.result;//获取手机号码value值
                                }
                            })
                        }

                    }
                }
            }

            //通过校验，或不需要校验

            //点击按钮变色
            that.siblingsEl.dx_button.attr('disabled',true).addClass('stopClick');

            if(window.location.href.indexOf('realName.html') != -1){
                data = {    
                    hmac:"", //预留的加密信息    
                    params:{//请求的参数信息 
                        custName: that.dxName, //持卡人姓名 
                        custIdNo: that.dxId,//证件号码
                        custIdType: that.dxIdSelect,//证件类型【参照备注】 
                        bankName: that.dxBankName, //银行名称
                        bankIdNo: that.dxBankNum,//银行代号 
                        bankCardNo: that.dxbankId,//银行卡号
                        mobileNo: that.dxPhone,//预留手机号码 
                        province: that.dxShengfen,//省份 
                        city: that.dxCity,//市
                        branchNo: that.dxBranch,//支行代码
                        clientType: "PC",//客户端类型
                        imgCode: that.dxTwyzm//图文验证码
                    }
                };
            }else if(window.location.href.indexOf('addCard.html') != -1){
                data = {    
                    hmac:"", //预留的加密信息    
                    params:{//请求的参数信息 
                        bankIdNo: that.dxBankNum,//银行代号 
                        bankCardNo: that.dxbankId,//银行卡号
                        mobileNo: that.dxPhone,//预留手机号码 
                        bankName: that.dxBankName, //银行名称
                        branchNo: that.dxBranch,//支行代码
                        stepId:"1", // 鉴权步骤Id
                        imageCode: that.dxTwyzm,//图文验证码
                        loginFlag:"1",// 登录标识
                    }
                };
                cross=true;

            }else if(window.location.href.indexOf('findDealPwd.html') != -1){
              data = {    
                    hmac:"", //预留的加密信息    
                    params:{//请求的参数信息 
                        bankIdNo: that.dxBankNum,//银行代号 
                        bankCardNo: that.dxbankId,//银行卡号
                        mobileNo: that.dxPhone,//预留手机号码 
                        imageCode: that.dxTwyzm,//图文验证码
                    }
                };
                cross=true;
            }else{
                data = { 
                    hmac:"", 
                    params : {
                      phone : that.dxRusltPhone, //手机号码value值
                      type : that.$body.attr('type') //修改手机号传值1.
                    }
                };
            }


            
            //发送ajax请求
            var phoneCodeObj = [{
                url: site_url.sms_url,
                data: data,
                needDataEmpty: false,  //不需要判断data是否为空
                async: false, //同步
                needLogin: true, //判断登录状态
                needCrossDomain: cross,//是否跨域
                callbackDone: function(json){
                    console.log("短信发送成功");
                    that.siblingsEl.dx_button.css({background:"#ccc",color:"#fff"});//点击按钮变色

                    if( window.location.href.indexOf('realName.html') != -1){
                        var data = json.data;
                        //实名认证的
                        that.siblingsEl.dx_button.attr('serialNo', data.serialNo);
                        //.attr('protocolNo', data.protocolNo);
                        timeCountDown(120, that.siblingsEl.dx_button, 59);
                    }else if(window.location.href.indexOf('findDealPwd.html') != -1||window.location.href.indexOf('addCard.html') != -1){
                        var data = json.data;
                        //忘记密码记录流水号和交易账号
                        that.siblingsEl.dx_button.attr('serialNo', data.serialNo).attr('tradeAcco', data.tradeAcco).attr('protocolNo', data.protocolNo);
                        timeCountDown(120, that.siblingsEl.dx_button, 59);

                    }else{
                        //调用timeCountDown()
                        that.siblingsEl.dx_button.siblings('.voice').show(); //出现发送语音验证码按钮
                        timeCountDown(120, that.siblingsEl.dx_button, 59);
                    }


                },
                callbackFail: function(json){
                    that.siblingsEl.dx_button.attr('disabled',false)
                        .removeClass('stopClick')
                        .html("重新获取验证码")
                        .removeClass('timeout')
                        .css({background:"#fff",color:"#7d7c7d"}); //回复默认未点击状态颜色

                    //显示服务器返回的错误提示
                    that.siblingsEl.error_tip.show().html(json.msg);
                }

            }]
            $.ajaxLoading(phoneCodeObj);
            
        },

        //语音验证码的点击
        yyButtonPost: function(){
            var that = this;

            //显示弹层
            var obj = {
                //id : '' , //该弹层的id，不传的话，默认为 'elasticLayer'
                title: '尊敬的客户', //大标题
                p : '<p class="elastic_p">是否通过手机号码<span>'+that.dxRusltPhone+'</span></p>'+
                                    '<p class="elastic_p">接收语音验证码？</p>',
               callback : function(){ //确定按钮的回调函数
                    var voiceObj = [{
                        url: site_url.voice_url,
                        data: { 
                            hmac:"", 
                            params : {
                              phone : that.dxRusltPhone,//手机号码value值
                              type : that.$body.attr('type') //业务类型 【10.用户注册 11.找回密码 1.修改手机号 14.实名认证】
                            }
                        },
                        needDataEmpty: false,
                        callbackDone: function(json){
                            $("#elasticLayer").hide();//弹出层消失
                            that.siblingsEl.dx_button.siblings('.voice').hide();
                        },
                        callbackFail: function(){
                            $("#elasticLayer").hide();//弹出层消失
                        }
                    }]
                    $.ajaxLoading(voiceObj);
               },  
               zIndex: 100, //z-index
            }
            $.elasticLayer(obj);//弹出层初始化

        },




        /************************************其他函数********************************/
        /**
         * 请求新的验证码并显示
         * @return {[type]} [description]
         */
        getNewTwyzm : function(){
            var that = this;

            that.siblingsEl.img.attr('src', site_url.getTwyzm_url+Math.random());
        },

        



        /**********************************其他监听事件的函数********************/

        /**
         *  登录密码输入时，输入情况判断
         */
        isPasswordFocus : function(param,check){
            var that = this;

            var value = that.$el.val();
                checkLength     = that.$body.find('.checkLength'),
                checkUpperCase  = that.$body.find('.checkUpperCase'),
                checkNum        = that.$body.find('.checkNum'),
                checkSymbol     = that.$body.find('.checkSymbol');

            //去掉四条判断信息的高亮
            that.$body.find('.newpassword_check span').removeClass('active');   

            var re_e = /[a-z]/g, re_e_b = /[A-Z]/g, re_n = /[0-9]/g,
                l = value.length;

            var re_e_l = 0, re_n_l = 0, re_e_b_l = 0;
            if(!!value.match(re_e)){
                re_e_l = value.match(re_e).length;
            }
            if(!!value.match(re_n)){
                re_n_l = value.match(re_n).length;
            }
            if(!!value.match(re_e_b)){
                re_e_b_l = value.match(re_e_b).length;
            }
            var re_e_num = re_e_l + re_e_b_l; //英文字母共同的长度
                
            //下面的四条判断颜色改变
            if (l >=  6 && l <=  12) {
                checkLength.addClass('active');
            }
            if(re_e_num >= 2){
                if (/[a-z]/.test(value) || /[A-Z]/.test(value)) {
                    checkUpperCase.addClass('active');
                }
            }
            if(re_n_l >= 2){
                if (/[0-9]/.test(value)) {
                    checkNum.addClass('active');
                }
            }
            
            //改变密码等级
            //highlight为等级变化的背景变色
            var $pwd = that.$body.find('.pwdStrenth');
            if(l >=  6 && l <=  12 && re_e_num >= 2 && re_n_l >= 2){
                if( re_e_num < 4 && re_n_l  == (l - re_e_num)){
                    //英文字母个数小于4，且其他都为数字----低 
                    $pwd.find('span').removeClass('highlight');
                    $pwd.find('.strenth1').addClass('highlight');
                }else if(re_e_num >= 4 && re_n_l  == (l - re_e_num)){
                    //四个字母以上的且其他为数字-----中
                    $pwd.find('span').removeClass('highlight');
                    $pwd.find('.strenth2').addClass('highlight');
                }else{
                    $pwd.find('span').removeClass('highlight');
                    $pwd.find('.strenth3').addClass('highlight');
                }
            }else{
               $pwd.find('span').removeClass('highlight');
            }
        },


        /**
         * 在字符串中按照模式在对应位置添加空格
         * @return {Boolean} [description]
         */
        isSplit: function(param,check,eType,eWhich){
            var that = this;

            var val = this.$el.val();

            //在字符串对应位置添加空格的函数
            var changeArr = function(val,num){
                var str = $.util.regList.removeAllSpace(val),
                      arr = str.split(""); //分拆成数组
                $.each(num,function(i,el){
                    arr.splice(el,0," "); //在对应位置添加空格
                })
                return $.trim(arr.join("")); //组合成字符串并返回, 要加trim，否则后面加一串空格，长度不正确
            }

            if(eType == 'focusin' || eType == 'focus' && val.indexOf(' ')!= -1){
                //focus时，如果字符串中有空格，不执行后面的
                //Chrome和IE是focusin
                //FF是focus
                return false;
                
            }
            //如果是空格，不执行后面的
            if(eWhich == 32){
                return false;
            }
            
            var v = changeArr(val,param);

            this.$el.val(v);  //重置输入框的值
        },


        /*
            赎回份额控制中文逗号改为英文，且添加千分位处理
         */
        isComdify: function(eWhich){
            var that = this;

            //如果输的是小数点，不做处理
            if(eWhich == '190' || eWhich == 188){
                return false;
            }

            var v = $.util.comdify($.util.regList.removeComma(this.$el.val()));

            this.$el.val(v);

            //if(eWhich == 188){
                //this.$el.val($.util.regList.changeChinaComma(this.$el.val()));
            //}
        },

    }

    
    var allInput = $('[needCheck=true]'), //所有需要校验的元素
        allInputArr = [], //存放所有元素的实例
        dxIndex = 0; //存放短信验证码元素的索引

    $.each(allInput, function(i, el){ //循环所有元素

        var newCheckInput = new checkFunc($(el)), //生成对应的新实例
            check = $(el).attr('check'); //该元素的check值

        allInputArr.push({ //添加到allInputArr中
            checkEl: $(el), //当前元素
            checkAttr: check, //check属性值
            checkIndex: i, //该元素索引
            checkObj: newCheckInput //该元素实例
        });

        if(check == 'dxyzm'){
            //短信验证码的索引
            dxIndex = i;
        }

        newCheckInput.init(); //调用init事件
    })
    console.log(allInputArr);


    $.extend({

        //点击提交按钮时调用
        //parentsDivClass是需要判断的区域div的class，如果没有传，
        //该参数为空，则校验所有的
        "checkInput": function( parentsDivClass ){
            var checkArr = []; //存放所有元素的校验结果

            //循环allInputArr
            $.each(allInputArr, function(i, el){

              var isInArea = false;

              if( !!parentsDivClass ){
                //需要判断区域
                if( $(el.checkEl).parents(parentsDivClass).length != 0){
                  //在这个区域内
                  isInArea = true;
                }
              }else{
                //不需要判断区域
                isInArea = true;
              }

              if( !isInArea){
                    //isInArea为false，表示当前元素不需要做校验，跳出循环
                    return true;
              }

              //需要做校验的情况
              
              var obj = el.checkObj, //获取实例
                    r = '', 
                    huiXian = false;


                var b_r = obj.beforeCheck( el );

                if( !b_r[1] ){  //如果不是回显数据
                  if(!!b_r[0]){  //通过校验
                      if(b_r[0] == 'noNeedCheck'){
                        b_r[0] = '';
                      }
                      checkArr.push({ //添加到checkArr中
                          check : obj.attrCheck,
                          result: $.trim(xssfilter.filter(b_r[0]))
                      })
                  }else{
                      checkArr = false;
                      return false;
                  }
                }else{
                  checkArr.push({ //添加到checkArr中
                      check : obj.attrCheck,
                      result: b_r[0]
                  })
                }

              // if(el.checkAttr == 'num_1'){
              //   //证件类型的时候，需要判断是身份证还是其他证件
              //   if( $(el.checkEl).attr('check') == 'idNum'){
              //     //身份证，修改当前的idNum
              //     el.checkAttr = 'idNum';
              //   }
              // }

              // if( el.checkEl.attr('needCheck') == 'true'){
              //   r = obj.check(obj.checkList[obj.attrCheck]);
              // }else{
              //   //后期修改成不需要校验（如回显数据）,直接获取
              //   r = obj.getValue( el.checkAttr );
              //   huiXian = true;
              //   //return true;
              // }

              // if( !huiXian ){  //如果不是回显数据
              //   if(!!r){  //通过校验
              //       if(r == 'noNeedCheck'){
              //         r = '';
              //       }
              //       checkArr.push({ //添加到checkArr中
              //           check : obj.attrCheck,
              //           result: $.trim(xssfilter.filter(r))
              //       })
              //   }else{
              //       checkArr = false;
              //       return false;
              //   }
              // }else{
              //   checkArr.push({ //添加到checkArr中
              //       check : obj.attrCheck,
              //       result: r
              //   })
              // }
            })
            return checkArr;
        },

    })

})(jQuery, window, document);


   








