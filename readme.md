# webpack-auto-upload-j

最新版本改动 `1.0.5` <br/>
`change` <br/>
会在打包前记录文件，在成功打完包后，删除之前打包文件，上传最新打包文件 <br/>

------------------------------------------------------- <br/>

最新版本改动 `1.0.4` <br/>
`change` <br/>
如果在package.json 有up，并且是一个Object， <br/>
if (up.kaiguan === 0) { <br/>
  文件打包完不会上传服务器 <br/>
} else (up.kaiguan === 1) { <br/>
  文件打包完会上传服务器，服务器地址是build_upload_test配置的serviceDir <br/>
} else (up.kaiguan === 2) { <br/>
  文件打包完会上传服务器，服务器地址是build_upload_pro配置的serviceDir <br/>
} <br/>

------------------------------------------------------- <br/>

在[www.jiangji1.com](http://www.jiangji1.com)中有思路拆分 <br/>

一个自动上传文件的webpack插件 <br/>

### 安装 <br/>
```
npm install webpack-auto-upload-j
```

### 使用 <br/>
在你的webpack.config.js中的plugins加入一项new WebpackAutoUploadJ(配置参数) <br/>
![1](http://www.jiangji1.com/static/upload_98f65583d993fd9dc23166d57b6b9204.jpg) <br/>
### 在写路径的时候如果是 左斜杠`\`，记得转义，换成`\\`，如果是右斜杠，就不用管 <br/>
`我是webpack的配置示列`
``` javascript
const WebpackAutoUploadJ = require('webpack-auto-upload-j')
{
  plugins: [
    new WebpackAutouploadJ({
      path: 'E:\\xxx\\xxx\\xxx\\abc.json', // 这里是一个你本地json文件的绝对路径，是你自己的配置,示列在下面
      key: 'my-blog-web'
    }),
  ]
}
```
`我是本地json文件的配置示列`
``` json
{
  "my-blog-web": {
    "build_upload_test": {
      "host": "xxx.xxx.xxx.xxx",
      "port": 22,
      "user": "root",
      "password": "xxxxxxx",
      "entryDir": "dabao",
      "serviceDir": "/usr/xxx/xxx/dabao_test"
    },
    "build_upload_pro": {
      "host": "xxx.xxx.xxx.xxx",
      "port": 22,
      "user": "root",
      "password": "xxxxxxx",
      "entryDir": "dabao",
      "serviceDir": "/usr/xxx/xxx/dabao"
    }
  }
}
```
`我是项目package.json文件的配置示列` <br/>

``` json
{
  "up": {
		"build": "y dc",
		"build_upload_test": "y d",
		"build_upload_pro": "y d",
		"kaiguan": 2
	}
}
```
`kaiguan`
  * 如果是0，不会上传服务器，
  * 如果是1，上传的是上面本地json文件配置的build_upload_test中的serviceDir
  * 如果是2，上传的是上面本地json文件配置的build_upload_pro中的serviceDir

### property <br/>

`entryDir`    String or Array  // relative path    相对路径 <br/>
`serviceDir`  String or Array <br/>
`serviceConfig` Object <br/>
        * `host` your service IP <br/>
        * `port` your service Prot <br/>


如果entryDir 是 数组 <br/>
  * serviceDir 必须也是 数组 <br/>
  * entryDir的长度 不能 小于 serviceDir的长度 <br/>

如果entryDir 是 字符串 并且 serviceDir 是 数组 <br/>
  * entryDir 中的 文件 会传到 serviceDir 的 每个地址 <br/>


上传服务器的结果，显示
![2](http://www.jiangji1.com/static/upload_6022e52eb274496f8c25ccdb2219b3d5.jpg)

  <br/>
[soundCode in src, 源码在src中](https://github.com/jiangji1/webpack_auto_upload_j)