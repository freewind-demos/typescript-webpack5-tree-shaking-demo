TypeScript Webpack5 Tree Shaking Demo
=======================================

坑很多，需要满足以下几个条件：
1. package.json中，`"type": "module"`表明这是一个module，webpack才支持shaking
2. `tsconfig.json`中必须使用`"module": "ES2020" / "ESNext"`等，只有这样，
   1. typescript生成的才是esm格式的代码，可以被shaking。如果使用`CommonJS`，则不可以
   2. 这种模式下，`__dirname`等无法使用，需要使用`import.meta.url`等转换才行
   3. `"moduleResolution": "node"`，否则webpack.config.ts内容报错
   4. 此时`.ts`的webpack config不被支持，必须加上环境变量`NODE_OPTIONS="--loader ts-node/esm" webpack build`
3. webpack设置，只有当`production`模式才能真正去除很多无用的东西；如果是development，则会显示在bundle中

另外：
1. webpack的tree shaking是依赖于内部使用的terser插件起作用的，但我们可以通过传入自己的WebpackTerserPlugin进行显式设置
   1. `mangle`的意思是把变量缩短，需要把它disable
   2. 由于本demo重点是tree shaking，所以主要是看`unused`和`dead_code`两个设置
   3. 如果把`compress`的`defaults`设为true，则最后会出来inline后最简单的代码
2. terser支持`/*@__PURE__*/`等标注，不过我发现不用标也可以 
3. 不需要babel-loader
4. package.json不需要声明`sideEffects:false`


```
npm install
npm run demo
```

然后

```
cat ./dist/bundle.js
```

内容如下：

```
(() => {
    "use strict";
    function util1() {
        return "util1";
    }
    const utilStr = util1();
    console.log(utilStr);
})();
```

看起来`util2`的确是被去掉了。
