/***
* 日历插件
* @author jiaxiaolu 2016-04-23 

  逻辑：

  日历插件分为两个部分：

  第一部分：上一页按钮，*年*月，下一页按钮   class：calTitle
  第二部分（第一次初始化日历插件时，默认显示） class：calContent

    里面有两个div，一个class为reserve，一个class为enabled
    初始化时，reserve里面为空，enabled内的内容有三种情况：

        1. table表格  class：tabD  有两个部分：
            1）日一二三四五六   该区域不可点击
            2）当月日期数字   
                该区域选择日期后，日历插件隐藏，并将选择的日期显示在对应input输入框中
                此时点击上下页时，在上一月/下一月之间切换，table的class tabD不变，
                第一部分的*年*月跟着变化

        2. table表格  class: tabM
            某一年的月份，用户可选择想要的月份
            此时点击上下页按钮时，在上一年/下一年的月份之间切换，都是一月-十二月，
            第一部分的*年跟着变化，*月不变

        3. table表格  class: tabY
            年份，用户可选择想要的年份
            默认显示当前年份在中间一行，此时点击上下页按钮时，在上一页的可选年份和下一页的
            可选年份中切换，第一部分的*年跟着变化，*月不变

  当第一次初始化日历插件时，会生成日历插件的DOM结构，此时该结构是隐藏的，点击input输入框或日历小icon
  的时候，会将日历显示出来
  
  第二部分的table表格，初始化时默认为tabD类型的



  点击以及日历插件内容变化的逻辑：

      第一部分：上下页按钮不会变化，*年*月会根据初始化的日期和用户选择的日期变化
      第二部分： class固定叫做calContent

        选择其他月份或者年份时，会生成新的table表格的DOM结构插入到reserve中，reserve和enabled互相切换，
        形成并列的动画，并在动画结束后，清除enabled中的内容，再去掉enabled class，改为reserve，
        将reserve div 去掉reserve class，加上enabled class

        每次在enabled和reserve div切换时，都会生成新的tabD或tabM或tabY的table结构，
        这三种table的DOM结构是不同的


    代码结构：
    第一部分：默认参数和传进来的参数合并
    第二部分：声明所需函数（三种table结构的DOM生成、绑定事件和动画效果）
    第三部分：插件初始化
    第四部分: 添加第一部分上，上下页按钮、*年*月处的事件监听
     
*/


