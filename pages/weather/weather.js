Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_city: '',
    longitude: 0,
    latitude: 0,
    flag:0,
    flag1:0,
    flag2:0,
    flag4:0,
    flag5:0,
    refresh:0,
    imgsrc:100
  },
  /**
   * 根据城市获取天气预报
   */
  getWeather(city) {
    let that = this
    //获取实况天气
    if (that.data.flag==0)
    {
      wx.showToast({
        title: '天气获取中...',
        icon:'loading'
      })
    }
    wx.request({
      url: 'https://free-api.heweather.net/s6/weather/now?key=8d7cc361eff0424aaed1147ea3a3a17e&location=' + city,
      success: function(res) {
        if (res.data.HeWeather6[0].status == 'unknown location') {
          that.setData({flag4: 1})
          wx.showToast({
            title: '没有该城市的天气预报',
            icon: 'none',
            duration: 2000
          })
          return;
        }
        console.log(res)
        that.setData({
          city: city,
          tmp: res.data.HeWeather6[0].now.tmp,
          imgsrc: res.data.HeWeather6[0].now.cond_code,
          wind_dir: res.data.HeWeather6[0].now.wind_dir,
          wind_sc: res.data.HeWeather6[0].now.wind_sc,
          hum: res.data.HeWeather6[0].now.hum,
          pres: res.data.HeWeather6[0].now.pres
        })

        //获取24小时天气预报
        wx.request({
          url: 'https://free-api.heweather.net/s6/weather/hourly?key=8d7cc361eff0424aaed1147ea3a3a17e&location=' + city,
          success: function(res) {
            var arr = res.data.HeWeather6[0].hourly
            var hourly = []
            for (var i = 0; i < arr.length; i++) {
              hourly[i] = {
                "imgsrc": arr[i].cond_code,
                "tmp": arr[i].tmp,
                "time": arr[i].time.substring(11),
                "wind_dir": arr[i].wind_dir,
                "wind_sc": arr[i].wind_sc
              }
            }
            that.setData({
              hourly: hourly
            })

            var weekArray = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
            //获取未来7天天气预报
            wx.request({
              url: 'https://free-api.heweather.net/s6/weather/forecast?key=8d7cc361eff0424aaed1147ea3a3a17e&location=' + city,
              success: function(result) {
                //console.log(result)
                var arr = result.data.HeWeather6[0].daily_forecast
                var daily_forecast = []
                for (var i = 0; i < arr.length; i++) {
                  daily_forecast[i] = {
                    d_txt: i == 0 ? "今天" : weekArray[new Date(arr[i].date).getDay()],
                    d_date: arr[i].date.substring(5),
                    imgsrc_d: arr[i].cond_code_d,
                    imgsrc_n: arr[i].cond_code_n,
                    wind_dir: arr[i].wind_dir,
                    wind_sc: arr[i].wind_sc,
                    tmp_max: arr[i].tmp_max,
                    tmp_min: arr[i].tmp_min,
                    cond_txt_d: arr[i].cond_txt_d
                  }
                }
                that.setData({
                  daily_forecast: daily_forecast
                })
              },
              complete: function(){
                that.setData({flag2:1});
              }
            })

          },
          complete: function(){
            that.setData({flag1:1});
          }
        })
      },
      complete: function(){
        that.setData({flag: 1});
        if (that.data.flag&&that.data.flag2&&that.data.flag1&&that.data.flag4==0)
        {
          wx.hideToast();
        }
        if (that.data.flag5==0)
    {
      wx.getLocation({
        type: 'gcj02',
        success (res) {
          that.setData({latitude: res.latitude, longitude: res.longitude});
          console.log(that.data.longitude);
          console.log(that.data.latitude);
          that.setData({flag5: 1});
        },
        fail (res) {
          that.setData({flag5: 1});
        }
       });
    }
        if (that.data.refresh)
      {
        that.setData({refresh: 0})
        wx.stopPullDownRefresh({
          complete:function(){
            wx.showToast({
              title: '更新成功',
            })
          }
        })
      }
      }
    })
  },
  bindKeyInput(e) {
    this.data.search_city = e.detail.value
    //unknown location
  },
  search() {
    this.getWeather(this.data.search_city)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that=this
    this.getWeather("大连")
  },
  onPullDownRefresh: function () {
    this.getWeather("大连")
    this.setData({refresh: 1})
  },

})
