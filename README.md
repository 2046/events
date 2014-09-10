#Events

提供基本的事件添加，移除和触发功能

##使用说明

###``new Events();``

直接通过构造函数``Events``实例化出一个 events 对象，该对象拥有``on``，``once``，``off``，``trigger``方法，且所有的方法都支持链式调用。

```
var Events = require('events');

var obj = new Events();
obj.on('test', function(){
    console.log('events test');
});

obj.trgger('test'); // events test
```

###on ``obj.on(eventName, handler, [context])``

给对象绑定一个或多个事件处理函数。

- eventName **{{String}}** 一个或多个空格分隔的事件名称，必填
- handler **{{Function}}** 事件被触发时要执行的函数，必填
- context **{{Object}}** 执行函数中``this``指向的值，可选

```
var Events = require('events');

var obj = new Events();
obj.on('test', function(){
    console.log(this.a);
}, {a : 'hello'});

obj.trigger('test'); // hello
```

###once ``obj.once(eventName, handler, [context])``

给对象绑定一个或多个一次性的事件处理函数。

- eventName **{{String}}** 一个或多个空格分隔的事件名称，必填
- handler **{{Function}}** 事件被触发时要执行的函数，必填
- context **{{Object}}** 执行函数中``this``指向的值，可选

```
var Events = require('events');

var obj = new Events();
obj.once('test', function(){
    console.log(this.a);
}, {a : 'hello'});

obj.trigger('test'); // hello
obj.trigger('test');
```

###off ``obj.off(eventName, [handler], [context])``

从对象上移除一个事件处理函数。

- eventName **{{String}}** 一个或多个空格分隔的事件名称，必填
- handler **{{Function}}** 事件被触发时要执行的函数，可选
- context **{{Object}}** 执行函数中``this``指向的值，可选

```
var Events = require('events');

var o = {a : 'a'};
var obj = new Events();
obj.on('test', function(){
    console.log('events test');
});

obj.off(); // 移除 obj 对象上所有的处理函数
obj.off('test'); // 移除 test 事件的所有处理函数
obj.off('test', null, o); // 移除 test 事件上上下文为 o 的处理函数
obj.off('test', onChange); // 移除 test 事件上名为 onChange 的处理函数
obj.off('test', onChange, o); // 移除 test 事件上函数为 onChange，且上下文为 o 的处理函数
```

###trigger ``obj.trigger(eventName, [*args])``

触发对象上一个或多个事件处理函数，``*args``参数会依次传给处理函数。

trigger 的返回值是一个布尔值，会根据所有 handler 的执行情况返回，只要有一个 handler 返回 false，trigger 就会返回 false。

```
var Events = require('events');

var obj = new Events();
obj.on('test', function(a, b, c){
    console.log(a, b, c);
});

obj.trigger('test', 1, 2, 3); // 1,2,3

obj.on('test1', function(){
    // do Something....
});

obj.on('test1', function(){
    // do Something....
    return false;
});

obj.on('test1', function(){
    // do Something....
});

obj.trigger('test1'); // return false
```