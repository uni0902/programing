// pages/comment/comment.js
var common=require('../../utils/JS  common')  //引用公共JS文件
var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
   //临时评论数据
   flag:0,
   plain:[{content:"暂无评论..."}],
   id:'', 
   title:'',
   num:0,
   edition:'',
   get:false,
    com:'',
    comments:[{
    id:'',
    username:'',
    userimage:'',
    comment:'',
    time:''
 }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (that.data.get==false)
    {
      wx.showToast({
        title: '评论加载中...',
        icon:'loading'
      })
    }
    that.data.id = options.id;
    wx.request({
      url: 'https://class.dlut-elab.com/feedback/zhouhongyi/comments.php',
      method:'POST',
      data:{id: that.data.id},
      header:
        {
          "Content-type": "application/x-www-form-urlencoded"
        },
        success: function(res){
          for (var i=0; i<app.globalData.news.length; i++)
          {
            if (app.globalData.news[i].id == that.data.id)
            {
              that.setData({
                title: app.globalData.news[i].title,
                edition: app.globalData.news[i].edition
              })
            }
          }
          that.setData({comments: res.data, num: res.data.length});
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
                  title: '刷新成功',
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
    this.data.flag = 1;
    let options = {id:this.data.id};
    this.onLoad(options)
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

  getincomments: function(e)
  {
    if (app.globalData.isLogin==false)
    {
      wx.showToast({
        title: '请先登录',
        image:'/images/fail.png',
        duration: 2000//持续的时间
      })
      this.setData({com:''});
      return;
    }
    if (e.detail.value.comment.trim()=="")
    {
      wx.showToast({
        title: '评论不能为空',
        image:'/images/fail.png',
        duration: 2000//持续的时间
      })
      this.setData({com:''});
      return;
    }
    var that = this;
    wx.request({
      url: 'https://class.dlut-elab.com/feedback/zhouhongyi/getincomments.php', //接口地址
      method: 'POST',
      data: { 
        id:that.data.id,
        userimage:app.globalData.src,
        username:app.globalData.nickName,
        comment:e.detail.value.comment,
        time:common.formatTime(new Date())
      },
        header:
        {
          "Content-type": "application/x-www-form-urlencoded"
        },
      success: function (res) {
        that.setData({comments: that.data.comments.concat(res.data), com:''});
        that.setData({num: (that.data.num+1)})
        console.log("传输成功");
      },
      complete: function(){
        wx.showToast({
          title: '评论成功',
          icon: 'success',
          duration: 2000//持续的时间
        })
      }
    })
  }
})