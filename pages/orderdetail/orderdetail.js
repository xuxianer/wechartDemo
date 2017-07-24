var md5 = require("../../utils/MD5.js");
var config = require("../../utils/config.js");
var app = getApp();
//console.log(md5.hexMD5("a"));
Page({
  data: {
    orderDetailInfo: {},
    driverInfoIsShow: false
  },
  onLoad: function (options) {
    var that = this;
    var key = config.configObj.key;
    if (app.SecrectKey) {
      key = app.SecrectKey;
    }
    var loginId ="1964720"
    if (app.LoginId != "0") {
      loginId = app.LoginId;
    }
    wx.request({
      url: config.configObj.path,
      data: { 
        Action: "/car/WeiOrderDetail",
				body: '{"OrderId": "'+ options.orderId +'"}',
        key: key,
        LoginId: loginId	
      },
      method: 'POST', 
      success: function (res) {
        var orderDetailInfo = res.data.Data;
        //是否显示司机信息
        if(orderDetailInfo.DriverModel.DriverId == 0){
        	that.setData({
			      driverInfoIsShow: false
			    })
        } else {
        	that.setData({
			      driverInfoIsShow: true
			    })
        }
        //实际支付金额
      // if(orderDetailInfo.OrderModel.PayStatus == "1"){
      //   orderDetailInfo.OrderModel.realMoney = parseInt(orderDetailInfo.OrderModel.OrderPrice) - parseInt(orderDetailInfo.CouponModel.CouponPrice);
        
      // }else{
      //   orderDetailInfo.OrderModel.realMoney = "0"
      // } 
        that.setData({
		      orderDetailInfo: orderDetailInfo
		    })
      }
    })
  },
  // //联系司机
  // callDriver: function () {
  // 	var that = this;
  //   wx.makePhoneCall({
  //     phoneNumber: that.data.orderDetailInfo.DriverModel.Mobile,
  //     success:function(){
  //       console.log("拨打电话成功！")
  //     },
  //     fail:function(){
  //       console.log("拨打电话失败！")
  //     }
  //   })
  // },
  //支付
  wxpay: function () {
  	var that = this;
    var key = config.configObj.key;
    if (app.SecrectKey) {
      key = app.SecrectKey;
    }
    var loginId = "1964720"
    if (app.LoginId!="0") {
      loginId = app.LoginId;
    }
    var parm1={
      OrderId: that.data.orderDetailInfo.OrderModel.OrderId,
      OpenId: app.oppenId
    }
		  	wx.request({
          url: config.configObj.path,
				data: { 
				  	Action: "/PreparePay/WeChatJsApi",
            body: JSON.stringify(parm1),
          key: key,
          LoginId: loginId	
				},
				method: 'POST', 
				success: function (res) {
					console.log(res.data)
					var nowTime = new Date();
			        var appId = "wx2dd647e6aa26e459";
			        var timeStamp1 = Math.round((nowTime.getTime()) / 1000);
			        var timeStamp = timeStamp1.toString();
			        var nonceStr = res.data.Data.Nonce_str;
			        var package1 = "prepay_id=" + res.data.Data.PrepareCode;
			        var signType = "MD5";
			        var key = res.data.Data.Key;//商户平台的key
			        var sign = res.data.Data.Sign;
			        var paySign = md5.hexMD5("appId=" + appId +"&nonceStr=" + nonceStr + "&package=" + package1 + "&signType=MD5&timeStamp=" + timeStamp + "&key=" + key );
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
						        url: '../orderingList/orderingList'
						      })
			          },
			          fail: function (res) {
			          },
			          complete: function (res) {
			          }
			        })
				}
			})
 
  },
  //联系客服
  callservice: function () {
  	var that = this;
    wx.makePhoneCall({
      phoneNumber: "010-62222222",
      success:function(){
        console.log("拨打电话成功！")
      },
      fail:function(){
        console.log("拨打电话失败！")
      }
    })
  },
  //取消订单
  cancelorder: function(){
  	var that = this;
    var key = config.configObj.key;
    if (app.SecrectKey) {
      key = app.SecrectKey;
    }
    var loginId = "1964720"
    if (app.LoginId != "0") {
      loginId = app.LoginId;
    }
  	wx.request({
      url: config.configObj.path,
		  data: { 
        Action: "/car/OrderCancelPrice",
					body: '{"OrderId": "'+ that.data.orderDetailInfo.OrderModel.OrderId +'"}',
          key: key,
          LoginId: loginId	
		  },
		  method: 'POST', 
		  success: function (res) {
		    if(res.data.StatusCode == 200){
		    	if(res.data.Data.CancelFee == 0){
		    		wx.showModal({
						title: '提示',
						content: '您确认要取消订单',
            cancelText:'否',
						confirmText: "是",
						success: function(res) {
              if (res.cancel) {
						   		console.log('用户点击否')
						  	} else {
						  		wx.request({
                    url: config.configObj.path,
							      data: { 
							      	Action: "/car/OrderCancel",
									body: '{"OrderId": "'+ that.data.orderDetailInfo.OrderModel.OrderId +'"}',
                  key: key,
                  LoginId: loginId	
							      },
							      method: 'POST', 
							      success: function (res) {
							        console.log(res.data)
							        if(res.data.StatusCode == 200){
                        wx.navigateBack({
                          delta: 1
                        })
							        }
							      }
							    })
						  	}
						}
					})
		    	} else {
		    		wx.showModal({
              title: '提示',
              content: '您确认要取消订单',
              cancelText: '否',
              confirmText: "是",
					  success: function(res) {
              if (res.cancel) {
					   		console.log('用户点击否')
					  	} else {
					  		wx.request({
                  url: config.configObj.path,
						      data: { 
						      	Action: "/car/OrderCancel",
								body: '{"OrderId": "'+ that.data.orderDetailInfo.OrderModel.OrderId +'"}',
								key: key,
                LoginId: loginId	
						      },
						      method: 'POST', 
						      success: function (res) {
						        console.log(res.data)
						        if(res.data.StatusCode == 200){
                      wx.navigateBack({
                        delta: 1
                      })
						        }
						      }
						    })
					  	}
					  }
					})
		    	}
		    }
		  }
	})
  }
})
