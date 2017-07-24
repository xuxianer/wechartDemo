//app.js
var config=require('utils/config.js');
App({
  onLaunch: function () {
  
    //调用API从本地缓存中获取数据
    if (wx.openBluetoothAdapter) {
      wx.openBluetoothAdapter();
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.getUserInfo();
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (data) {
          console.log(data);
          var d = that.globalData;
          that.code = data.code;
          wx.request({
            url: config.configObj.path,
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            data: {
              Action: "/Member/WeiBeforeLogin",
              body: JSON.stringify({ "Code":data.code})
             // key: "ff8DW37J"
            },
            success: function (res) {
              console.log(res) //获取openid  
              that.oppenId = res.data.Data.OpenId;
              that.LoginId = res.data.Data.LoginId;
              that.SecrectKey = res.data.Data.SecrectKey;
            }
          }) 
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo);           
            },
            complete:function(res){
              that.getuserLocation();
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    appid: 'wx2dd647e6aa26e459',
    secret:'6f2afcca3ad3a2c9058a44c6cdc2c9a0'

  },
  getuserLocation:function(){
    wx.getSetting({
      success(res) {
        if (!res['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
            }
          })
        }
      }
    })
  }
  
  
})


