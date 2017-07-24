// searchPlaneRes.js
var config=require("../../utils/config.js");
var FlightNumber="";
var date="";
var time="";
var EndCityName="";
var EndTerminal="";
var EndCityId="";
var EndTerminalLat="";
var EndTerminalLng="";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var data1 = { "FlightNumber": options.planeNo, "StartDate": options.time }
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
          Action: "/tools/flightInfo",
          body: JSON.stringify(data1),
          key: key,
          LoginId: loginId
        },
        method: 'POST',
        success:function(data){
          wx.hideLoading();
          var startTime = data.data.Data[0].PlanStartTime;
          var newTime = startTime.substring(11, startTime.length);
          var PlanEndTime = data.data.Data[0].PlanEndTime;
          var newTime2 = PlanEndTime.substring(11, PlanEndTime.length);
          FlightNumber = data.data.Data[0].FlightNumber;
          date = PlanEndTime.substring(0,10);
          time = newTime2;
          EndCityName = data.data.Data[0].EndCityName;
          EndTerminal = data.data.Data[0].EndTerminal;
          EndCityId = data.data.Data[0].EndCityId;
          EndTerminalLat = data.data.Data[0].EndTerminalLat;
          EndTerminalLng = data.data.Data[0].EndTerminalLng;
          that.setData({
            Company: data.data.Data[0].Company,
            FlightNumber: FlightNumber,
            PlanStartTime: newTime,
            StartCityName: data.data.Data[0].StartCityName,
            StartTerminal: data.data.Data[0].StartTerminal,
            PlanEndTime: newTime2,
            EndCityName: EndCityName,
            EndTerminal: EndTerminal
          })    
        }
      })
  },
  checkAndBack:function(){
    var pages = getCurrentPages(); //当前页面
    var prevPage = pages[pages.length - 3]; 
     console.log(FlightNumber);
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      FlightNumber: FlightNumber,
      date:date,
      time:time,
      EndCityName: EndCityName + "   " + EndTerminal,
      EndCityId: EndCityId,
      lat: EndTerminalLat,
      lng: EndTerminalLng
    })
    wx.navigateBack({
      delta: 2
    }) 
  }
})