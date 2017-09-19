(function($, window, document,undefined) {


    var checkFunc = function($el){
        
        this.$el = $el; //当前元素

        //存放该元素相关的其他元素
        this.siblingsEl = {
            iconfont : $el.siblings('.iconfont'),  //x
            error_tip : $el.siblings('.error-tip'), //错误提示
        }

        //相关class类名
        this.useClass = {
            focus: 'focus',  //获得焦点的class
            wrong: 'input_error', //错误时的class
        }
    }

    checkFunc.prototype = {

        init: function(){
            var that = this;
            //绑定统一的blur/focus/click 事件      
            that.bindEvents(); 
        },

        //绑定统一的blur/focus/click 事件      
        bindEvents: function(){
            var that = this;

            //focus
            that.$el.on('focus',function(){
               that.$el.removeClass(that.useClass.wrong).addClass(that.useClass.focus);
               that.siblingsEl.error_tip.hide().html('');
               that.siblingsEl.iconfont.show();
            });

            //blur
            that.$el.on('blur',function(){
               //样式改变
               that.$el.removeClass(that.useClass.focus);
               that.siblingsEl.iconfont.hide();
            });

            //点击x按钮
            that.siblingsEl.iconfont.on('click', function(){
                that.$el.val('');
                that.siblingsEl.iconfont.hide();
            })


        },
    }

    
    var allInput = $('[needCheck=true]'), //所有需要校验的元素
        allInputArr = []; //存放所有元素的实例

    $.each(allInput, function(i, el){ //循环所有元素

        var newCheckInput = new checkFunc($(el)); //生成对应的新实例

        allInputArr.push({ //添加到allInputArr中
            checkEl: $(el), //当前元素
            checkObj: newCheckInput //该元素实例
        });

        newCheckInput.init(); //调用init事件
    })

})(jQuery, window, document);