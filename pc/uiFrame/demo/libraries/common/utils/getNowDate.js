/**
 * 获取指定日期，格式：YYYY-MM-DD
 *
 * 目前只有获取当天日期，获取其他日期功能待添加
 * 
 * @author  yangjinlai
 * @time 2016-09-27
 */

//获取当前时间，格式
//type==word时，单位为年月日
module.exports = function getNowDate(type) {
    var date = new Date();

    //设置单位
    var seperator1 = type == 'word' ? '年' : "-",
        seperator2 = type == 'word' ? '月' : "-",
        seperator3 = type == 'word' ? '日' : "";

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator2 + strDate + seperator3;
    return currentdate;
}

//获取前一天时间，格式YYYY-MM-DD
// function getPassFormatDate() {
//     var   today=new   Date();      
//       var   yesterday_milliseconds=today.getTime()-1000*60*60*24;    
//       var   yesterday=new   Date();      
//       yesterday.setTime(yesterday_milliseconds);      
//       var strYear=yesterday.getFullYear(); 
//       var strDay=yesterday.getDate();   
//       var strMonth=yesterday.getMonth()+1; 
//       if(strMonth<10)   
//       {   
//           strMonth="0"+strMonth;   
//       }   
//       var strYesterday=strYear+"-"+strMonth+"-"+strDay;
//     return strYesterday;
// }