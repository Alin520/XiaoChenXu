// 本类中存放公共部分
import * as cache from '../utils/cache.js';
import * as util from '../utils/util.js';
import * as api from '../utils/api.js';

// 用户信息
var userInfo =  {
  "userId": "",
  "mobile": ""
  }

/**
 * 获取openId
 */
export function takeOpenId(){
  // 登录
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      let requestData = {
        "method": "ThirdUserAuth",
        "thirdPlat": "微信小程序",
        "thirdCode": res.code
      }
      // 调用api，获取openId
      api.request4(requestData, false, function (result) {  
        // 缓存openId，成功后，一般用户再去调用login接口去登录
        cache.cacheValue({ "openId": result.thirdUserId })
      }, function (error) {
        util.showToast(error)
      })
    }
  })
}

//  初始化用户信息userInfo
export function initUserInfo(callback = {}) {
  var that = this
  var data = {
    method: 'GetUserInfo',
    //其他字段 
  }
  api.request1(data, function (result) { //数据请求成功，缓存用户信息数据
    var info = result.baseInfo
    if (!info) {
      return;
    }
    userInfo.userId = info.userId
    userInfo.mobile = info.mobile
    //检查callback是否是回调函数
    if (!util.verifyCallbackMethod(callback)) {
      return;
    }
    callback(userInfo)
  }, function (error) {     //失败
    callback(error)
    // util.showToast(error)
    util.showModal(error,"",function(){
    })
   })
}



