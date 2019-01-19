const hasha = require('hasha');
const axios = require('axios');
const express = require('express');
const config = require('./config')

const app = express();



// 全局缓存变量
const SIGNATURE = {
	timestamp: 0,
	signature: '',
	noncestr: config.nonceStr
}

// 获取当前时间
function currentMoment () {
	return Math.floor(new Date().valueOf()/1000);
}

// 是否过期
function isAlive () {
	if ((currentMoment() - SIGNATURE.timestamp) < 7200) {
		return true;
	} else {
		return false;
	}
}

// 获取access token
function getAccessToken (appid, appsecret, callback) {
	axios.get('https://api.weixin.qq.com/cgi-bin/token', {
		params: {
			grant_type: 'client_credential',
			appid: config.appid,
			secret: config.appsecret
		}
  	}).then(function (response) {
		callback(response.data);
  	}).catch(function (error) {
		callback(error);
  	});
}

// 获取ticket
function getTicket(accessToken, callback) {
	axios.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket', {
		params: {
			access_token: accessToken,
			type: 'jsapi'
		}
  	}).then(function (response) {
  		console.log('ticket:');
  		console.log(response.data);
		callback(response.data);
  	}).catch(function (error) {
		callback(error);
  	});
}


// 获取签名
function getHash (jsapi_ticket, noncestr, timestamp, url) {
	let str = 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url;
	console.log(hasha(str, {algorithm: 'sha1'}));
	return hasha(str, {algorithm: 'sha1'});
}


app.get('/', function (req, res, next) {
	if (isAlive()) {
		res.json({
			timestamp: SIGNATURE.timestamp,
			signature: SIGNATURE.signature,
			nonceStr: SIGNATURE.noncestr
		})
	} else {
		SIGNATURE.timestamp = currentMoment();
		getAccessToken(APPID, APPSECRET, function(data){
			getTicket(data.access_token, function(data2){
				let ticket = data2.ticket;
				let signature = getHash(ticket, SIGNATURE.noncestr, SIGNATURE.timestamp, config.url);
				SIGNATURE.signature = signature;
				res.json({
					signature: signature,
					noncestr: SIGNATURE.noncestr,
					timestamp: SIGNATURE.timestamp
				})
			})
		})
	}
});


var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


