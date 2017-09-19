/**
 * 退出登录按钮点击
 */

require('./elasticLayer.js');
require('./tipAction.js');

mui("body").on('tap', '.quiteBtn', function(){

	var showObj = {
        //id : 'confirmAway' , //该弹层的id，不传的话，默认为 'elasticLayer'
        //title: '尊敬的用户', //大标题
        p: '<p class="elastic_p">您是否确定要退出登录？</p>',
            //yesButtonPosition: 'right',
            callback : function(t){
            	//确认离开  
    			t.hide();
			
    			//退出登录
    			$.get('/apis/wap/user/logout.action', function( json ){

                    if( json.status == 0){
                        //退出登录成功，跳到登录页
                        window.location.href = site_url.login_html_url;
                    }else{
                        //退出登录失败
                        tipAction(json.msg);
                    }
                    
                });
    	    },  
           	callbackCel: function(t){
       			//取消离开
       		    t.hide();
       		},
      	zIndex: 100, //z-index
    };
    $.elasticLayer(showObj);
})