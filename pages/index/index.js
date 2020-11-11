// pages/index/index.js
var common=require('../../utils/JS  common')  //引用公共JS文件
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
   //幻灯片素材

   flag:0,
   get:false,
  swiperImg:[{
    id:null,
    image:'',
    edition:'',
    title:'',
    content:'' 
  }],
   //临时新闻数据

  newsList:[{
    id:null,
    image:'',
    edition:'',
    title:'',
    content:''  
  }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取新闻列表
    var that = this;
    if (that.data.get==false)
    {
      wx.showToast({
        title: '加载中...',
        icon:'loading',
        duration: 3000
      })
    }
    wx.request({
      url: 'https://class.dlut-elab.com/feedback/zhouhongyi/getnews.php',
      method:'POST',
      header:
        {
          "Content-type": "application/x-www-form-urlencoded"
        },
        success: function(res){
          that.setData({newsList: res.data});
          app.globalData.news = res.data;
          console.log("获取成功");
        },
        fail: function(res){
          console.log("失败");
        },
        complete: function(){
          if (that.data.get==false)
          {
            wx.hideToast();
          }
          that.setData({get: true});
          if (that.data.flag)
          {
            wx.stopPullDownRefresh({
              complete:function(){
                wx.showToast({
                  title: '已为最新内容',
                })
              }
            })
          }
        }
      })
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
    this.data.flag=1;
    this.onLoad();
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
  /**
   * 自定义函数-跳转新页面浏览新闻内容
   */
  gotoDetail:function(e){ 
   //获取携带的date-id数据
   let id=e.currentTarget.dataset.id;
   //携带新闻id进行页面跳转
   wx.navigateTo({
     url: '../detail/detail?id='+id,
   })
  }
})