
$('.goTop').on('click', function(){
	//回到顶部
	$('body').animate({
		scrollTop:0
	})
	//Firefox兼容
	var a_interval = setInterval(function(){
		document.documentElement.scrollTop -= 60;
		if(document.documentElement.scrollTop <= 0){
			clearInterval(a_interval);
		}
	},10);
})