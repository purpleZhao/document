/*
 *公私募风险测评通用验证题目是否全部选择组建
 *
 * 
 */

var test = {
	ischeck : function(){
		$('.queryQuestion .choice').each(function(){
		    var ischecked = $(this).find('input[type=radio]:checked').length;
		    //console.log("ischecked:"+ischecked);
		    if(ischecked == '0'){
		    	var indexNo = $(this).find('.index').text();
                that.getElements.errorTip.show();
                that.getElements.errorTip.find(".tipWrapper").html("请选择第" + indexNo + "题答案");//登录超时提示
		    	window.location.href = "#"+indexNo;
		    	
                setTimeout(function(){
                    that.getElements.errorTip.hide();//提示消失                              
                },2000)
                
		    	return false;
		    }else{
		    	that.getElements.errorTip.hide();
		    }
		});

	}	
}