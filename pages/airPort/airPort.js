// airPort.js
var config = require("../../utils/config.js");
var airPorts=require("../../utils/airPortPlugin.js");
var dataList=[];//返回数据放内存，减少请求
var app = getApp();
Page({

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
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
        Action: "/system/CheckApiVersion",
        body: JSON.stringify({ "RequestJDatas": [{ "Id": 7, "Version": "0" }] }),
        key: key,
        LoginId: loginId
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (json) {
        wx.hideLoading();
        var data = JSON.parse(json.data.Data[0].Values);
        dataList=data;
        that.setData({
          AirportList: airPorts.airPorts(data)
        })
      },
      fail: function () {
        wx.hideLoading();
        wx.showModal({ title: "网络错误" });
      }
    })
  },
  searcAirLike:function(e){
    var newResArry=[];
    var keywords = e.detail.value
    for(var i=0;i<dataList.length;i++){
      if (dataList[i].CityName.indexOf(keywords) > -1 || dataList[i].Name.indexOf(keywords)>-1){
        newResArry.push(dataList[i]);
      }
    }
    this.setData({
      AirportList: airPorts.airPorts(newResArry)
    })

  },
  checkAriPort:function(e){
    var pages=getCurrentPages();
    var prePage = pages[pages.length - 2];
    prePage.setData({
      EndCityName: e.target.dataset.cityallname,
      lat: e.target.dataset.lat,
      lng: e.target.dataset.lng,
    })
    wx.navigateBack({
       delta:1
    })
  }


})