var common = require("../../utils/util.js");
var config = require("../../utils/config.js");
var app = getApp();
var orderStatus=1;
Page({
  data: {
    orderListInfo: [],
    ingStatus:"on",
    edStatus:""
  },
  onLoad: function () {
    if (app.LoginId==0){
      wx.showModal({
        title: '提示信息',
        content:'您还未登录',
        confirmText:'去登录',
        success: function (res){
          if (res.confirm) {
            wx.navigateTo({
              url: '../bindTelphone/bindTelphone',
            })
          } else if (res.cancel) {
           
          }     
        }
      })
      // wx.navigateTo({
      //   url: '../bindTelphone/bindTelphone',
      // })
      return;
    }
    var that = this;
    var key = config.configObj.key;
    if (app.SecrectKey) {
      key = app.SecrectKey;
    }
    var loginId = config.configObj.loginId;
    if (app.LoginId != "0") {
      loginId = app.LoginId;
    }
    wx.showLoading({ title: '加载中'})
    wx.request({
      url: config.configObj.path,
      data: {
        Action: "/order/ListNewWeChat",
        body: JSON.stringify({ "OrderType": "0", "OrderStatus": orderStatus}),
        key: key,
        LoginId: loginId
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        that.setData({
          orderListInfo: res.data.Data
        })
      }
    })
    
  },
  orderedtap: function (e) {
    orderStatus = e.target.dataset.status;
    if (e.target.dataset.status == 1) {
      this.setData({
        ingStatus:"on",
        edStatus:"",
      })
    }else{
      this.setData({
        ingStatus: "",
        edStatus: "on",
      })
    }
    this.onLoad();
  },
  toOrderDetail: function (event) {
    console.log(event.currentTarget.dataset.id)
    if (event.currentTarget.dataset.id != "") {
      wx.navigateTo({
        url: '../orderdetail/orderdetail?orderId=' + event.currentTarget.dataset.id
      })
    }
  }
})