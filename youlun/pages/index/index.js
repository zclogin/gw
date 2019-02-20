Page({
  handleTap1:function(e){
    //1.获取自定义属性
    //2.跳转到美食组件
    var id=e.target.dataset.id;
    var page="/pages/map/map";
    if(id==6){
      page="/pages/map/map";
    }
    wx.navigateTo({
      url: page
    })  
  },

  /**
   * 页面的初始数据
   */
  data: {
    list: [],  //轮播图
    text: "友情提示：自2018年9月1日起，禁止未预约私家车辆驶入吴淞口国际邮轮港港区内，违者将依据《中华人民共和国道路安全法》进行罚款人民币200元记3分处理",
    text2:"友情提示：因业务调整，沪杭专线于2019年1月30日起暂停运营，敬请谅解！。",
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marquee_margin: 30,
    size: 14,
    interval: 18, // 时间间隔
    
    navlist:[],  //九宫格
    butlist:[
      {id:1,img_url:"http://127.0.0.1:3000/img/link-01.png"},
      { id: 2, img_url: "http://127.0.0.1:3000/img/link-02.png" }
    ],
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getImages();
    this.getNavImages();
  },
  getImages: function () {
    var url = "http://127.0.0.1:3000/getImages";
    wx.request({
      url: url,
      method: "GET",
      success: (res) => {
        this.setData({
          list: res.data
        });
      },
    })
  },
  getNavImages: function () { 
    var url2="http://127.0.0.1:3000/getNavImages";
    wx.request({
      url:url2,
      method:"GET",
      success:(res)=>{
        this.setData({
          navlist:res.data
        })
      },
      fail:(res)=>{
        console.log(res);
      }
    });
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
    var that = this;
    var length = that.data.text.length * that.data.size;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    //console.log(length,windowWidth);
    that.setData({
      length: length,
      windowWidth: windowWidth
    });
    that.scrolltxt();// 第一个字消失后立即从右边出现
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
    
  },
  scrolltxt: function () {
    var that = this;
    var length = that.data.length;//滚动文字的宽度
    var windowWidth = that.data.windowWidth;//屏幕宽度
    if (length > windowWidth) {
      var interval = setInterval(function () {
        var maxscrollwidth = length + that.data.marquee_margin;//滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
        var crentleft = that.data.marqueeDistance;
        if (crentleft < maxscrollwidth) {//判断是否滚动到最大宽度
          that.setData({
            marqueeDistance: crentleft + that.data.marqueePace
          })
        }
        else {
          //console.log("替换");
          that.setData({
            marqueeDistance: 0 // 直接重新滚动
          });
          clearInterval(interval);
          that.scrolltxt();
        }
      }, that.data.interval);
    }
    else {
      that.setData({ marquee_margin: "1000" });//只显示一条不滚动右边间距加大，防止重复显示
    }
  }
})