var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var Promise = require('../../../lib/es6-promise.min.js');

const mobileReg = new RegExp('1[0-9]{10}')

var app = getApp();

Page({
  data: {
    array: ['请选择反馈类型', '商品相关', '物流状况', '客户服务', '优惠活动', '功能异常', '产品建议', '其他'],
    index: 0,
    content: '',
    mobile: ''
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindMobile: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  bindFeedback: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  onLoad: function (options) {
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },
  addFeedback: function () {
    if (this.data.index <= 0) {
      return util.showErrorToast('请您选择反馈类型')
    }
    if (this.data.content.trim().length === 0) {
      return util.showErrorToast('请您输入反馈内容')
    }
    if (this.data.mobile.trim().length === 0) {
      return util.showErrorToast('请您输入手机号码')
    }
    if (!mobileReg.test(this.data.mobile.trim())) {
      return util.showErrorToast('您输入的号码格式有误')
    }
    let that = this
    util.request(api.FeedbackAdd, { feedbackType: this.data.array[this.data.index] , content: this.data.content, mobile: this.data.mobile }, 'POST').then(function (res) {
      if (res.success === true) {
        wx.showToast({
          title: '提交成功',
          icon: 'success'
        })
        that.data.index = 0;
        that.data.content = '';
      }
    });
  }
})