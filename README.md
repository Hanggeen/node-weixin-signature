# weixin_jssdk

使用node.js，提供为微信签名提供的后端服务

参考微信[JSSDK说明文档](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115)

#### 开始
```javascript
npm install
```
#### 使用
```javascript
node app.js
```
#### 说明
```javascript
const config = {
	appid: '填写你的appid',
	appsecret: '填写你的appsercret',
	nonceStr: '填写无序字符串'
}

module.exports = config
```

## 开源协议

MIT