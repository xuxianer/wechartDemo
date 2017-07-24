// bindTelphone.js
var config=require('../../utils/config.js');
var app=getApp();
var telephone="";
var flag=true;
var codeId="";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:"获取验证码"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  teleNo:function(e){
    telephone=e.detail.value
  },
  getCode:function(e){
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(190))+\d{8})$/;
    if (!myreg.test(telephone)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'success',
        duration: 1200
      })
      return false;
    }
    if(!flag){
      return;
    }
    flag=false;
    var voiceMsg = "";
    var n = 30;
    var i = setInterval(function () {
      n--;
      if (n > 0) {
        voiceMsg = n + 's后重发';
        that.setData({
          msg: voiceMsg
        })
      } else {
        flag = true;
        that.setData({
          msg: "获取验证码"
        })
        clearInterval(i);
      }
    }, 1000) 
    var that=this;
    var param = { "TypeId": 2, IsRegister: 0, Mobile: telephone }
    var key = config.configObj.key;
    if (app.SecrectKey) {
      key = app.SecrectKey;
    }
    wx.request({
      url: config.configObj.path,
      data: {
        Action: "/Common/GetMobileSecurityCode",
        body: JSON.stringify(param),
        key: key,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (json) {
        if (json.data.StatusCode!=200){
           wx.showToast({
             title: json.data.Message ,
             duration:1200
           })
        }
        codeId = json.data.Data.CodeId;
      }
    })
    
  },
  submit:function(e){
    var key = config.configObj.key;
    if (app.SecrectKey) {
      key = app.SecrectKey;
    }
    var param={
      Mobile: e.detail.value.phoneNo,
      SecurityCode: e.detail.value.code,
      CodeId:codeId,
      OpenId: app.oppenId
    }

    wx.request({
      url: config.configObj.path,
      data: {
        Action: "/Member/WeChatLoginByCode",
        body: JSON.stringify(param),
        key: key,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (json) {
        app.LoginId = json.data.Data.LoginId;
        app.oppenId = json.data.Data.OpenId;
        app.SecrectKey = json.data.Data.SecrectKey;
        var pages = getCurrentPages();
        var prePage = pages[pages.length - 2];
        prePage.setData({
          hidden:true
        })
        wx.navigateBack({
          delta: 1
        })
      }
    })
  }

})