# 不同类型html页面所需引用的基本样式文件

对于wap项目，本框架提供：

1. 一个基本颜色列表：`color.less`，其中声明了不同色值，其他样式文件中的色值都使用此`color.less`中对应的变量
2. 三个基本样式文件：`reset.less、baseClass.less、resetMui.less`，根据不同情况分别引入，其中：

	1）`reset.less`重置了浏览器的基本样式

	2）`baseClass.less`没有对浏览器做基本的样式重置，但提供了移动端`rem`的变化、左右浮动、单/多行省略号、flexbox的样式

	3）`resetMui.less`提供了对`mui`样式的重置

---

项目中，`html`页面有以下几种情况：

1. 普通页面（使用`mui`）

2. 普通页面（不使用`mui`）

3. 协议类页面（内容从接口拿到，除了最基本的`reset.less`外不引入任何样式文件）

---

不同的页面引入基本样式文件的方式不同：

1. 普通页面（使用`mui`）：

		1）正常引用`mui`的`css`及`js`文件

		2）引入`color.less、reset.less、resetMui.less`文件

2. 普通页面（不使用`mui`）：

		1）引入`color.less、reset.less`文件

3. 协议类页面（内容从接口拿到）：

	    1）由于所有内容都是从接口拿到，不对其做任何样式上的修改，因此只引入`baseClass.less`文件
		

