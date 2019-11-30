# webpack-auto-upload-j

a webpack-plugin to auto upload your files <br/>
一个自动上传文件的webpack插件 <br/>

### install <br/>
### 安装 <br/>
```
npm install webpack-auto-upload-j
```

### how to use <br/>
### 使用 <br/>
in webpack.config.js <br/>
in plugins add one new WebpackAutoUploadJ(options) <br/>
在你的webpack.config.js中的plugins加入一项new WebpackAutoUploadJ(配置参数) <br/>
![1](https://raw.githubusercontent.com/jiangji1/webpack_auto_upload_j/master/imgs/1.png) <br/>
```
const WebpackAutoUploadJ = require('webpack-auto-upload-j')
{
  plugins: [
    new WebpackAutoUploadJ({
      entryDir: 'static', // or ['static', 'static2', 'static3']
      serviceDir: '/usr/share/web/static', // or ['/usr/share/web/static', '/usr/share/web/static2', '/usr/share/web/static3']
      serviceConfig: {
        "host": "xxx.xxx.xxx.xxx",
        "port": xxx,
        "user": "xxx",
        "password": "xxx"
      },
    }),
  ]
}
```
###property <br/>

`entryDir`    String or Array  // relative path    相对路径 <br/>
`serviceDir`  String or Array <br/>
`serviceConfig` Object <br/>
        * `host` your service IP <br/>
        * `port` your service Prot <br/>


if (entryDir is Array) { // one-to-one  一对一的顺序 <br/>
如果(entryDir 是 数组) <br/>
  serviceDir must be Array <br/>
  serviceDir 必须也是 数组 <br/>
  entryDir['length'] can not less than serviceDir['length'] <br/>
  entryDir的长度 不能 小于 serviceDir的长度 <br/>
} <br/>

if (entryDir is String && serviceDir is Array) { <br/>
如果(entryDir 是 字符串 并且 serviceDir 是 数组) <br/>
  everyone of serviceDir will receive files in entryDir <br/>
  entryDir 中的 文件 会传到 serviceDir 的 每个地址 <br/>
} <br/>


result: succeedFiles and failedFiles
![2](https://raw.githubusercontent.com/jiangji1/webpack_auto_upload_j/master/imgs/2.png)

  <br/>
[soundCode in src, 源码在src中](https://raw.githubusercontent.com/jiangji1/webpack_auto_upload_j)