// pages/register/register.js
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    uname:"",
    passport:"",
    phone:"",
    validate:""
  },
  formSubmit: function (e) {
    var uname = e.detail.value.uname;
    var passport = e.detail.value.passport;
    var phone = e.detail.value.phone;
    var validate = e.detail.value.validate;
    var reg1 =/^[\u4e00-\u9fa5]{1,6}$/;
    if(!(reg1.test(uname))){
      wx.showToast({  
        icon:"none",
        title:"请输入正确的姓名"
      })
      return;
    }
    var reg2 =/^([PSE]{1}\d{7}|[GS]{1}\d{8})$/;
    if (!(reg2.test(passport))){
      wx.showToast({
        icon: "none",
        title: "请输入正确的护照号"
      })
      return;
    }
    console.log(11);
    var reg3 = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!(reg3.test(phone))) {
      wx.showToast({
        icon: "none",
        title: "请输入正确的手机号"
      })
      return;
    }
    /*验证码1234*/
    var reg4 = /^[1][2][3][4]$/;
    if (!(reg4.test(validate))) {
      wx.showToast({
        icon: "none",
        title: "请输入重新出入验证码"
      })
      return;
    }
    //注册
    wx.request({
      url: 'http://127.0.0.1:3000/regist', // 
      data: {
        uname: uname,
        passport: passport,
        phone:phone
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if(res.data.code==1){
          wx.showToast({
            title: '注册成功',
          })
        }
      }
    })
    //注册
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})