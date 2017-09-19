/**
 * 获取新的图文验证码
 * @author yangjinlai 2017-02-17
 */

module.exports = function(){
	//var m = Math.random();
    // if( !window.twyzmId ){
    //     window.twyzmId = m;
    // }
    //$('.twyzm_img').attr('src', site_url.getTwyzm_api + window.twyzmId + '&timeStamp=' + new Date().getTime());
    $('.twyzm_img').attr('src', site_url.getTwyzm_api + Math.random());
}
