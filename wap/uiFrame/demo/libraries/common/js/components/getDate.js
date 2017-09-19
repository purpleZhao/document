/**
 * 获取日期
 * @author  yangjinlai 2017-03-16
 */

//获取当前时间，格式
//num, type为需要计算的月份数和向前或是向后计算，比如一个月前，传1，before
//一年后，传12, after
//num如不传，则不计算，只返回当天日期
//type如不传，则默认按向前计算

module.exports = function( num, type){
	
	var date = new Date(),
		year = date.getFullYear(),   //当前年份
		month = date.getMonth() + 1, //当前月份
		strDate = date.getDate(),  // 当前日期
		seperator1 = "-";
    
    //处理月份
    var month_1 = month;
    if (month >= 1 && month <= 9) {
        var month_1 = "0" + month;
    }

    //处理日期
    var date_1 = strDate;
    if (strDate >= 0 && strDate <= 9) {
        date_1 = "0" + strDate;
    }

    //今天日期
    var currentdate = year + seperator1 + month_1 + seperator1 + date_1,
    	resultDate = '';

    if( num ){
    	//需要计算
    	if( type == 'after'){ //向后
    		var month_2 = month + num; //月份+
    		if( month_2 > 12){ //超过一年
    			month_2 = num - (12 - month);
    			year++; //年份+1
    		}
    		var day_2 = new Date(year, month_2, 0).getDate(),
    			date_2 = strDate;
    		if (date_2 > day_2) {
    		        date_2 = day_2;
		    }
		    if( date_2 < 10){
		    	date_2 = '0' + date_2;
		    }
		    if (month_2 < 10) {
		        month_2 = '0' + month_2;
		    }
		    resultDate = year + seperator1 + month_2 + seperator1 + date_2;
    	}else{
    		//向前
    		var month_2 = month - num; //月份+1
    		if( month_2 < 1){ //超过一年
    			month_2 = month + (12 - num);
    			year--; //年份-1
    		}
    		var day_2 = new Date(year, month_2, 0).getDate(),
    			date_2 = strDate;
    		if (date_2 > day_2) {
    		        date_2 = day_2;
		    }
		    if( date_2 < 10){
		    	date_2 = '0' + date_2;
		    }
		    if (month_2 < 10) {
		        month_2 = '0' + month_2;
		    }
		    resultDate = year + seperator1 + month_2 + seperator1 + date_2;
    	}
    }

    return {
    	currentdate: currentdate,
    	resultDate: resultDate
    }
}


