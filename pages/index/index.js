import * as base from '../../base/base.js';
import * as control from '../index/control.js';
import * as util from '../../utils/util.js';

const app = getApp()

Page({
  data: {
    "result":"",
    "test":""
  },

  onShow:function(){
    var _this = this
    base.takeOpenId()
    // 调用control中方法，返回结果
    var test = control.login(function(result){
      util.log("result===>", result)
      //设置数据
      _this.setData({
        result: result
      })
    })
     //设置数据
    _this.setData({
      test: test
    })
    util.log("test===>", test)
  },

  //api接口测试
  apiTap: function() {
    wx.navigateTo({
      url: '../ApiTest/ApiTest'
    })
  },

  //缓存测试
  cacheTap: function () {
    wx.navigateTo({
      url: '../cacheTest/cacheTest'
    })
  },

  //购物车数量输入框
  numTap: function () {
    wx.navigateTo({
      url: '../optionNumTest/optionNumTest'
    })
  },
})
