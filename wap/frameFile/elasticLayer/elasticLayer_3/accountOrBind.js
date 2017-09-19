/**
 * 立即绑定/暂不绑定   立即开户/暂不开户  弹层js
 * @author  yangjinlai 2017-03-31
 */

//黑色提示条
 var tipAction = require('./tipAction.js');
 var Base64 = require('../../../include/js/vendor/base64/base64.js'); 
 require('./elasticLayerTypeTwo.js');


 function getStatus( type ){ 

    //判断当前是企业还是个人
    var obj=[{
        url: site_url.user_api,
        data: {    
            hmac:"", //预留的加密信息     
            params:{    
              //uuid: sessionStorage.getItem('uuid') //'EE7CA9386715CBF3BAB30CD479697D72' //sessionStorage.getItem('uuid') //客户Id,打开登录页面链接带过来的参数uuid
            }
        },
        needLogin: true,
        async: false, //同步
        needDataEmpty: false, //需要判断data是否为空
        callbackDone: function(json){

            if( json.data.custType == 0 ){
                //机构
                $('.elasticLayerThree').hide();
                var obj = {
                    p: '<p>机构账号暂不支持公募在线开户购买，请联系理财师</p>'
                }
                $.elasticLayerTypeTwo(obj);
            }
            else {
                //个人
                if( type == 'open'){
                    //立即开户
                    window.location.href = site_url.realNameStepOne_url + '?originUrl=' + new Base64().encode(window.location.href);
                }
                else if( type == 'bind'){
                    //立即绑定
                    var bindObj = [{
                        url: site_url.accountMerge_api,
                        data: {
                            hmac:"", //预留的加密信息
                            params:{//请求的参数信息
                            }
                        },
                        needLogin: true,
                        needDataEmpty: false,
                        callbackDone: function(json){
                            //绑定成功
                            $('.elasticLayerThree').hide();
                            tipAction('您已成功绑定公私募账号', function(){
                                //刷新我的页面
                                window.location.reload();
                            });
                        },
                        callbackFail: function(json){
                            $('.elasticLayerThree').hide();
                            tipAction( json.msg , function(){
                                $('.elasticLayerThree').show();
                            });
                        }
                    }]
                    $.ajaxLoading(bindObj);
                }
            }
        },  
        callbackFail: function(json){
            tipAction( json.msg );
        }
    }];
    $.ajaxLoading(obj);
 }

//点击公募开户
$('.openAccount .bind').on('click', function(){
    getStatus('open');
})

//点击立即绑定
$('.bindNow .bind').on('click', function(){
    getStatus('bind');
})

//点击暂不绑定/暂不开户，关闭按钮
$('.elasticLayerThree .noBind, .elasticLayerThree .close').on('click' , function(){
    $('.elasticLayerThree').hide();
})



