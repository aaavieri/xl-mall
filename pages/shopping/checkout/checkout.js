var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');
var Promise = require('../../../lib/es6-promise.min.js');

var app = getApp();

Page({
  data: {
    checkedGoodsList: [],
    checkedAddress: {},
    checkedCoupon: [],
    couponList: [],
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00,    //快递费
    couponPrice: 0.00,     //优惠券的价格
    orderTotalPrice: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
    addressId: 0,
    couponId: 0,
    postscript: '',
    buyType: '',
    buyCount: 0,
    buyGoodsId: 0
  },
  onLoad: function (options) {

    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      buyType: options.type
    })
    if (options.count) {
      this.setData({
        buyCount: parseInt(options.count)
      })
    }
    if (options.id) {
      this.setData({
        buyGoodsId: parseInt(options.id)
      })
    }
  },
  justbuy: function () {
    let that = this;
    util.request(api.GoodsJustBuy, { addressId: that.data.addressId, goodsId: this.data.buyGoodsId, number: this.data.buyCount}, 'POST').then(function (res) {
      if (res.success === true) {
        console.log(res.data);
        that.setData({
          checkedGoodsList: res.data.checkedGoodsList,
          checkedAddress: res.data.checkedAddress,
          actualPrice: res.data.actualPrice,
          // checkedCoupon: res.data.checkedCoupon,
          // couponList: res.data.couponList,
          // couponPrice: res.data.couponPrice,
          freightPrice: res.data.freightPrice,
          goodsTotalPrice: res.data.goodsTotalPrice,
          addressId: res.data.checkedAddress.id
          // orderTotalPrice: res.data.orderTotalPrice
        });
        wx.setStorageSync('addressId', res.data.checkedAddress.id);
      }
      wx.hideLoading();
    });
  },
  getCheckoutInfo: function () {
    let that = this;
    util.request(api.CartCheckout, { addressId: that.data.addressId, couponId: that.data.couponId }, 'POST').then(function (res) {
      if (res.success === true) {
        console.log(res.data);
        that.setData({
          checkedGoodsList: res.data.checkedGoodsList,
          checkedAddress: res.data.checkedAddress,
          actualPrice: res.data.actualPrice,
          // checkedCoupon: res.data.checkedCoupon,
          // couponList: res.data.couponList,
          // couponPrice: res.data.couponPrice,
          freightPrice: res.data.freightPrice,
          goodsTotalPrice: res.data.goodsTotalPrice,
          addressId: res.data.checkedAddress.id
          // orderTotalPrice: res.data.orderTotalPrice
        });
        wx.setStorageSync('addressId', res.data.checkedAddress.id);
      }
      wx.hideLoading();
    });
  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/shopping/address/address',
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/shopping/addressAdd/addressAdd',
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    try {
      var addressId = wx.getStorageSync('addressId');
      if (addressId) {
        this.setData({
          'addressId': addressId
        });
      }

      var couponId = wx.getStorageSync('couponId');
      if (couponId) {
        this.setData({
          'couponId': couponId
        });
      }
    } catch (e) {
      // Do something when catch error
    }
    // 页面显示
    wx.showLoading({
      title: '加载中...',
    })
    if (this.data.buyType === 'checkout') {
      this.getCheckoutInfo();
    } else if (this.data.buyType === 'justbuy') {
      this.justbuy();
    }
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  submitPay: function () {
    if (this.data.buyType === 'checkout') {
      this.submitOrder();
    } else if (this.data.buyType === 'justbuy') {
      this.submitOrderJustBuy();
    }
  },
  submitOrderJustBuy: function () {
    if (this.data.addressId <= 0) {
      util.showErrorToast('请选择收货地址');
      return false;
    }
    util.request(api.OrderSubmitJustBuy, { addressId: this.data.addressId, postscript: this.data.postscript, goodsId: this.data.buyGoodsId, number: this.data.buyCount }, 'POST').then(res => {
      if (res.success === true) {
        const orderId = res.data.id;
        pay.payOrder(parseInt(orderId)).then(res => {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=1&orderId=' + orderId
          });
        }).catch(res => {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=0&orderId=' + orderId
          });
        });
      } else {
        util.showErrorToast('下单失败');
      }
    });
  },
  submitOrder: function () {
    if (this.data.addressId <= 0) {
      util.showErrorToast('请选择收货地址');
      return false;
    }
    util.request(api.OrderSubmit, { addressId: this.data.addressId, postscript: this.data.postscript }, 'POST').then(res => {
      if (res.success === true) {
        const orderId = res.data.id;
        pay.payOrder(parseInt(orderId)).then(res => {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=1&orderId=' + orderId
          });
        }).catch(res => {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=0&orderId=' + orderId
          });
        });
      } else {
        util.showErrorToast('下单失败');
      }
    });
  }
})