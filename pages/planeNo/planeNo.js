// planeNo.js
var date = require('../../utils/util.js');
var config= require('../../utils/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: date.formatTime(new Date())
  },
    bindDateChange: function (e) {
      this.setData({
        date: e.detail.value
      })
    },
    SearchPlaneform:function(e){
      var planeNo=e.detail.value.planeNo;
      var time = e.detail.value.date;
      if (planeNo=="") {
        wx.showToast({
          title: '请填写航班号！',
          icon: 'loading',
          duration: 1500
        })
        return false;
      }
      wx.navigateTo({
        url: '../searchPlaneRes/searchPlaneRes?planeNo='+planeNo+'&time='+time,
      })
    }

})