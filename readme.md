https://blog.logrocket.com/es-modules-in-node-today/#commonjsmodulesystem

代码：https://github.com/nodejs/node/blob/7c63bc6540f4ad21f911f38f8708ed988f433ce7/lib/internal/modules/cjs/loader.js#L166

包装说明：https://github.com/nodejs/ecmascript-modules/blob/modules-lkgr/doc/api/modules.md#the-module-wrapper

nodejs 在导出模块时候，会把代码包一层：
```javascript
(function(exports, require, module, __filename, __dirname) {
	// Module code actually lives in here
});
```
1. 确保每个模块在顶层定义的变量，会变成“局部”变量，防止不同模块之间污染；
2. 传递一些基础全局对象：exports/module/...


require 会缓存模块。
```javascript
// file a.js
console.log('this is a')
module.exports = 100;

// file main.js
const a = require('./a.js');
// out: this is a 
const a2 = require('./a.js')
// out: 
```
> 一个模块的生命周期：
> Resolution –> Loading –> Wrapping –> Evaluation –> Caching

> require导出的是 module.exports 的值，而在模块内部，exports只是引用了 module.exports，对于 exports 的重新赋值，是不能被正确导出的。
```javascript
function require(/* ... */) {
  const module = { exports: {} };
  ((module, exports) => {
    // Module code here. In this example, define a function.
    function someFunc() {}
    exports = someFunc;
    // At this point, exports is no longer a shortcut to module.exports, and
    // this module will still export an empty default object.
    module.exports = someFunc;
    // At this point, the module will now export someFunc, instead of the
    // default object.
  })(module, module.exports);
  return module.exports;
}
```
### require vs import
esm 的 import，会优先查找和执行被依赖的模块，最后再执行入口文件；（深度优先遍历，从叶子节点到根节点），模块的引入是异步的。
import 的分析可以分为几步：
Parsing： 模块分析，确保import语法/模块存在；
Loading： 加载模块，深度优先遍历
Linking： 确保模块export的属性正确，并加载到当前模块；
Run time：执行模块，代码执行到时候，import语句其实是被无视跳过了。

https://hacks.mozilla.org/2015/08/es6-in-depth-modules/
cjs 的 require，则是从上往下执行。（根节点到叶子节点），模块的引入是同步的。
```javascript
// file: main.js
console.log('start.');
const modA = require('./module-a.js');
// import modA from './module-a.mjs';
console.log(modA);
console.log('end.');

// file: module-a.js
let str = 'a';
console.log('this is module a.')

export default str;

// output: 

// start.
// this is module a.
// a
// end.

// output2: 

// this is module a.
// start.
// a
// end.
``

### 