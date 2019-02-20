// pages/shoplist/shoplist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],  //保存分页返回数据
    pageIndex:0, //保存分页  
    pageSize:7,   //保存页大小
    hasMore:true  //是否有下一页数据
  },
  loadMore:function(){
    //4.分页数据
    //如果当前是最后一页，不再发送请求
    if(this.data.hasMore===false){
      return;
    }
    console.log("分页");
    wx.showLoading({
      title: '正在加载数据...',
    });
    
    //1.获取2个数值 pno ps
    var pno=this.data.pageIndex+1;
    var ps=this.data.pageSize;
    //2.发送请求/getShopList
    wx.request({
      url: 'http://127.0.0.1:3000/getShopList',
      data:{pno:pno,pageSize:ps},
      success:(res)=>{
        //收到数据 多显示1s 再隐藏
        setTimeout(function () {
          wx.hideLoading();
        }, 1000);
        var rows=this.data.list.concat(res.data.data); //拼接数组，将下一页的内容拼接
        console.log(res.data);
        var pc=res.data.pageCount;//获取总页数
        var flag=pno<pc;  //判断是否有下一页数据
        this.setData({ 
          list:rows,
          pageIndex:pno,
          hasMore:flag  //保存判断结果
        })
      }
    });
    //3.获取返回的当前页的内容
    //4.显示加载动画
    //5.1500ms后隐藏动画
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
    //console.log("用户下拉操作...刷新第一页内容");
    //清空原有页码
    //清除原有数据列表
    //清除原有的判断条件
    this.setData({
      pageIndex:0,
      list:[],
      hasMore:true
    })
    this.loadMore();
  },

  /**
   * 页面上拉触底事件的处理函数
   * 下一页
   */
  onReachBottom: function () {
    this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})