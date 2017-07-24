//index.js
var util = require('../../utils/util.js');
var config = require('../../utils/config.js');
//获取应用实例
var app = getApp();
var PatternType=1;
app.showModel=false;
var now = new Date();
var endDate = now.getTime() + 1000 * 60 * 60 * 24 * 30;
Page({
  data: { 
    dateStart: util.formatTime(now),
    endDate: util.getTime(new Date(endDate)),
    date: util.formatTime(now), 
    time: util.getTime(now),
    EndCityName:"您从哪个机场出发",
    addr:"您要去哪里",
    showOrHidden:"show",
    jjStatus:"on",
    sjStatus:"",
    start:"airPort",
    end:"chooseAdd",
    action:"SearchJJform"
  },
  onLoad: function (options) {
    if (app.LoginId==0){
      this.setData({
        hidden: false
      })
    } else{
      this.setData({
        hidden: true
      })
    } 
  },
  bindDateChange: function (e) {   
    if (PatternType==1&&this.data.FlightNumber){
      wx.showModal({
        title: '提示说明',
        content: '有航班号时,司机将按照航班实际抵达时间为您服务,若要修改，请先删除航班号',
      })
      return;
    }
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    if (PatternType == 1&&this.data.FlightNumber) {
      wx.showModal({
        title: '提示说明',
        content: '有航班号时,司机将按照航班实际抵达时间为您服务,若要修改，请先删除航班号',
      })
      return;
    }
    this.setData({
      time: e.detail.value
    })
  },
  SearchJJform:function(e){
    var location = this.data.location;
    var UseType="1";
    var UseTime = e.detail.value.date + " "+e.detail.value.time+":00";
    var DuseLocationDetailAddress = this.data.EndCityName;
    var CityId = this.data.cityId;
    var DuseLocationLatitude = this.data.lat;
    var DuseLocationLongitude = this.data.lng;
    var AuseLocationDetailAddress=this.data.addr;
    var checkTime = new Date(UseTime).getTime();
    var nowTime = new Date().getTime();
    if (checkTime - nowTime < 60 * 1000 * 30) {
      wx.showToast({
        title: '请选择30分钟以后的时间',
        duration: 1500
      })
      return;
    }
    if (this.data.EndCityName == "您从哪个机场出发") {
      wx.showToast({
        title: '请填写机场信息',
        duration: 1000
      })
      return;
    }
    if (this.data.addr == "您要去哪里") {
      wx.showToast({
        title: '请填写目的地',
        duration: 1000
      })
      return;
    }
    if (e.detail.value.telPhone == "") {
      wx.showToast({
        title: '请填写手机号',
        duration: 1000
      })
      return;
    }
    if(location.length==0){
      wx.showToast({
        title: '请填写详细的目的地',
        duration: 1000
      })
      return;
    }
    var AuseLocationLongitude = location.split(",")[0];
    var AuseLocationLatitude = location.split(",")[1];
    
    
    wx.navigateTo({
      url: '../searchRuslt/searchRuslt?UseType=' + UseType + '&PatternType=' + PatternType + '&CityId=' + CityId + '&time=' + UseTime + '&DuseAddr=' + DuseLocationDetailAddress + '&DuseLng=' + DuseLocationLongitude + '&DuseLat=' + DuseLocationLatitude + '&AuseAddr=' + AuseLocationDetailAddress + '&AuseLng=' + AuseLocationLongitude + '&AuseLat=' + AuseLocationLatitude + '&mobile=' + e.detail.value.telPhone + '&FlightNumber=' + e.detail.value.planeNo,
    })
  },
  SearchSJform: function (e) {
    var location = this.data.location;
    var UseType = "1";
    var UseTime = e.detail.value.date + " " + e.detail.value.time + ":00";
    var DuseLocationDetailAddress = this.data.addr;
    var CityId = this.data.cityId;
    var checkTime = new Date(UseTime).getTime();
    var nowTime = new Date().getTime();
    if (checkTime - nowTime < 60 * 1000 * 30) {
      wx.showToast({
        title: '请选择30分钟以后的时间',
        duration: 1500
      })
      return;
    }
    if (this.data.EndCityName == "您要去哪个机场") {
      wx.showToast({
        title: '请填写机场信息',
        duration: 1000
      })
      return;
    }
    if (this.data.addr == "您从哪出发") {
      wx.showToast({
        title: '请填写目的地',
        duration: 1000
      })
      return;
    }
    if (e.detail.value.telPhone == "") {
      wx.showToast({
        title: '请填写手机号',
        duration: 1000
      })
      return;
    }
    if (location.length == 0) {
      wx.showToast({
        title: '请填写详细的目的地',
        duration: 1000
      })
      return;
    }
    var DuseLocationLatitude = location.split(",")[1];
    var DuseLocationLongitude =location.split(",")[0];
    var AuseLocationDetailAddress = this.data.EndCityName;
    var AuseLocationLongitude = this.data.lng;
    var AuseLocationLatitude = this.data.lat;

    wx.navigateTo({
      url: '../searchRuslt/searchRuslt?UseType=' + UseType + '&PatternType=' + PatternType + '&CityId=' + CityId + '&time=' + UseTime + '&DuseAddr=' + DuseLocationDetailAddress + '&DuseLng=' + DuseLocationLongitude + '&DuseLat=' + DuseLocationLatitude + '&AuseAddr=' + AuseLocationDetailAddress + '&AuseLng=' + AuseLocationLongitude + '&AuseLat=' + AuseLocationLatitude + '&mobile=' + e.detail.value.telPhone,
    })
  },
  chooseAdd: function (e) {
    wx.navigateTo({
      url: '../Destination/destination',
    })
  },
  InNo:function(){
    wx.navigateTo({
      url: '../planeNo/planeNo',
    })
  },
  clearFlightNumber:function(){
     this.setData({
       FlightNumber:""
     })
  },
  airPort:function(){
    if (PatternType == 1 &&this.data.FlightNumber) {
      wx.showModal({
        title: '提示说明',
        content: '有航班号时,司机将按照航班实际抵达地点为您服务,若要修改，请先删除航班号',
      })
      return;
    }
    wx.navigateTo({
      url: '../airPort/airPort',
    })
  },
  getTel:function(e){
    this.setData({
      telphone: e.detail.value
    })
  },
  confirm:function(e){
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(190))+\d{8})$/;
    if (!myreg.test(this.data.telphone)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
    wx.navigateTo({
      url: '../bindTelphone/bindTelphone',
    })
    // var disabled = true;
    // if (this.data.telphone == "" || !this.data.telphone){
    //     disabled=false;
    // }
    // var key = config.configObj.key;
    // if (app.SecrectKey) {
    //   key = app.SecrectKey;
    // }
    // var loginId = config.configObj.LoginId;
    // if (app.LoginId != "0") {
    //   loginId = app.LoginId;
    // }
    // wx.request({
    //   url: config.configObj.path,
    //   data: {
    //     Action: "/Member/WeChatSetCoupon",
    //     body: JSON.stringify({ "Mobile": this.data.telphone, OpenId: app.oppenId}),
    //     key: key,
    //     LoginId: loginId
    //   },
    //   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   // header: {}, // 设置请求的 header
    //   success: function (json) {
    //     var title="";
    //     if (json.data.Data.IsFirst=="1"){
    //       title="领取成功";
    //     }else{
    //       title = "已经领取过";
    //     }
    //     wx.showToast({
    //       title: title,
    //       icon: 'success',
    //       duration: 1000
    //     })
    //   }
    // })
    //   this.setData({
    //     telphone: this.data.telphone,
    //     disabled: disabled,
    //     hidden: true
    //   })
  },
  cancel:function(e){
    this.setData({
      disabled: false,
      hidden: true
    })
  },
  goRule:function(e){
    wx.navigateTo({
      url: '../cancelrule/cancelrule',
    })
  },
  JSJTab:function(e){
    if (e.target.dataset.status==1){
      PatternType = 1;
      this.setData({
        jjStatus:"on",
        sjStatus:"",
        showOrHidden:"show",
        EndCityName: "您从哪个机场出发",
        addr: "您要去哪里",
        action: "SearchJJform" 
      })
    }else{
      PatternType=2;
      this.setData({
        jjStatus: "",
        sjStatus: "on",
        showOrHidden: "hide",
        EndCityName: "您要去哪个机场",
        addr: "您从哪出发",
        action: "SearchSJform"
      })
    }
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '阳光车导',
      path: '/pages/index/index?id=123',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
  

})
