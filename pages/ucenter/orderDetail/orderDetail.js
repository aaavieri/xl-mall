var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var Promise = require('../../../lib/es6-promise.min.js');

Page({
  data: {
    orderId: 0,
    orderInfo: {},
    orderGoods: [],
    handleOption: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id
    });
    this.getOrderDetail();
  },
  getOrderDetail() {
    let that = this;
    util.request(api.OrderDetail, {
      orderId: that.data.orderId
    }).then(function (res) {
      if (res.success === true) {
        console.log(res.data);
        that.setData({
          orderInfo: res.data,
          orderGoods: res.data.goodsList,
          handleOption: res.data.handleOption
        });
        //that.payTimer();
      }
    });
  },
  payTimer() {
    let that = this;
    let orderInfo = that.data.orderInfo;

    setInterval(() => {
      console.log(orderInfo);
      orderInfo.add_time -= 1;
      that.setData({
        orderInfo: orderInfo,
      });
    }, 1000);
  },
  cancelOrder(event) {
    new Promise(resolve => {
      wx.showModal({
        title: '删除订单！',
        content: '您确认删除订单吗？',
        success: (res) => {
          if (res.confirm) resolve()
        }
      })
    }).then(() => {
      let order = this.data.orderList[event.target.dataset.orderIndex]
      let that = this
      return util.request(api.OrderCancel, { orderId: that.data.orderId }, 'POST')
      }).then(this.getOrderDetail)
  },
  payOrder() {
    wx.redirectTo({
      url: `/pages/pay/pay?orderId=${this.data.orderId}&actualPrice=${order.orderInfo.actualPrice}`,
    })
    // let that = this;
    // util.request(api.PayPrepayId, {
    //   orderId: that.data.orderId
    // }, 'POST').then(function (res) {
    //   if (res.success === true) {
    //     const payParam = res.data;
    //     wx.requestPayment({
    //       'timeStamp': payParam.timeStamp,
    //       'nonceStr': payParam.nonceStr,
    //       'package': payParam.package,
    //       'signType': payParam.signType,
    //       'paySign': payParam.paySign,
    //       'success': function (res) {
    //         console.log(res)
    //       },
    //       'fail': function (res) {
    //         util.showErrorToast('支付失败')
    //       }
    //     });
    //   }
    // });

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})