/**
 * 下拉列表，点击出现手机屏幕下方弹出滚动选择
 * @author yangjinlai 2017-02-15
 * 
 * @params: 
 * layer--选择器的层级
 * pickerList--需要显示的数据，格式是已经处理好的
 * source--点击出现选择器的元素，用于显示选择后的数据及其他一些操作
 * callback--选择数据后的回调函数，可用于显示数据或其他操作
 */


module.exports = function( layer, pickerList, source, callback){
	
	if( $('.mui-poppicker').length ){
		return false;
	}

	//$('.mui-poppicker').remove();

	//初始化
	var picker = new mui.PopPicker({
	    layer: layer, //层级数
	    buttons: ['取消','完成'], //选择器的取消、完成按钮的文案
	    setValue: function(){ //无需修改，选择器初始化后默认显示对应数据的代码

			if( source.hasClass('hasSelect')){
				if( layer > 1){
					//多级
					for( var i = 0; i < layer; i++){
						picker.pickers[i].setSelectedValue(source.attr('num_'+i));
					}
				}else{ 
					//单级
					picker.pickers[0].setSelectedValue(source.attr('num'));
				}
				
			}else{
				for( var i = 0; i < layer; i++){
					picker.pickers[i].setSelectedIndex(0);
				}
			}
	   },
	   addClass: function(){ //无需修改，选择器注销后，按钮旋转的效果
	   		source.parent().removeClass('mui-active');
	   }
	});
	
	//设置选择器的数据
	picker.setData(pickerList);
	
	//选择器选择数据后的操作
	picker.show(function(getSelectedItems){

		//选择的数据
	    var result = getSelectedItems,
		    str = '';

		//循环获取，并设置到对应的属性上
		$.each(result, function(i, el){
			str += el.text;  
			if( layer > 1){
				source.attr( 'num_'+i, el.value );
			}else{
				source.attr( 'num', el.value );
			}
		})
		
		//显示获取到的数据
		source.html(str).addClass('hasSelect');
		
		//隐藏并注销选择器
		picker.hide();
		picker.dispose();

		//执行回调函数
		if( callback ){
			callback(picker);
		}
		
	}) 
	
	//点击取消按钮的事件
	mui('.mui-poppicker').on('tap','.mui-poppicker-btn-cancel',function(){
		picker.hide();
		picker.dispose();
	})
}
