// CouponList.js
var config = require("../../utils/config.js");
var app=getApp();
var totlprice="";
Page({
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    totlprice = options.totleCost;
    var that = this;
    if (wx.canIUse("showLoading")) {
      wx.showLoading({ title: '加载中' })
    }
    var key = config.configObj.key;
    if (app.SecrectKey) {
      key = app.SecrectKey;
    }
    var loginId = config.configObj.LoginId;
    if (app.LoginId != "0") {
      loginId = app.LoginId;
    }
    wx.request({
      url: config.configObj.path,
      data: {
        Action: "/Coupon/CouponWeChat",
        body: JSON.stringify({ "LoginId": app.LoginId}),
        key: key,
        LoginId: loginId
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (json) {
        wx.hideLoading();
        that.setData({
          CouponList:json.data.Data
        })
      }
    })
  },
  selectCoupon:function(e){
    var price = e.currentTarget.dataset.price;
    var code = e.currentTarget.dataset.code;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      CouponPrice: price,
      TotleCost: totlprice-price,
      couponCode: code,
    })
    wx.navigateBack({
      delta: 1
    })
  }
})