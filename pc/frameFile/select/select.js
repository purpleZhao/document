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

$(function(){

    var select={

        getElements : {
            //选择 class singleSelect 下面的元素
            selectCopy : $('.singleSelect .selectCopy'),
            optionCopy : $('.singleSelect .optionCopy')
        },

        ck:function(){
            var that=this;

            this.getElements.selectCopy.on('click',function(event){
                
                //点击出现下拉效果
                
                if($(this).hasClass('stopClick')){
                    //如果有这个class，说明不能出现下拉列表
                    return false;
                }
                
                //没有stopClick class，需要出现下拉列表
                var $optionCopy = $(this).nextAll(".optionCopy");
                var $optionCopyPent = $optionCopy.parent();

                if($optionCopy.is(":visible")){
                    $optionCopy.slideUp(200); 
                }else{
                    $optionCopy.slideDown(200);
                }

                var $options = $optionCopy.find("li");

                //下拉列表中的li  点击
                $options.on('click',function(event){

                    event.stopPropagation();

                    var $this = $(this),
                        num =  $this.attr('num'),  //该条li的num属性值
                        html = $this.html();//现金宝选中银行卡的内容

                    $this.parent().slideUp(200)
                        .parent().find(".selectCopy").html(html).attr('num',num).addClass('selectResult');
                })

                //鼠标离开，隐藏下拉列表
                $optionCopyPent.on('mouseleave',function(event){
                   //鼠标离开，隐藏列表
                   $(this).find('.optionCopy').slideUp(200);
                })

            })
        }
    }
    select.ck();
});