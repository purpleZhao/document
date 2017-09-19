/**
 * mui轮播图
 */

var Slider = function( $el, imgArr ){

	//开始生成结构
	var html = '<div id="slider" class="mui-slider" style="height:100%;">',
		htmlEnd = '</div>';

	//图片结构
	var imgHtml = '<div class="mui-slider-group mui-slider-loop" style="height:100%;">';
	//点结构
	var dotHtml = '<div class="mui-slider-indicator">';

	imgHtml += '<div class="mui-slider-item mui-slider-item-duplicate">'+
			'<a href="'+imgArr[imgArr.length-1].linkUrl+'" style="height:100%;">'+
			'<img src="'+imgArr[imgArr.length-1].imgUrl+'" style="height:100%;"></a></div>';
	
	$.each( imgArr , function(i, el){ 

		imgHtml += '<div class="mui-slider-item" style="height:100%;">'+
				'<a href="'+el.linkUrl+'" style="height:100%;">'+
				'<img src="'+el.imgUrl+'" style="height:100%;">'+
				'</a></div>';
		//点
		dotHtml += '<div class="mui-indicator"></div>';
	})

	imgHtml += '<div class="mui-slider-item mui-slider-item-duplicate">'+
			'<a href="'+imgArr[0].linkUrl+'" style="height:100%;">'+
			'<img src="'+imgArr[0].imgUrl+'" style="height:100%;"></a></div>';
	imgHtml += '</div>';

	dotHtml += '</div>';

	//把生成的整体结构插入到$el中
	$el.append( html + imgHtml + dotHtml + htmlEnd);

	//为第一张图片和第一个点添加mui-active class
	$('.mui-slider-group .mui-slider-item').eq(0).addClass('mui-active');
	$('.mui-slider-indicator .mui-indicator').eq(0).addClass('mui-active');


	//初始化轮播
	mui.init({ 
		swipeBack: true //启用右滑关闭功能
	});
	var slider = mui("#slider");
	slider.slider({
		interval: 4000  //4s一张
	});
}