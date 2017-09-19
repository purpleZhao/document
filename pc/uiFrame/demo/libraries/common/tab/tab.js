
//第一种tab切换
$('.tabType .tab').on('click', function(t){

	$(this).addClass('active').siblings('span').removeClass('active');

	var num = $(this).attr('num');

	$(this).parents('.tabType').find('.tabContent').hide().filter(function(){
		return $(this).attr('num') == num;
	}).show();

})
