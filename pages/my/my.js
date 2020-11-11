// pages/my/my.js
var common=require('../../utils/JS  common')  //引用公共JS文件
var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
   //临时微信头像
   nickName:'未登录',
   src:'/images/index.png',
   openid:'',
   flag:0,
   //临时收藏夹新闻数据
   myfavorite:[{
    openid:'',
    id:null,
    image:'',
    edition:'',
    title:''   
 }],
   num:0
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
    var that=this;
    that.setData({num: app.globalData.num, myfavorite: app.globalData.myfavorite});
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
    if (this.data.isLogin)
    {
      this.data.flag = 1;
      this.getMyFavorites();
    }
    else 
    {
      wx.stopPullDownRefresh({
        complete: function(){
          wx.showToast({
            title: '刷新成功',
          })
        }
      })
    }
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
  //获取用户信息
  getMyInfo:function(e){
    let info=e.detail.userInfo;
    this.setData({
      isLogin:true,           //确认登录状态
      src:info.avatarUrl,     //更新图片来源
      nickName:info.nickName  //更新昵称
    });
    app.globalData.isLogin = true;
    app.globalData.src = info.avatarUrl;
    app.globalData.nickName = info.nickName;
    //获取收藏列表
    this.getMyFavorites();
  },
  //获取收藏列表
  getMyFavorites:function(){
    var that=this;
    that.setData({openid:app.globalData.openid});
    wx.request({
      url: 'https://class.dlut-elab.com/feedback/zhouhongyi/myfavorite.php',
      method:'POST',
      data: {openid: app.globalData.openid},
      header:
        {
          "Content-type": "application/x-www-form-urlencoded"
        },
        success: function(res){
          that.setData({myfavorite: res.data,
          num: res.data.length});
          app.globalData.myfavorite = res.data;
          app.globalData.num = res.data.length;
          console.log("获取成功");
        },
        fail: function(res){
          console.log("失败");
        },
        complete: function(){
          if (that.data.flag)
          {
            wx.stopPullDownRefresh({
              complete: function(){
                wx.showToast({
                  title: '刷新成功',
                })
              }
            })
          }
        }
      })
  },
  gotoDetail:function(e){ 
    //获取携带的date-id数据
    let id=e.currentTarget.dataset.id;
    //携带新闻id进行页面跳转
    wx.navigateTo({
      url: '../detail/detail?id='+id,
    })
  }
})