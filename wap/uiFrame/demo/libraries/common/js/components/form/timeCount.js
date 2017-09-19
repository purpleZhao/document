/*短信验证码发送后倒计时*/

function dxyzmBtnReset(){

    //短信验证码状态变回
    $('.dxyzmBtn').removeAttr('disabled')
            .removeClass('stopClick')
            .html("获取验证码")
            //.removeClass('timeout')
            .css({color:"#f4cf5c"});

            //.siblings('.voice').hide(); //回复默认未点击状态颜色

    //隐藏语音验证码
    //$('.noCode').hide();
    $('.noCode').removeClass('show');

    clearInterval(window.dx_timeInterval);
}

module.exports = {

    timeCountDown: function (time, $id, voiceTime, ) {

        $('.noCode').addClass('show');
        $('.dxyzmBtn').css({color:"#bbb"});
        //.addClass('countDown');

        window.dx_timeInterval = setInterval(function(){
            time--;
            if(time == 0){

                dxyzmBtnReset();
                //短信验证码按钮改变状态
                // $('.dxyzmBtn').css({color:"#f4cf5c"})//点击按钮变色
                //     .html("获取验证码")
                //     .removeClass('stopClick'); //回复默认未点击状态颜色

                // //0秒时
                // clearInterval(window.dx_timeInterval);
                //$('.time').siblings('.voice').hide();
                //$('.noCode').hide();
                //that.siblingsEl.yy_button.hide(); 
            }
            else{

                $('.dxyzmBtn').html( '重新获取('+time + ")");
                //.removeClass('countdown');
                //that.siblingsEl.dx_button.removeClass('countdown');
            }
        },1000);
    },

    dxyzmReset: function(){

        dxyzmBtnReset();

        
    }
}