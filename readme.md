# webpack-auto-upload-j

a webpack-plugin to auto upload your files
一个自动上传文件的webpack插件

### install
### 安装
```
npm install webpack-auto-upload-j
```

### how to use
### 使用
in webpack.config.js
in plugins add one new WebpackAutoUploadJ(options)
在你的webpack.config.js中的plugins加入一项new WebpackAutoUploadJ(配置参数)
![1](https://raw.githubusercontent.com/jiangji1/webpack_auto_upload_j/master/imgs/1.png)
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
###property

`entryDir`    String or Array  // relative path    相对路径
`serviceDir`  String or Array
`serviceConfig` Object
        * `host` your service IP
        * `port` your service Prot


if (entryDir is Array) { // one-to-one  一对一的顺序
如果(entryDir 是 数组)
  serviceDir must be Array
  serviceDir 必须也是 数组
  entryDir['length'] can not less than serviceDir['length']
  entryDir的长度 不能 小于 serviceDir的长度
}

if (entryDir is String && serviceDir is Array) {
如果(entryDir 是 字符串 并且 serviceDir 是 数组)
  everyone of serviceDir will receive files in entryDir
  entryDir 中的 文件 会传到 serviceDir 的 每个地址
}


result: succeedFiles and failedFiles
![2](https://raw.githubusercontent.com/jiangji1/webpack_auto_upload_j/master/imgs/2.png)

 
[soundCode in, 源码](https://raw.githubusercontent.com/jiangji1/webpack_auto_upload_j)的src