jQuery.fn.extend({

    /**
     * 给jQuery扩展calendar方法
     * 
     * 参数c是外部传进来的数据
     */

    calendar: function(c) {

        /*********************默认参数和传进来的参数合并*********************/
        
        c = jQuery.extend({  //该对象是默认参数
            controlId: $(this).attr("id") + "Calendar",  //对应的日历
            speed: 200, //动画速度
            complement: true,  //
            readonly: true,  //是否只读
            upperLimit: NaN,
            lowerLimit: NaN,
            callback: function() {}  //回调函数
        },
        c || {});




        /*********************声明所需函数
        三种table结构的DOM生成、绑定事件和动画效果****************/

        
        /*********一. tabD相关*********/
        /*
           1. DOM结构生成 
         */
        function s(a, b) {
            newDate = new Date(a, b, 1);
            newDate.setDate(0);
            var d = 1,
            h = newDate.getDate();
            newDate.setDate(1);
            newDate.setMonth(newDate.getMonth() + 1);
            var m = newDate.getDay();
            if (m == 0) m = 7;
            h = h - m + 1;
            newDate.setMonth(newDate.getMonth() + 1);
            newDate.setDate(0);
            var o = newDate.getDate(),
            g = "<table class='tabD'>";
            g += "<tr><th>\u65e5</th><th>\u4e00</th><th>\u4e8c</th><th>\u4e09</th><th>\u56db</th><th>\u4e94</th><th>\u516d</th></tr>";
            var i = w(),
            l = "",
            p = "",
            t = "";
            c.complement || (t = "style='display:none'");
            for (var x = 0; x < 6; x++) {
                g += "<tr>";
                for (var y = 0; y < 7; y++) {
                    var j = x * 7 + y + 1 - m;
                    p = l = "";
                    if (c.lowerLimit != NaN && c.lowerLimit > new Date(newDate.getFullYear(), newDate.getMonth(), j) || c.upperLimit != NaN && new Date(newDate.getFullYear(), newDate.getMonth(), j) > c.upperLimit) if (0 < j && j <= o) {
                        if (newDate.getFullYear() == e && newDate.getMonth() == f && j == q) l = "current";
                        g += "<td><span class='" + l + "'>" + j + "</span></td>"
                    } else if (j <= 0) {
                        if (newDate.getFullYear() == e && newDate.getMonth() - 1 == f && h == q) l = "current";
                        g += "<td><span class='" + l + "' " + t + ">" + h + "</span></td>";
                        h++
                    } else {
                        if (j > o) {
                            if (newDate.getFullYear() == e && newDate.getMonth() + 1 == f && d == q) l = "current";
                            g += "<td><span class='" + l + "' " + t + ">" + d + "</span></td>";
                            d++
                        }
                    } else if (0 < j && j <= o) {
                        if (newDate.getFullYear() == e && newDate.getMonth() == f && j == q) l = "current";
                        if (newDate.getFullYear() == i.getFullYear() && newDate.getMonth() == i.getMonth() && j == i.getDate()) p = "select";
                        g += "<td><a class='" + p + " " + l + "'>" + j + "</a></td>"
                    } else if (j <= 0) {
                        if (newDate.getFullYear() == e && newDate.getMonth() - 1 == f && h == q) l = "current";
                        if (newDate.getFullYear() == i.getFullYear() && newDate.getMonth() - 1 == i.getMonth() && h == i.getDate()) p = "select";
                        g += "<td><a class='prevD " + p + " " + l + "' " + t + ">" + h + "</a></td>";
                        h++
                    } else if (j > o) {
                        if (newDate.getFullYear() == e && newDate.getMonth() + 1 == f && d == q) l = "current";
                        if (newDate.getFullYear() == i.getFullYear() && newDate.getMonth() + 1 == i.getMonth() && d == i.getDate()) p = "select";
                        g += "<td><a class='nextD " + p + " " + l + "' " + t + ">" + d + "</a></td>";
                        d++
                    }
                    g = g.replace("class=' '", "")
                }
                g += "</tr>"
            }
            g += "</table>";
            return g
        }
        /*
           2. tabD时，绑定事件
         */
        function r() {

            //moseup事件，选择日期并显示在input输入框上
            $("#" + c.controlId).find(".tabD a").mouseup(function() {
                var a = new Date($("#" + c.controlId).find(".currentYear").text() + "/" + $("#" + c.controlId).find(".currentMonth").text() + "/1");
                if ($(this).hasClass("prevD")) {
                    a.setMonth(a.getMonth() - 1);
                    a.setDate($(this).text());
                    var b = c.speed;
                    c.speed = 0;
                    $("#" + c.controlId).find(".prevMonth").triggerHandler("mouseup");
                    c.speed = b
                } else if ($(this).hasClass("nextD")) {
                    a.setMonth(a.getMonth() + 1);
                    a.setDate($(this).text());
                    b = c.speed;
                    c.speed = 0;
                    $("#" + c.controlId).find(".nextMonth").triggerHandler("mouseup");
                    c.speed = b
                }
                var d = $(this).text();
                a = a.getFullYear() + "-" + (Number(a.getMonth() + 1) < 10 ? "0" + Number(a.getMonth() + 1) : Number(a.getMonth() + 1)) + "-" + (Number(d) < 10 ? "0" + d: d);
                n.find('input').val(a);
                $("#" + c.controlId + " div table a").removeClass("select");
                $("#" + c.controlId + " .tabD a:contains('" + d + "')").each(function() {
                    d == $(this).text() && !$(this).hasClass("prevD") && !$(this).hasClass("nextD") && $(this).addClass("select")
                });
                $("#" + c.controlId).hide();
                c.callback()
            }).hover(function() {
                //鼠标放上，加hover class
                $(this).addClass("hover")
            },
            function() {
                //鼠标离开，去掉hover class
                $(this).removeClass("hover")
            })
        }



        /*********二. tabM相关*********/
        /*
           1. DOM结构生成 
        */
        function z(a) {
            var b = w(),
            d = "<table class='tabM'>";
            d += "<tr>";
            d += "<td><a val='0' " + (a == b.getFullYear() && 0 == b.getMonth() ? "class='select'": "") + " " + (a == e && 0 == f ? "class='current'": "") + ">\u4e00\u6708</a></td>";
            d += "<td><a val='1' " + (a == b.getFullYear() && 1 == b.getMonth() ? "class='select'": "") + " " + (a == e && 1 == f ? "class='current'": "") + ">\u4e8c\u6708</a></td>";
            d += "<td><a val='2' " + (a == b.getFullYear() && 2 == b.getMonth() ? "class='select'": "") + " " + (a == e && 2 == f ? "class='current'": "") + ">\u4e09\u6708</a></td>";
            d += "<td><a val='3' " + (a == b.getFullYear() && 3 == b.getMonth() ? "class='select'": "") + " " + (a == e && 3 == f ? "class='current'": "") + ">\u56db\u6708</a></td>";
            d += "</tr>";
            d += "<tr>";
            d += "<td><a val='4' " + (a == b.getFullYear() && 4 == b.getMonth() ? "class='select'": "") + " " + (a == e && 4 == f ? "class='current'": "") + ">\u4e94\u6708</a></td>";
            d += "<td><a val='5' " + (a == b.getFullYear() && 5 == b.getMonth() ? "class='select'": "") + " " + (a == e && 5 == f ? "class='current'": "") + ">\u516d\u6708</a></td>";
            d += "<td><a val='6' " + (a == b.getFullYear() && 6 == b.getMonth() ? "class='select'": "") + " " + (a == e && 6 == f ? "class='current'": "") + ">\u4e03\u6708</a></td>";
            d += "<td><a val='7' " + (a == b.getFullYear() && 7 == b.getMonth() ? "class='select'": "") + " " + (a == e && 7 == f ? "class='current'": "") + ">\u516b\u6708</a></td>";
            d += "</tr>";
            d += "<tr>";
            d += "<td><a val='8' " + (a == b.getFullYear() && 8 == b.getMonth() ? "class='select'": "") + " " + (a == e && 8 == f ? "class='current'": "") + ">\u4e5d\u6708</a></td>";
            d += "<td><a val='9' " + (a == b.getFullYear() && 9 == b.getMonth() ? "class='select'": "") + " " + (a == e && 9 == f ? "class='current'": "") + ">\u5341\u6708</a></td>";
            d += "<td><a val='10' " + (a == b.getFullYear() && 10 == b.getMonth() ? "class='select'": "") + " " + (a == e && 10 == f ? "class='current'": "") + ">\u5341\u4e00\u6708</a></td>";
            d += "<td><a val='11' " + (a == b.getFullYear() && 11 == b.getMonth() ? "class='select'": "") + " " + (a == e && 11 == f ? "class='current'": "") + ">\u5341\u4e8c\u6708</a></td>";
            d += "</tr>";
            d += "</table>";
            return d
        }
        /*
            2. tabM时，绑定事件
         */
        function u() {
            $("#" + c.controlId).find(".tabM a").mouseup(function() {

                //获得DOM结构
                var a = s(Number($("#" + c.controlId).find(".currentYear").text()), Number($(this).attr("val")));
                
                //动画
                D(a);

                //重新绑定事件
                r();

                //修改第一部分*年*月的内容
                $("#" + c.controlId).find(".currentMonth").text(Number($(this).attr("val")) + 1)
            }).hover(function() {
                //添加hover class
                $(this).addClass("hover")
            },
            function() {
                 //去掉hover class
                $(this).removeClass("hover")
            })
        }
        


        /*********三. tabY相关*********/
        /*
           1. DOM结构生成 
        */
        function A(a) {
            a = Math.floor(a / 10) * 10;
            var b = "<table class='tabY'>",
            d = w(),
            h = "",
            m = "",
            o = "";
            c.complement || (o = "style='display:none'");
            for (var g = 0; g < 3; g++) {
                b += "<tr>";
                for (var i = 0; i < 4; i++) {
                    m = h = "";
                    if (g + 1 * i + 1 != 1 && (g + 1) * (i + 1) != 12) {
                        if (a == d.getFullYear()) h = "select";
                        if (a == e) m = "current";
                        b += "<td><a class='" + h + " " + m + "' >" + a + "</a></td>";
                        a++
                    } else if (g + 1 * i + 1 == 1) {
                        if (a - 1 == d.getFullYear()) h = "select";
                        if (a - 1 == e) m = "current";
                        b += "<td><a class='prevY " + h + " " + m + "' " + o + ">" + (a - 1) + "</a></td>"
                    } else {
                        if (a == d.getFullYear()) h = "select";
                        if (a == e) m = "current";
                        b += "<td><a class='nextY " + h + " " + m + "' " + o + ">" + a + "</a></td>"
                    }
                }
                b += "</tr>"
            }
            b += "</table>";
            return b
        }
        /*
            2. tabY时，绑定事件
         */
        function v() {
            $("#" + c.controlId).find(".tabY a").mouseup(function() {

                //获得DOM结构
                var a = s(Number($(this).text()), Number($("#" + c.controlId).find(".currentMonth").text()) - 1);
                
                //动画
                D(a);

                //重新绑定事件
                r();

                //修改第一部分*年*月的内容
                $("#" + c.controlId).find(".currentYear").text(Number($(this).text()))
            }).hover(function() {
                $(this).addClass("hover")
            },
            function() {
                $(this).removeClass("hover")
            })
        }


        

        /*********四. tabD，tabM，tabY公用的动画效果*********/
        
        /*
            1. 上页按钮点击时，reserve和enabled两个div的切换动画（从左往右）
         */
        function C(a) {
            var b = $("#" + c.controlId).find(".reserve"),
            d = $("#" + c.controlId).find(".enabled");
            b.stop();
            d.stop();
            b.removeClass("reserve").addClass("enabled");
            d.removeClass("enabled").addClass("reserve");
            b.css({
                "margin-left": "-" + d.width() + "px",
                "margin-top": "0px"
            });
            b.empty().append(a);
            b.animate({
                "margin-left": "0px"
            },
            c.speed);
            d.animate({
                "margin-left": d.width() + "px"
            },
            c.speed,
            function() {
                d.empty()
            })
        }
        

        /*
            2. 下页按钮点击时，reserve和enabled两个div的切换动画（从右往左）
         */
        function B(a) {
            var b = $("#" + c.controlId).find(".reserve"),
            d = $("#" + c.controlId).find(".enabled");
            b.stop();
            d.stop();
            b.removeClass("reserve").addClass("enabled");
            d.removeClass("enabled").addClass("reserve");
            b.css({
                "margin-left": d.width() + "px",
                "margin-top": "0px"
            });
            b.empty().append(a);
            b.animate({
                "margin-left": "0px"
            },
            c.speed);
            d.animate({
                "margin-left": "-" + d.width() + "px"
            },
            c.speed,
            function() {
                d.empty()
            })
        }


        /*
            3. 点击*月或*年 时，reserve和enabled两个div的切换动画（从上往下）
         */
        function E(a) {
            var b = $("#" + c.controlId).find(".reserve"),
            d = $("#" + c.controlId).find(".enabled");
            b.stop();
            d.stop();
            b.removeClass("reserve").addClass("enabled");
            d.removeClass("enabled").addClass("reserve");
            $("#" + c.controlId).css({
                "z-index": 100
            });
            b.css({
                "z-index": 100
            });
            d.css({
                "z-index": 100
            });
            b.css({
                "margin-left": "0px",
                "margin-top": "-" + d.height() + "px"
            });
            b.empty().append(a);
            b.animate({
                "margin-top": "0px"
            },
            c.speed);
            d.animate({
                "margin-top": d.width() + "px"
            },
            c.speed,
            function() {
                d.empty();
                $("#" + c.controlId).css({
                    "z-index": 100
                });
                b.css({
                    "z-index": 100
                });
                d.css({
                    "z-index": 100
                })
            })
        }


        /*
            4. 选择tabM的月份或tabY的年份时，显示详细日期的动画（从下往上）
         */
        function D(a) {
            var b = $("#" + c.controlId).find(".reserve"),
            d = $("#" + c.controlId).find(".enabled");
            b.stop();
            d.stop();
            b.removeClass("reserve").addClass("enabled");
            d.removeClass("enabled").addClass("reserve");
            $("#" + c.controlId).css({
                "z-index": 100
            });

            b.css({
                "z-index": 100
            });
            d.css({
                "z-index": 100
            });
            b.css({
                "margin-left": "0px",
                "margin-top": d.height() + "px"
            });
            b.empty().append(a);
            b.animate({
                "margin-top": "0px"
            },
            c.speed);
            d.animate({
                "margin-top": "-" + d.width() + "px"
            },
            c.speed,
            function() {
                d.empty();
                $("#" + c.controlId).css({
                    "z-index": 100
                });
                b.css({
                    "z-index": 100
                });
                d.css({
                    "z-index": 100
                })
            })
        }



        /*********五. 其他函数*********/

        /*
            1. 获取当前输入框上的值
         */
        function w() {
            re = /(\d\d\d\d)(\W)?(\d\d)(\W)?(\d\d)/g;
            var a = n.find('input').val();
            a = a.replace(re, "$1/$3/$5@").split("@")[0];
            return new Date(a)
        }


        /*
            2. 获取元素距屏幕左右的距离
         */
        function F(a) {
            var b = [];
            b.x = a.offsetLeft;
            for (b.y = a.offsetTop; a = a.offsetParent;) {
                b.x += a.offsetLeft;
                b.y += a.offsetTop
            }
            return b
        }







        /***************************插件初始化********************************/

        var n = $(this);  //$(this)是调用这个插件的元素

        if (c.readonly) {  //如果只读
            n.find('input').attr("readonly", true);
            n.find('input').bind("keydown", function() {
                //监听keydown事件，将8设为0，不晓得为什么~
                if (event.keyCode == 8) event.keyCode = 0
            })
        }

        today = new Date; //声明today变量为Date实例
        
        //获取日期
        var e = today.getFullYear(),
        f = today.getMonth(),
        q = today.getDate(),

        //拼日历的DOM结构
        k = "";
        k += "<div id='" + c.controlId + "'class='calendar'>";
        k += "  <div class='calMain'>";
        k += "    <div class='calTitle'>";
        k += "      <a class='prevMonth'></a><span class='t_date'><span class='currentYearText'><a class='currentYear'>" + e + "</a>\u5e74</span><span class='currentMonthText'><a class='currentMonth'>" + (f + 1) + "</a>\u6708</span></span><a class='nextMonth'></a>";
        k += "    </div>";
        k += "    <div class='calContent'>";
        k += "      <div class='reserve'>";
        k += "      </div>";
        k += "      <div class='enabled'>";  //日期区域
        k += s(e, f);  //获取tabD的DOM结构
        k += "      </div>";
        k += "    </div>";
        k += "  </div>";
        k += "</div>";

        //在body元素中添加k
        $("body").append(k);

        //给日历插件上的日期a标签绑定点击、hover事件
        r();





        /****************添加第一部分上，上下页按钮、*年*月处的事件监听***************/

        /*
            1. 上一页的icon监听mouseup事件
         */
        $("#" + c.controlId).find(".prevMonth").mouseup(function() {

            if ($("#" + c.controlId).find(".enabled > .tabD").length > 0) {
                //如果有tabD的结构，点击后需要显示上一个月的详细天数

                var a = $("#" + c.controlId).find(".currentYear"),
                b = $("#" + c.controlId).find(".currentMonth"),

                //获取tabD的DOM结构
                d = s(Number(a.text()), Number(b.text()) - 2);

                //动画
                C(d); 

                if (Number(b.text()) != 1) b.text(Number(b.text()) - 1);
                else {
                    a.text(Number(a.text()) - 1);
                    b.text("12")
                }

                r() //重新绑定事件

            } else if ($("#" + c.controlId).find(".enabled > .tabM").length > 0) {
                //如果有tabM的结构，点击后需要显示上一年的月份

                //获取tabM的DOM结构
                d = z(Number($("#" + c.controlId).find(".currentYear").text()) - 1);

                //动画
                C(d);

                //重新绑定事件
                u();

                //修改第一部分上，*年*月的内容
                $("#" + c.controlId).find(".currentYear").text(Number($("#" + c.controlId).find(".currentYear").text()) - 1)
            
            } else if ($("#" + c.controlId).find(".enabled > .tabY").length > 0) {
                //如果有tabY的结构，点击后需要显示上一页

                //获取tabY的DOM结构
                d = A(Number($("#" + c.controlId).find(".currentYear").text()) - 10);

                //动画
                C(d);

                //重新绑定事件
                v();

                //修改第一部分上，*年*月的内容
                $("#" + c.controlId).find(".currentYear").text(Number($("#" + c.controlId).find(".currentYear").text()) - 10)
            }
        });


        /*
            2. 下一月的icon监听mouseup事件
         */
        $("#" + c.controlId).find(".nextMonth").mouseup(function() {

            if ($("#" + c.controlId).find(".enabled > .tabD").length > 0) {
                //如果有tabD的结构，点击后需要显示下一个月的详细天数

                var a = $("#" + c.controlId).find(".currentYear"),
                b = $("#" + c.controlId).find(".currentMonth"),

                //获取tabD的DOM结构
                d = s(Number(a.text()), Number(b.text()));

                //动画
                B(d);

                if (Number(b.text()) != 12) b.text(Number(b.text()) + 1);
                else {
                    a.text(Number(a.text()) + 1);
                    b.text("1")
                }

                //重新绑定事件
                r()

            } else if ($("#" + c.controlId).find(".enabled > .tabM").length > 0) {
                //如果有tabM的结构，点击后需要显示下一年的月份
                
                //获取tabM的DOM结构
                d = z(Number($("#" + c.controlId).find(".currentYear").text()) + 1);

                //动画
                B(d);

                //重新绑定事件
                u();

                //修改第一部分上，*年*月的内容
                $("#" + c.controlId).find(".currentYear").text(Number($("#" + c.controlId).find(".currentYear").text()) + 1)
            
            } else if ($("#" + c.controlId).find(".enabled > .tabY").length > 0) {
                //如果有tabY的结构，点击后需要显示上一页

                //获取tabY的DOM结构
                d = A(Number($("#" + c.controlId).find(".currentYear").text()) + 10);

                //动画
                B(d);

                //重新绑定事件
                v();

                //修改第一部分上，*年*月的内容
                $("#" + c.controlId).find(".currentYear").text(Number($("#" + c.controlId).find(".currentYear").text()) + 10)
            }
        });


        /*
            3. *月 的点击事件
         */
        $("#" + c.controlId).find(".currentMonthText").mouseup(function() {

            //如果没有tabM的DOM结构
            if (! ($("#" + c.controlId).find(".enabled > .tabM").length > 0)) {

                //创建tabM的DOM结构
                var a = z(Number($("#" + c.controlId).find(".currentYear").text()));

                //动画，切换显示
                E(a);

                //重新绑定事件
                u()
            }
        });


        /*
            4. *年 的点击事件
         */
        $("#" + c.controlId).find(".currentYearText").mouseup(function() {

            //如果没有tabY的DOM结构
            if (! ($("#" + c.controlId).find(".enabled > .tabY").length > 0)) {

                //创建tabY的DOM结构
                var a = A(Number($("#" + c.controlId).find(".currentYear").text()));

                //动画，切换显示
                E(a);

                //重新绑定事件
                v()
            }
        });


        //为调用该插件的元素监听click  focus事件
        n.bind("click focus",
        function() {

            //如果该插件是显示状态
            if ($("#" + c.controlId + ":hidden").length != 0) {

                //隐藏插件
                $(".calendar").hide();

                //添加动画，并将插件的宽高设为0
                var a = $("#" + c.controlId),
                b = F(n[0]),
                d = b.x + Number(n.prop("clientLeft"))-1;
                b = b.y + Number(n.prop("clientTop")) + Number(n.prop("clientHeight"));
                a.css({
                    top: b + "px",
                    left: d + "px"
                });
                d = $("#" + c.controlId).width();
                b = $("#" + c.controlId).height();
                a.width(0);
                a.height(0);
                a.show().animate({
                    width: d + "px",
                    height: b + "px"
                },
                c.speed);

                //禁止快速选择文字和mousedown事件
                a.bind("selectstart",
                function() {
                    return false
                }).bind("mousedown",
                function() {
                    return false
                })
            }
        });


        //整个document监听mouseup事件，隐藏日历
        $(document).mouseup(function(a) {
            if ($(a.target).attr("id") != n.attr("id") && ($(a.target).parentsUntil("#" + c.controlId).parent().length == 0 || $(a.target).parentsUntil("#" + c.controlId).parent()[0].id != c.controlId)) $("#" + c.controlId).hide()
        })
    }
}); 