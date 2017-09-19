# 表单的校验check.js

本框架也为表单组件提供了校验方法。需要引入`check.js`。

该文件是在`formEvent.js`基础上形成的，因此若引入了`check.js`，不需再引入`formEvent.js`。

### 校验说明

表单校验，即对表单元素做校验，如是否为空，输入内容的长度和格式是否符合要求，密码和确认密码是否相同等等。

在表单组件中，表单元素共有三类：`input`，下拉列表，`textarea`

每一类都有不同的校验方式，又可以分为两类：

1. `input`和`textarea`，需要校验的是输入内容，是`val()`值，需要校验是否为空，输入内容是否符合要求等等

2. `select`下拉选择，需要校验的不是输入内容，因为它无法输入，而需要校验是否已选择，也无需校验选择的数据是否符合要求

因此，`input`和`textarea`的相关校验多一些，`select`下拉选择只校验是否已选择即可

而对于一个表单来说，通常除了以上的表单元素外，还应该有一个提交按钮，或者再多一个返回/取消按钮。

提交按钮，点击后把表单数据提交给后台接口

返回/取消按钮，点击后返回上一步或者返回上一页或者……具体看需求

那么，点击提交按钮的时候，需要先对表单元素做校验，通过校验后才能请求后台接口，如果有某一项表单元素不通过校验，需要显示错误提示信息，并标识该表单元素不通过校验，有一个样式上的效果

怎么才能做到这一点呢？

请看下面：

### 表单组件的校验逻辑

1. `input`和`textarea`为了绑定`focus blur`等基本事件，已经添加了`needCheck=true`属性，因此为了保持统一，也为了方便使用，在表单内的`select`下拉列表组件上也添加`needCheck=true`属性，表示该表单元素需要做校验

2. `check.js`中，会获取所有`needCheck=true`的元素，进行绑定事件、绑定校验方法等处理。但下拉选择的表单元素是不需要绑定`focus blur`等基本事件的，因此这里需要对这是三大类表单元素做区分处理

3. 



### xssfilter

为了保证提交给后台服务器数据的安全性，这里使用`xssfilter`对数据进行处理

```
//引入xssFilter及配置
var xssFilter = require('xssfilter');
var xssfilter = new xssFilter({
    matchStyleTag: false,
    matchScriptTag: false,
    removeMatchedTag: false,
    escape: true
});
```

如果这样引用，`xssfilter`需要用`npm`下载，具体使用方法：

https://www.npmjs.com/package/xss-filters