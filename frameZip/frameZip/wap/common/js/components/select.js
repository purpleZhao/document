/***
* 模拟下拉框的效果
* 仅为单独下拉框使用，用class singleSelect 标识，没有该class的，不会绑定本效果
* 例见——common/views/inputDom/select/idTypeSelect.html
*
* 若是多级下拉联动，有自带的集成了下拉效果的插件，此时结构上不需要加该class，
* 否则下拉效果会与本文件的冲突，下拉效果出现错误
*  
* @author jiaxiaolu 2016-08-15
*/

//zepto模块--callback
require('../../../include/js/vendor/zepto/fx.js'); 

module.exports = $(function(){

    var select={

        getElements : {
            //选择 class singleSelect 下面的元素
            selectCopy : $('.selectWrapper .selectCopy'),
            optionCopy : $('.selectWrapper  .optionCopy')
        },
        ck:function(){
            var that=this;

            this.getElements.selectCopy.on('click',function(event){
                
                //点击出现下拉效果
                
                if($(this).hasClass('stopClick')){
                    //如果有这个class，说明不能出现下拉列表
                    //目前风险测评做题页面使用
                    return false;
                }
                
                //没有stopClick class，需要出现下拉列表
                var $optionCopy = $(this).siblings(".optionCopy");
                var $optionCopyPent = $optionCopy.parent();

                if($optionCopy.css("display") == "block"){
                    
                    $(this).removeClass('rotate').removeClass('border');

                    $optionCopy.animate({
                        opacity: 0,
                    }, 200, function(){
                        $(this).hide();
                    })
                }else{

                    $(this).addClass('rotate').addClass('border');

                    $optionCopy.show().animate({
                        opacity: 1,
                    }, 200)
                }
                var $options = $optionCopy.find("li");

                //下拉列表中的li  点击
                $options.on('click',function(event){

                    var $this = $(this),
                        num =  $this.attr('num'),
                        html = $this.html();

                    $this.parent().animate({
                        opacity: 0,
                    }, 200, function(){
                        $(this).hide();
                    }) 
                    $this.parent().parent().find(".selectCopy .select_txt").html(html).addClass('selectResult');
                    $this.parent().parent().find(".selectCopy").attr('num',num).addClass('hasSelect').removeClass('rotate').removeClass('border');
                    //.attr('noWord','false');
                    
                    //个人中心页面选择下拉选项后字体颜色为#333，用selectResult class控制
                    //$this.parent().parent().find(".selectCopy")
                    //.css("color","#333");
                    
                    if( $this.parents('.idTypeSlect').length != 0 ){
                        //个人证件类型
                        
                        var $parents =  $this.parents('.right_cont'),
                            //证件号输入框
                            $numInput = $parents.find('.num_input'),
                            //银行列表
                            ul = $parents.find('.bankType').find('.optionCopy');  
                            
                            //如果选择证件类型，则开户银行名称重新置空
                            var $selectCopy = ul.parent().find(".selectCopy");
                            $selectCopy.removeClass('selectResult').attr("num","").html($selectCopy.attr('placeholder'));
                            //.html("请选择开户银行");

                        if(html == '身份证'){
                            //修改证件号码输入框的check值
                            //$numInput.attr('check','idNum').attr('numType','idNum');
                            $numInput.attr('numType','idNum');

                            //显示银行列表里的所有银行
                            ul.find('li').show();
                        }else{
                            //把身份证时输入的空格去掉
                            //$numInput.attr('check','num_1').attr('numType','num').val($numInput.val().replace(/\s/g, ""));
                            $numInput.attr('numType','num').val($numInput.val().replace(/\s/g, ""));

                            //如果当前页面是实名认证，隐藏银行列表里的两个银行
                            if( $.util.currentHref.indexOf('realName.html') != -1 ){

                                $.each( ul.find('li'), function(i, el){
                                    var num = $(el).attr('num');
                                    if( num == '934' || num == '010' ){
                                        $(el).hide();
                                    }
                                    
                                })
                            }
                        }
                    }

                    $this.addClass('liSelect').siblings('li').removeClass('liSelect');
                })

                $optionCopyPent.on('mouseleave',function(event){
                    //鼠标离开，隐藏列表
                    $(this).find('.optionCopy').animate({
                        opacity: 0,
                    }, 200, function(){
                        $(this).hide();
                    })
                    $(this).find(".selectCopy").removeClass('rotate').removeClass('border');
                })

            })
        }
    }
    select.ck();
});