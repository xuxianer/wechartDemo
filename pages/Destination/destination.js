// destination.js
var amapFile = require('../../utils/amap-wx.js');
var config = require('../../utils/config.js');
var airPortPlugin = require('../../utils/airPortPlugin.js');
var city;
var app=getApp();
Page({
  /**
   * 生命周期函数--监听页面加载
   */
  data: { city: "北京", showOrhide: "hide", cityId:'566'},
  onLoad: function (options) {
    var key = config.configObj.key;
    if (app.SecrectKey){
      key = app.SecrectKey;
    }
    var loginId = config.configObj.LoginId;
    if (app.LoginId != "0") {
      loginId = app.LoginId;
    }
    city=options.city;
    var that=this;
    if(wx.canIUse("showLoading")){
      wx.showLoading({ title: '加载中', })
    } 
    wx.request({
      url: config.configObj.path,
      data: {
        Action: "/system/CheckApiVersion",
        body: JSON.stringify({ "RequestJDatas": [{ "Id": 3, "Version": "0" }]}),
        key: key,
        LoginId: loginId
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (json) {
        wx.hideLoading();
          var data=json.data;
          //var jsdata=JSON.parse(data);
          that.setData({
            cityList: airPortPlugin.airPorts(JSON.parse(data.Data[0].Values))
          })
         
      },
      fail:function(){
        wx.hideLoading();
        wx.showModal({ title:"网络错误"});
      }
    })
  },
  bindInput: function (e) {
    var that = this;
    var keywords = e.detail.value;
    city = that.data.city;
    that.setData({
      showOrhide:"hide",
      addshow: "show"
    });
    var myAmapFun = new amapFile.AMapWX({ key: 'd6c8864e5391722174a6e4e9af2e59d2' });
    myAmapFun.getInputtips({
      keywords: keywords,
      location: '',
      city: city,
      success: function (data) {
        if (data && data.tips) {
          that.setData({
            tips: data.tips
          });
        }

      }
    })
  },
  bindSearch: function (e) {
    var keywords = e.target.dataset.keywords;
    var location = e.target.dataset.location;
    //var url = '../pickUp/pickUp?addr=' + keywords;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    var cityId = this.data.cityId;
    
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      addr: keywords,
      cityId: cityId,
      location: location
    })
    wx.navigateBack({
      delta: 1
    })
  },
  bindCity:function(e){
      this.setData({
        showOrhide:"show",
        addshow:"hide"
      })
  },
  checkCity:function(e){
    var val = e.target.dataset.citys;
    var cityId = e.target.dataset.id;
    this.setData({
      city: val,
      cityId: cityId,
      showOrhide:"hide"
    })
  }
})