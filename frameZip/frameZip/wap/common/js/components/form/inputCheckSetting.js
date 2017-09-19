/**
 * input.js中表单校验配置list
 * @author  yangjinlai 2017-05-05
 */

var inputFunc = require('./inputFunc.js');

var inputList = {

     'phone' : { //手机号（不是银行预留手机号）
         checkEvent: [
             {type: inputFunc.isEmpty ,tip: '请输入11位手机号码'},  
             //type: inputFunc.isAllNumber, tip:'手机号码格式有误'},
             {type: inputFunc.isLength, tip:'请输入11位手机号码',param:{length:11}}
             //param:给函数传递长度参数
         ]
     },
     'twyzm' : { //图文验证码
         checkEvent: [
             {type: inputFunc.isEmpty ,tip: '请输入图文验证码'},
             //{type: inputFunc.isLength, tip:'请输入4位图文验证码',param:{length:4}},
             {type: inputFunc.isTwyzmCheck, tip:'图文验证码输入不正确，请重新输入',param:{checkTime: 'commit'}}
         ]
     },
     'dxyzm' : {  //短信验证码
         checkEvent: [
             {type: inputFunc.isEmpty ,tip: '请输入验证码'}
         ]
     },

     'newLoginPassword' : { //新登录密码
         checkEvent: [ //密码
             //{type: inputFunc.isDoublePass, tip: '密码不能为空'},
             {type: inputFunc.isEmpty,tip: '密码不能为空'},
             {type: inputFunc.isPassCheck, tip: '6-12位，至少包含2个数字，2个字母'},
             //{type: inputFunc.isHasSpace, tip: '密码不能包含空格'},
         ]
     },

     'qrnp' : { //确认登录密码
         checkEvent: [
             {type: inputFunc.isEmpty ,tip: '密码不能为空'},  
             {type: inputFunc.isQrnpCheck, tip:'密码输入不一致，请重新输入'}
         ]
     },
     'fina' :{ //理财师工号
          checkEvent: [
             
         ]
     },

     'loginPassword' : { //登录密码，登录页面使用
         checkEvent: [
             {type: inputFunc.isEmpty ,tip: '请输入密码'},
             //{type: inputFunc.isHasSpace, tip:'密码不能包含空格'}
         ]
     },
     
     //以下为公众号2.0版本新加校验
     'name': { //姓名
     		checkEvent: [
             {type: inputFunc.isEmpty , tip: '请输入您的姓名'},
             {type: inputFunc.isNameCheck , tip: '请输入真实姓名'},
          ]
     },
     
      'num_1' : { //证件号1
         checkEvent: [ 
             {type: inputFunc.isEmpty,tip: '请输入您的证件号码'},
             //{type: inputFunc.isIdCode, tip: '证件号码有误，请核实后重新输入'}
         ]
      },

      'orgName' : { //机构名称
         checkEvent: [ 
             {type: inputFunc.isEmpty,tip: '请输入机构名称'}
         ]
      },
      
      'bankNum': { //银行卡号
         checkEvent: [ 
             {type: inputFunc.isEmpty, tip: '请输入本人银行卡号'}
         ]
      },
      
      'bankPhone': { //银行预留手机号
      	checkEvent: [
             {type: inputFunc.isEmpty ,tip: '请输入11位银行预留手机号码'},  
             //{type: inputFunc.isAllNumber, tip:'手机号码格式有误'},
             {type: inputFunc.isLength, tip:'请输入11位手机号码',param:{length:11}}
             //param:给函数传递长度参数
          ]
      },

      'oldDealPassword': { //原交易密码
          checkEvent: [
             {type: inputFunc.isEmpty ,tip: '请输入网站原交易密码'},  
             {type: inputFunc.isCheckOldDealPassword, noTip: true},  
          ]
      },

      'qrDealPassword': { //确认交易密码
        	checkEvent: [
             {type: inputFunc.isEmpty ,tip: '密码不能为空'},  
             {type: inputFunc.isQrnpCheck, tip:'密码输入不一致，请重新输入'},
          ]
      },

      'newDealPassword': { //新交易密码
          checkEvent: [
             {type: inputFunc.isEmpty ,tip: '密码不能为空'}, 
             {type: inputFunc.isLength, tip:'请输入6位不连续、不重复数字',param:{length:6}},
             {type: inputFunc.isAllNumber, tip: '请输入6位不连续、不重复数字'},
             {type: inputFunc.isSameNumber, tip: '请输入6位不连续、不重复数字'},
             {type: inputFunc.isContinuityNumber, tip: '请输入6位不连续、不重复数字'}, 
          ]
      },

      'qrNewDealPassword': { //确认网站新交易密码
          checkEvent: [
             {type: inputFunc.isEmpty ,tip: '密码不能为空'},  
             {type: inputFunc.isQrnpCheck, tip:'密码输入不一致，请重新输入'},
             
          ]
      },

      'newLinkPhone': { 
        checkEvent: [
          {type: inputFunc.isEmpty ,tip: '请输入11位新手机号码'},  
          {type: inputFunc.isLength, tip:'请输入11位手机号码',param:{length:11}}
        ]
      },

      'oldLoginPassword': {
        checkEvent: [
          {type: inputFunc.isEmpty ,tip: '请输入原登录密码'},  
        ]
      },
      
      'address' : {
      	checkEvent: [
          {type: inputFunc.isEmpty ,tip: '请输入通讯地址'},
        ]
      },
      
      'beneificiaryName' : {
      	checkEvent: [
          {type: inputFunc.isEmpty ,tip: '请输入实际受益人姓名'},  
        ]
      },
      
      'orgBeneificiary' : {
      	checkEvent: [
          {type: inputFunc.isEmpty ,tip: '请输入其他主体姓名或名称'},  
        ]
      },
      
      'ctrolName': { //机构控制人姓名
     		checkEvent: [
             {type: inputFunc.isEmpty , tip: '请输入机构实际控制人'},
          ]
      },
	  'regAddress': { //注册地址
     		checkEvent: [
             {type: inputFunc.isEmpty , tip: '请输入机构注册地址'},
          ]
      },
      'doAddress': { //办公地址
     		checkEvent: [
             {type: inputFunc.isEmpty , tip: '请输入机构办公地址'},
          ]
      },
      'busCope': { //经营范围
     		checkEvent: [
             {type: inputFunc.isEmpty , tip: '请输入机构经营范围'},
          ]
      },
 };


 module.exports = {
 	checkList: inputList,
 	checkFunc: inputFunc
 }