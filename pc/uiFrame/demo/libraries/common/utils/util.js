/**
 * 所有页面都需要的基础函数
 * @author  yangjinlai  2016-11-21
 */
   

$.extend({

	util: {

		currentHref: window.location.href,  //当前页面地址

		objIsEmpty: function(data){

			//判断一个对象是否为空对象
			function isObjEmpty(obj){

				for(var i in obj){   
		 　　　　	return false; //如果不为空，则会执行到这一步，返回false
		 　　　 }
		　　 	return true; //否则返回true
			}

			//判断是否为函数
			function isFunction(data){
				//原生写法
				if(Object.prototype.toString.call(data) === "[object Function]"){
					//是函数，表示
					return true;
				}else{
					return false;
				}
				
				//jQ写法
				//if($.isFunction(data)){
					//是函数
				//}
			}

			//判断是否为数组
			function isArray(data){
				//原生写法
				if(Object.prototype.toString.call(data) === '[object Array]'){
					//是函数，表示
					console.log('数组');
					return true;
				}else{
					return false;
				}
			}

			//判断是否为字符串
			function isString(data){
				//原生写法
				if(Object.prototype.toString.call(data) === '[object String]'){
					//是函数，表示
					console.log('字符串');
					return true;
				}else{
					return false;
				}
			}

			//根据接口文档，该data不会为数字、字符串和函数
			//1. data为数字，字符串、函数，null或undefined，全部按没有数据处理
			if( !data || !isNaN(data) || isFunction(data) || isString(data)){ 
				return true;
			}
			//2. data为空数组
			if(isArray(data) && data.length == 0){
				return true;
			}

			//3. data为空对象
			if(isObjEmpty(data)){
				return true;
			}

			return false;

		},


		//从cookie中取值,name为cookie参数名
		getDataFromCookie: function(name){
			var arr = document.cookie.split("; "); 
			for(var i=0; i<arr.length; i++){ 
				var arr2 = arr[i].split("="); 
				if(arr2[0] == name){ 
					return arr2[1]; 
				} 
			} 
			return ""; 
		},

		//给数字添加千分位的逗号
		comdify: function(n){
			//n是传进来的需要添加千分位的数据，格式需要为字符串
			if(typeof n == 'number'){
				n = n + '';  //n如果为数字，转换成字符串
			}
			//添加千分位
			var re = /\d{1,3}(?=(\d{3})+$)/g;
		　　var n1 = n.replace(/^(\d+)((\.\d+)?)$/,
				function(s,s1,s2){
					return s1.replace(re,"$&,") + s2;
				}
			);
			//返回处理过的字符串
		　　return n1;
		},

		//正则表达式集合
		regList: {
			//去掉所有空格
			removeAllSpace: function(str){
				return str.replace(/\s/g, "")
			},

			//判断是否全是数字
			isAllNumber: function(str){
				var reg = /^[0-9]*$/;
				return reg.test(str);
			},

			//判断邮箱格式
			checkEmail: function(str){
				var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
				return reg.test(str);
			},

			//判断数字从0-9或是1-9
			checkNumber: function(str){
				var reg = /^[1-9][0-9]*$/;
				return reg.test(str);
			},

			//去掉中文和英文逗号
			removeComma: function(str){
				return str.replace(/,/g,'').replace(/，/g,'');
			},

			//把中文逗号改成英文逗号
			changeChinaComma: function(str){
				return str.replace(/，/g,',');
			},

			//判断是否是全部一样的数字
			isSameNumber: function(str, n){

				var re = new RegExp(n, 'g');

				if( str.match(re).length == str.length ){
				     //全是同样的字符
				     return true;
				}
				return false;
			},

			//判断字符串格式是否超出汉字/英文字母包括大小写/·/空格/下划线,用于姓名校验
			isNameCheck : function(str){
				var reg_1 = /[\u4e00-\u9fa5]/g;
				var reg_2 = /[_]|[·]|[\s]/g;
				var reg_3 = /[_]|[·]|[a-zA-Z]|[\s]/g;

				if( str.replace(reg_1, '').length != 0){
					//不是只有中文
					if( str.replace(reg_3, '').length != 0){
						return false;
					}
				}
				//var reg = /[\u4e00-\u9fa5]|[_]|[·]|[a-zA-Z]|[\s]/g;
				return true;
			},
			
			//留下所有数字和第一位的.，去掉其他字符
			onlyNumberDian: function(str){

				//去掉非数字和.
				str = str.replace(/[^\d.]/g, '');

				if( !str ){
					return str;
				}else{
					var s_1 = str.match(/\d+.{1}/g);
					if( s_1 ){
						s_1 = s_1[0];
						var s_2 = str.match(/\d+.{1}\d{0,2}/g);
						if( s_2){
							s_2 = s_2[0];
							return s_2;
						}else{
							return s_1;
						}
					}
					else{
						return str;
					}
				}
			}

		}

	}
	
})