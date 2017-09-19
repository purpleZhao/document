/**
 * mui 回到顶部
 */

//初始化上拉下拉事件监听
mui.init({
    gestureConfig:{
	   swipeup: true, //默认为true
	   swipedown: true, 
    }
});


//监听按钮的点击动作
mui("body").on('tap', '.goTopBtn', function(){

    if( $(this).siblings('.form-wrap').length ){
        //基金公告页面
        $(this).siblings('.form-wrap')[0].style.webkitTransform="translate3d(0px, 0px, 0px) translateZ(0px)";
        $(this).siblings('.form-wrap')[0].style.webkitTransform='2500ms';

    }else if( $(this).parents('.payMX').find('.contentWrapper').length ){
        //公募交易明细页面
    	$(this).siblings('.contentWrapper')[0].style.webkitTransform="translate3d(0px, 0px, 0px) translateZ(0px)";
        $(this).siblings('.contentWrapper')[0].style.webkitTransform='2500ms';  
    
    }

    else if( $(this).parents('.payTheme').length ){
        //我的账户 accountMerge.html页面
        $(this).siblings('.scrollList')[0].style.webkitTransform="translate3d(0px, 0px, 0px) translateZ(0px)";
        $(this).siblings('.scrollList')[0].style.webkitTransform='2500ms';  
    }
       
    else{
        //其他页面
        $(this).siblings('.mui-table-view')[0].style.webkitTransform="translate3d(0px, 0px, 0px) translateZ(0px)";
        $(this).siblings('.mui-table-view')[0].style.webkitTransform='2500ms';
    }



    $(this).hide();
});

