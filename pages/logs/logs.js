//logs.js
const util = require('../../utils/util.js')
var Promise = require('../../lib/es6-promise.min.js');

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
