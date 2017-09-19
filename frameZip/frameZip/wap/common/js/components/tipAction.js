/**
 * 黑色提示条的显示和隐藏
 * @author yangjinlai  2017-02-16
 */

//这里已经将html结构代码生成并插入到页面上，所以页面代码中不需要加这一段结构
var html = '<div class="againEnter"><p class="tipWrapper"></p></div>'; 

if($('body').find('.againEnter').length != 0){
	$('.againEnter').remove();
}

$('body').append(html);

//msg为黑色提示条需要显示的文案
//callback为倒计时2s后，黑色提示条隐藏，需要执行的回调函数
module.exports = function( msg, callback ){
	$('.againEnter').show().find('.tipWrapper').html(msg);
	setTimeout(function(){
        $('.againEnter').hide();
        
        if ( callback ){
        	callback();
        }
        
    }, 2000);
}

