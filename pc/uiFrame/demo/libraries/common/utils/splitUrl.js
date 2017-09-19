/**
 * 取得url地址的参数值  公用js
 * 返回一个包含当前地址中参数的数组
 */


module.exports = function(  ){

	var arg = [],
		url = [],
		path = window.location.href;

	//如果path中没有?，获取url会报错，所以要先判断一下
	if(path.indexOf('?') != -1){
		//有?的情况
		var s = path.substring(path.indexOf('?') + 1);

		var ss = s.split('&');
		
		for( var i = 0; i< ss.length; i++){

			var index = ss[i].indexOf('=');
			
			if( index != -1 ){
				
				if( !arg[ ss[i].substring(0, index) ] ){
					//地址栏url上可能有经过base64加密的参数，此处不处理
					arg[ ss[i].substring(0, index) ] = ss[i].substring( index+1 );
				}
			}


		}

	}

	return arg;

  	
};