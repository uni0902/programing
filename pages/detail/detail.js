// pages/detail/detail.js
var common=require('../../utils/JS  common')  //引用公共JS文件
var app = getApp()
var begin;

Page({

  /**
   * 页面的初始数据
   */
  id:'',
  isLogin: false,
  notice: 0,
  time: 4,
  isAdd: false,
  flag: 0,
  data: {
    article:{
      id:null,
      edition:'',
      title:'',
      image:'',
      content:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id=options.id;
    let id = options.id;                    //获取页面跳转来时携带的新闻id编号
    let result=common.getNewsDetail(id);
    //获取新闻内容
    if(result.code=='200'){
      this.setData({article:result.news,
        isLogin:app.globalData.isLogin
      })
      if (this.data.flag)
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
    //检查当前新闻是否在收藏夹中
    var got=this.inmyfavorite(id);
    //已存在
    this.setData({isAdd: got})
    var that=this
    begin = setInterval(() => {
      that.setData({notice: 1});
      setTimeout(function(){that.setData({notice: 0});}, 30000);
    }, 600000);
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
    wx.hideToast({
      success: (res) => {},
    })
    clearInterval(begin);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.hideToast({
      success: (res) => {},
    })
    clearInterval(begin);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.flag = 1;
    let options = {id:this.data.id};
    this.onLoad(options);
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

  stop: function(){
    this.setData({notice: 0});
    wx.hideToast({});
    clearInterval(begin);
  },

  //添加到收藏
  addFavourites:function(options){
    if (app.globalData.isLogin==false)
    {
      wx.showToast({
        title: '请先登录',
        image:'/images/fail.png',
        duration: 2000//持续的时间
      })
      return;
    }
    var that = this;    //获取当地新闻
    wx.request({
      url: 'https://class.dlut-elab.com/feedback/zhouhongyi/getinmyf.php', //接口地址
      method: 'POST',
      data: { 
        openid:app.globalData.openid,
        id:that.data.article.id,
        image:that.data.article.image,
        edition:that.data.article.edition,
        title:that.data.article.title 
      },
        header:
        {
          "Content-type": "application/x-www-form-urlencoded"
        },
      success: function (res) {
        app.globalData.myfavorite = app.globalData.myfavorite.concat(res.data);
        app.globalData.num = app.globalData.num+1;
        that.setData({isAdd: true});
      },
      complete: function()
      {
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 2000//持续的时间
        })
      }
    })          //更新按钮显示
  },

  inmyfavorite: function(id)
  {
    for (var i=0; i<app.globalData.num; i++)
    {
      if (app.globalData.myfavorite[i].id==id)
        return true;
    }
    return false;
  },
  //取消收藏
  cancelFavourites:function(){
    var that = this;      //获取当地新闻
    wx.request({
      url: 'https://class.dlut-elab.com/feedback/zhouhongyi/removemyf.php', //接口地址
      method: 'POST',
      data: { 
        openid:app.globalData.openid,
        id:that.data.article.id
      },
        header:
        {
          "Content-type": "application/x-www-form-urlencoded"
        },
      success: function (res) {
        for (var i=0; i<app.globalData.num; i++)
        {
          if (app.globalData.myfavorite[i].id == that.data.article.id)
          {
            app.globalData.myfavorite.splice(i, 1);
            break;
          }
        }
        app.globalData.num = app.globalData.num-1;
        that.setData({isAdd: false});
      },
      complete: function(){
        wx.showToast({
          title: '取消收藏成功',
          icon: 'success',
          duration: 2000//持续的时间
        })
      }
    })           //更新按钮显
  },
    /**
   * 自定义函数-跳转新页面浏览新闻内容
   */
  gotoComment:function(e){ 
   //获取携带的date-id数据
   let id=e.currentTarget.dataset.id;
   //携带新闻id进行页面跳转
   wx.navigateTo({
     url: '../comment/comment?id='+id,
   })
  }
})