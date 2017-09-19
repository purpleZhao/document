/**
 * 展开收起动作 js
 */

//zepto模块--callback
require('../../../include/js/vendor/zepto/fx.js'); 

var actionBtn = function(){  
	var $actionBtn;

	// 兼容页面有tab切换，有多个actinBtn,选择当前active状态下的actionBtn
	if ( $('.mui-slider-item.mui-active .actionBtn').length > 0 ){
		$actionBtn = $('.mui-slider-item.mui-active .actionBtn')
	} else {
		$actionBtn = $('.actionBtn')
	}

	//声明节点
	var $this = $actionBtn,
		//$actionWrap = $this.parents('.openWrap').find('.actionWrap'),
		$actionWrap = $this.siblings('.actionWrap'),		
		$list = $actionWrap.find('.actionList');
		
	if( !$actionWrap.attr('height') && !$this.attr('h')){

		//第一次点击，获取未展开前容器的高度
		$actionWrap.attr('height', $actionWrap.height());

		$actionWrap.find('.hide').show();

		var h = 0;

		$.each( $list, function(i, el){

			//计算子元素的高度
			h += $(el).height();
		})

		$actionWrap.attr('h', h);
	}


	if( $this.hasClass('active') ){
		//有active class时，说明是打开状态，需要隐藏
		$actionWrap.animate({
			height: $actionWrap.attr('height')+'px'
		}, 'slow','ease-out',function(){
			$this.removeClass('active');
		})
	}else{
		//隐藏状态，需要打开
		$actionWrap.animate({
			height: $actionWrap.attr('h')+'px'
		}, 'slow','ease-out', function(){
			$this.addClass('active');
		})	
	}
}

//绑定点击事件
$(document).on('click', '.actionBtn', function(){
	actionBtn();
})


module.exports = actionBtn;