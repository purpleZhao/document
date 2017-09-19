/**
 * 添加history的处理，用于监听离开页面的判断，并监听离开页面的事件，弹出确认框
 * @author yangjinlai 2017-02-14
 * @params: 
 */

//var Base64 = require('../../../include/js/vendor/base64/base64.js');

//txt为传进来的弹层上显示的文案
//originUrl:程序执行完要去url地址
//type自定义参数，可传可不传，主要用于页面间传参使用
module.exports = function( txt , originUrl ,type){
	
	//pushState方法需要的参数
	var state = {  
	    title: "title",  
	    url: "?"  
	};  

    //在当前页面上加s=随机数
    if( window.location.href.indexOf('?s') == -1){

        if(window.location.href.indexOf('type') == -1){

            window.history.pushState(state, "title", "?s=" + Math.random(0,16)  + '&originUrl=' + originUrl);
              
        }
        else{

            window.history.pushState(state, "title", "?s=" + Math.random(0,16)  + '&originUrl=' + originUrl + '&type=' + type);
  
        }
    }

        

    //此时页面路径变为带?s的，但页面内容不会改变
    
    //监听popState事件
    window.addEventListener("popstate", function(e) {  


        if( window.location.href.indexOf('?s=') != -1 ){
            //弹层出现后，将页面路径回退到了带?s的，会再次触发此事件，为了防止
            //再次出现弹层，这里做一个判断，直接return false
            return false;
        }

        //此时有改变
        //出现是否离开当前页面的弹层
        var showObj = {
            id : 'confirmAway' , //该弹层的id，不传的话，默认为 'elasticLayer'
            p: '<p class="elastic_p">' + txt + '</p>',
            //yesButtonPosition: 'right',
            callback : function(t){
                //确认离开
                t.hide();
                //由于出现弹层后，将页面路径回退到了带?s的，
                //返回来时的页面需要使用go(-2)
                
                //当前是实名认证页面时，清除sessionStorage
                if( window.location.href.indexOf( 'realNameStepOne.html' ) != -1){
                    sessionStorage.removeItem('name'); 
                    sessionStorage.removeItem('idTypeNum'); 
                    sessionStorage.removeItem('idTypeTxt'); 
                    sessionStorage.removeItem('idNum'); 
                    sessionStorage.removeItem('bankNum'); 
                    sessionStorage.removeItem('bankInfoNum'); 
                    sessionStorage.removeItem('bankInfoTxt'); 
                    sessionStorage.removeItem('province'); 
                    sessionStorage.removeItem('city'); 
                    sessionStorage.removeItem('branchNo'); 
                    sessionStorage.removeItem('branchTxt'); 
                    sessionStorage.removeItem('hasData'); 
                }

                window.history.go(-2);
            },
            callbackCel: function(t){
                //取消离开
                t.hide();
            },
        }
        $.elasticLayer(showObj);


        //出现弹层后，此时页面路径为不带?s的，将路径回到带?s的，防止用户再次点击返回按钮，
        //导致直接退出页面
        window.history.forward(-1);
        
    })

	
	

}

