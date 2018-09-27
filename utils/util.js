var api = require('../config/api.js');
var Promise = require('../lib/es6-promise.min.js');

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function loginSystem() {
  login().then((res) => {
    code = res.code;
    return {};
  }).then((userInfo) => {
    wx.request(api.AuthLoginByWeixin, { code: code, userInfo: userInfo }, 'POST')
  }).catch((error) => {

  })
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'cookie': wx.getStorageSync('token')
      },
      success: function (res) {
        console.log("success");
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          reject(res.errMsg);
        }
      },
      fail: function (err) {
        reject(err)
        console.log("failed")
      }
    })
  });
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
      }
    })
  });
}

/**
 * 调用微信登录
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          //登录远程服务器
          console.log(res)
          resolve(res.code);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  }).then(code => {
    return new Promise((onCompleted, onRejected) => {
      wx.request({
        url: api.AuthLoginByWeixin,
        data: { code: code, userInfo: {} },
        method: 'POST',
        success: (res) => {
          onCompleted(res)
        },
        fail: (err) => {
          console.log("login failed")
          onRejected(err)
        }
      })
    })
  }).then(res => {
    //存储用户信息
    if (res.data.userInfo) {
      wx.setStorageSync('userInfo', res.data.userInfo)
    }
    if (res.header['set-cookie']) {
      wx.setStorageSync('token', res.header['set-cookie'].split(';')[0])
    } else if (res.header['Set-Cookie']) {
      wx.setStorageSync('token', res.header['Set-Cookie'].split(';')[0])
    } else {
      reject(res)
    }
  }).catch(err => {
    util.showErrorToast('登录失败')
  })
}

// function login() {
//   return new Promise(function (resolve, reject) {
//     wx.login({
//       success: function (res) {
//         if (res.code) {
//           //登录远程服务器
//           console.log(res)
//           resolve(res);
//         } else {
//           reject(res);
//         }
//       },
//       fail: function (err) {
//         reject(err);
//       }
//     });
//   });
// }

function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        console.log(res)
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

function redirect(url) {

  //判断页面是否需要登录
  if (false) {
    wx.redirectTo({
      url: '/pages/auth/login/login'
    });
    return false;
  } else {
    wx.redirectTo({
      url: url
    });
  }
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}

module.exports = {
  formatTime,
  request,
  redirect,
  showErrorToast,
  checkSession,
  login,
  getUserInfo,
}


