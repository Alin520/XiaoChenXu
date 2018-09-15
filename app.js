import * as base from './base/base.js';
import * as cache from './utils/cache.js';

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取openId、登录
    let openId = cache.getCacheValue("openId")
    console.log("onLaunch===app中=====>", openId)
    if (!openId) {
      base.takeOpenId()
    }

  },

  // 全局的数据，可以提供给所有的page页面使用
  globalData: {
    userInfo: null,
    token: "",
    version: "version版本号",
    releaseUrl: "正式版url",
    debugUrl: "测试版url",
    debug: true   //true  debug环境，false正式环境
  },

})