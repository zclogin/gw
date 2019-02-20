// pages/news/news.js
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    pno:0,
    pageSize:4,
    hasMore:true//是否有下一页
  },
  loadMore: function () {
 //如果pagesize/pagecount==1
   if(this.data.hasMore){


 
    var pno = this.data.pno+1;
    var pageSize = this.data.pageSize;
    wx.request({
      url: 'http://127.0.0.1:3000/Message',
      data: {
        pno,
        pageSize
      },
      method: "get",
      success: (res) => {
        var rows=this.data.list.concat(res.data.data);
        console.log(res.data.pageCount);
        //第二次执行的时候得到了pageCount if（pagesize/pagecount>=1）{this.hasMore=false}
        console.log(pno);
        if(pno/res.data.pageCount>=1){
          this.setData({
            hasMore:false
          })
        }
        //
        //console.log(res.data.data);
       
        this.setData({
          list:rows,
          pno:pno
        })
      }
    })
    //
          }
    //
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadMore();
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
    this.loadMore();
    if(this.data.hasMore){
    wx.showToast({
      icon: 'loading',
      duration: 1000,
      mask: true
    })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})