// searchRuslt.js
var config = require('../../utils/config.js');
var dataList="";//存储返回数据 减少请求
var app=getApp();
var md5 = require("../../utils/MD5.js");
var orderId="";
var UseType ="";
var CityId = "";
var PatternType = "";
var DuseLocationDetailAddress = "";
var DuseLocationLongitude = "";
var DuseLocationLatitude = "";
var AuseLocationDetailAddress = "";
var AuseLocationLongitude = "";
var AuseLocationLatitude = "";
var UseTime = "";
var PriceMark="";
var VehicleType=1;
var mobile="";
var FlightNumber="";
var totleCost="";
var optionParm="";
var NavTitleList={
  1:'接机',
  2:'送机'
};
Page({
  /**
   * 生命周期函数--监听页面加载
   */
  data: { CouponPrice: 0},
  onLoad: function (options) {
    optionParm = options;
    console.log(options);
    wx.setNavigationBarTitle({
      title: NavTitleList[options.PatternType]//页面标题为路由参数
    })
    var that=this;
     FlightNumber = options.FlightNumber
     mobile = options.mobile
     UseType = options.UseType;
     CityId = options.CityId;
     PatternType = options.PatternType;
     DuseLocationDetailAddress = options.DuseAddr;
     DuseLocationLongitude = options.DuseLng;
     DuseLocationLatitude = options.DuseLat;
     AuseLocationDetailAddress = options.AuseAddr;
     AuseLocationLongitude = options.AuseLng;
     AuseLocationLatitude = options.AuseLat;
     UseTime = options.time;
    var parm = { "UseType": UseType, "PatternType": PatternType, "CityId": CityId, "VehicleTypeList": [1, 2, 3, 6, 7, 4, 5, 18, 14, 19, 15, 20, 21, 16, 22, 17, 23, 24], "DuseLocationDetailAddress": DuseLocationDetailAddress, "DuseLocationLongitude": DuseLocationLongitude, "DuseLocationLatitude": DuseLocationLatitude, "AuseLocationDetailAddress": AuseLocationDetailAddress, "AuseLocationLongitude": AuseLocationLongitude, "AuseLocationLatitude": AuseLocationLatitude,"UseTime": UseTime}
    if (wx.canIUse("showLoading")) {
      wx.showLoading({ title: '加载中', })
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
        Action: "/car/PriceCouPon",
        body: JSON.stringify(parm),
        key: key,
        LoginId: loginId
      },
      method: 'POST',
      success: function (data) {
        wx.hideLoading();
        if (data.data.StatusCode!=200){
          wx.showToast({
            title: data.data.Message,
            icon: 'loading',
            duration: 1500
          })
          return false;
        }
        dataList=data;
        var defaultList=[];
        PriceMark = dataList.data.PriceMark;
        defaultList.push(dataList.data.QueryResultList[0]);
        totleCost = dataList.data.QueryResultList[0].Price;
        that.setData({
          carList: dataList.data.QueryResultList,
          carListBody: defaultList,
          CouponPrice: dataList.data.QueryResultList[0].Denomination,
          TotleCost: dataList.data.QueryResultList[0].Price - dataList.data.QueryResultList[0].Denomination,
          couponCode: dataList.data.QueryResultList[0].Code
        })
      }
    })
  },
  selectType:function(e){
    console.log(e);
    VehicleType = e.currentTarget.dataset.vehicletype;
    totleCost = e.currentTarget.dataset.price;
    var couponPrice="";
    var couponCode="";
    var newArry=[];
      for (var i = 0; i < dataList.data.QueryResultList.length; i++) {
        if (e.currentTarget.dataset.vehicletype == dataList.data.QueryResultList[i].VehicleType) {
          newArry.push(dataList.data.QueryResultList[i]);
          couponPrice = dataList.data.QueryResultList[i].Denomination;
          couponCode = dataList.data.QueryResultList[i].Code;
        }
      }
    this.setData({
      carListBody: newArry,
      CouponPrice: couponPrice,
      TotleCost: e.currentTarget.dataset.price - couponPrice,
      couponCode: couponCode
    })
  },
  toCouponList:function(e){
    if (app.LoginId == 0) {
      wx.navigateTo({
        url: '../bindTelphone/bindTelphone',
      })
      return;
    }
    console.log(totleCost);
      wx.navigateTo({     
        url: '../CouponList/CouponList?totleCost=' + totleCost,
      })
  },
  pay:function(e){
    if (app.LoginId == 0) {
      wx.navigateTo({
        url: '../bindTelphone/bindTelphone',
      })
      return;
    }
    this.onLoad(optionParm);
    var that=this;
    var key = config.configObj.key;
    if (app.SecrectKey) {
      key = app.SecrectKey; 
    }
    var loginId = config.configObj.LoginId;
    if (app.LoginId != "0") {
      loginId = app.LoginId;
    }
    var parm = { "PriceMark": PriceMark, "UseType": UseType, "PatternType": PatternType, "CityId": CityId, "ArriveCityId": 0, "VehicleType": VehicleType, "Mobile": mobile, "Name": "", "Remark": "", "FlightNumber": FlightNumber, "hotelId":0 }
    wx.showLoading({ title: '正在问您下单', })
    wx.request({
      url: config.configObj.path,
      data: {
        Action: "/car/CreateOrder",
        body: JSON.stringify(parm),
        key: key,
        LoginId: loginId
      },
      method: 'POST',
      success: function (data) {
        if (data.data.StatusCode!="200"){
           wx.showToast({
             title: data.data.Message,
             duration:1000
           })
           return;
        }
        orderId = data.data.Data.OrderId;
        var parm1 = { "OrderId": orderId, "CouponCode": that.data.couponCode, "Name": "", "Mobile": mobile, "Remark": "" }
        wx.request({
          url: config.configObj.path,
          data: {
            Action: "/car/orderUpdate",
            body: JSON.stringify(parm1),
            key: key,
            LoginId: loginId
          },
          method: 'POST',
          success: function (res) {
            if (data.data.StatusCode != "200") {
              wx.showToast({
                title: data.data.Message,
                duration: 1000
              })
              return;
            }
 
            var parm2 = { "OrderId": orderId, "OpenId": app.oppenId, "OrderType": 2 }
                wx.request({
                  url: config.configObj.path,
                  data: {
                    Action: "/PreparePay/WeChatJsApi",
                    body: JSON.stringify(parm2),
                    key: key,
                    LoginId: loginId
                  },
                  method: 'POST',
                  success: function (res) {
                    wx.hideLoading();
                    var nowTime = new Date();
                    var appId = "wx2dd647e6aa26e459";
                    var timeStamp1 = Math.round((nowTime.getTime()) / 1000);
                    var timeStamp = timeStamp1.toString();
                    var nonceStr = res.data.Data.Nonce_str;
                    var package1 = "prepay_id=" + res.data.Data.PrepareCode;
                    var signType = "MD5";
                    var key = res.data.Data.Key;//商户平台的key
                    var sign = res.data.Data.Sign;
                    var paySign = md5.hexMD5("appId=" + appId + "&nonceStr=" + nonceStr + "&package=" + package1 + "&signType=MD5&timeStamp=" + timeStamp + "&key=" + key);
                    wx.requestPayment({
                      timeStamp: timeStamp,
                      //随机字符串，长度为32个字符以下。
                      nonceStr: nonceStr,
                      //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*
                      package: package1,
                      //签名算法，暂支持 MD5
                      signType: 'MD5',
                      paySign: paySign,
                      success: function (res) {
                        wx.navigateTo({
                          url: '../orderdetail/orderdetail?orderId=' + orderId
                        })
                      },
                      fail: function (res) {

                      },
                      complete: function (res) {
                      }
                    })
                  }
                })
              
   

          }
        })


      }
    })
  }
})