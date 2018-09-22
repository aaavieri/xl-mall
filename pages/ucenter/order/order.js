var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var Promise = require('../../../lib/es6-promise.min.js');

Page({
  data:{
    orderList: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

    this.getOrderList();
  },
  getOrderList(){
    let that = this;
    util.request(api.OrderList).then(function (res) {
      if (res.success === true) {
        console.log(res.data);
        that.setData({
          orderList: res.data
        });
      }
    });
  },
  payOrder(event){
    let order = this.data.orderList[event.target.dataset.orderIndex]
    wx.redirectTo({
      url: `/pages/pay/pay?orderId=${order.id}&actualPrice=${order.actualPrice}`,
    })
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
      return util.request(api.OrderCancel, {orderId: order.id}, 'POST')
    }).then(this.getOrderList)
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})