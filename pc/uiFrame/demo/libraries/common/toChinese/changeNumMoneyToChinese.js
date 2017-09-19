/**
 * 数字对应的中文大写
 */
var changeNumMoneyToChinese = function (money, cnIntLast) {
  var cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字
  var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
  var cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
  //var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
  //var cnDecUnits = newArray("份","份","份","份");

  //var cnInteger = "整"; //整数金额时后面跟的字符

  var cnInteger = ""; //整数金额时后面跟的字符

  //var cnIntLast = "元"; //整型完以后的单位

  var maxNum = 999999999999999.9999; //最大处理的数字
  var IntegerNum; //金额整数部分
  var DecimalNum; //金额小数部分
  var ChineseStr = ""; //输出的中文金额字符串
  var parts; //分离金额后用的数组，预定义

  if (money == "") {
    return "";
  }	
  money = parseFloat(money);
	
  if (money >= maxNum) {
    //alert('超出最大处理数字');
	ChineseStr = '超出最大处理数字';
    return ChineseStr;
  }

  if (money == 0) {
	//数据是0时，输出 '零份'
    ChineseStr = cnNums[0] + cnIntLast + cnInteger;
    return ChineseStr;
  }

  money = money.toString(); //转换为字符串

  if (money.indexOf(".") == -1) {
	//没有小数点，是整数
    IntegerNum = money;
    DecimalNum = '';

  } else {
	//有小数点
    parts = money.split(".");  //分开整数和小数
    IntegerNum = parts[0];  //整数部分
	DecimalNum1 = parts[1].substr(0, 4);
    DecimalNum = parts[1].substr(0, 4);  //小数部分
	//去掉小数部分末尾的0
	for(var i = DecimalNum1.length-1 ; i >= 0 ; i--){
		if(DecimalNum1.charAt(i)==0){
			DecimalNum = parts[1].substr(0, i);

		}else{ 
			break;
		}
	}

  }

  if ( parseInt(IntegerNum, 10) > 0) { //获取整型部分转换
    var zeroCount = 0;
    var IntLen = IntegerNum.length;

    for (var i = 0; i < IntLen; i++) {
      var n = IntegerNum.substr(i, 1);
      var p = IntLen - i - 1;
      var q = p / 4;
      var m = p % 4;

      if (n == "0") {
        zeroCount++;
      } else {

        if (zeroCount > 0) {
          ChineseStr += cnNums[0];
        }
        zeroCount = 0; //归零
        ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        ChineseStr += cnIntUnits[q];
      }
    }
	
	if(DecimalNum != ''){
		//有小数
		ChineseStr += '点';  //在小数前面加上'点'
	}else{
		ChineseStr += cnIntLast;  //没有小数，直接加上单位
	}
    
    //整型部分处理完毕
  }

  if (DecimalNum != '') { //小数部分

    var decLen = DecimalNum.length;
    for (var i = 0; i < decLen; i++) {
      var n = DecimalNum.substr(i, 1);
      //if (n != '0') {
         //ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
		ChineseStr += cnNums[Number(n)]; //不要小数点后的单位了
     // }
    }
	ChineseStr += cnIntLast;  //小数后添加单位
  }

  if (ChineseStr == '') {
    ChineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (DecimalNum == '') {
    ChineseStr += cnInteger;
  }
  return ChineseStr;
 
}

module.exports = changeNumMoneyToChinese;