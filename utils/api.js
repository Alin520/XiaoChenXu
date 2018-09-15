
import * as cache from '../utils/cache.js';
import * as util from '../utils/util.js';


var onSuccess
var onFail

/**
 * 自定义loading  框请求
 * 
 * isShowLoading :true  弹出loading窗
 * isEndLoading： true  最后需要隐藏loading窗。若是false，则不隐藏
 */
export function request(requestData, isShowLoading = true, isEndLoading = true, onSuccess, onFail){
  this.requestApi(requestData, isShowLoading, isEndLoading, null, function (result) {
    onSuccess(result)
  }, function (error) {
    onFail(error)
  })
}

/**
 *  带有loading 框的 不能自定义的请求
 * 
 */
export function request1(requestData, onSuccess, onFail) {
  // console.log("onSuccess========request1===>", success, fail);
  requestApi(requestData, true, true, null, function (result) {
    onSuccess(result)
  }, function (error) {
    onFail(error)
  })
}

/**
 * 自定义token  请求
 * 
 * isShowLoading :true  弹出loading窗
 * isEndLoading： true  最后需要隐藏loading窗。若是false，则不隐藏
 * token: 可以自定义token。用户虚拟账号使用车辆
 */
export function request2(requestData, isShowLoading = true, isEndLoading = true, token = null, onSuccess, onFail) {
  requestApi(requestData, isShowLoading, isEndLoading, token, function (result) {
    onSuccess(result)
  }, function (error) {
    onFail(error)
  })
}

/**
 * 自定义loading  框请求
 * 
 * isShowLoading :true  弹出loading窗
 * isEndLoading： true  最后需要隐藏loading窗。若是false，则不隐藏
 */
export function request3(requestData, isShowLoading = true, isEndLoading = true, token, onSuccess, onFail) {
  requestApi(requestData, isShowLoading, isEndLoading, token, function (result) {
    onSuccess(result)
  }, function (error) {
    onFail(error)
  })
}

/**
 * 不校验 是否登录、实名押金信息 请求
 */
export function request4(requestData, isShowLoading, onSuccess, onFail) {
  var app = getApp().globalData;

  // 2、检查网络状态
  if (!util.checkNetworkConnected()) { //没有网络
    onFail("网络请求失败，稍后再试")
    return;
  }
  if (!requestData) {
    onFail("数据异常，请稍后再试")
    return;
  }

  requestData.version = app.version
  console.log("==================================================开始请求网络数据start========================================")
  console.log(requestData)
  console.log("==================================================开始请求网络数据end===========================================")
  var baseUrl = app.debug ? app.debugUrl : app.releaseUrl
  console.log("===baseUrl===>" + baseUrl)
  if (isShowLoading) {
    util.showLoading('加载中')
  }
  const requestTask = wx.request({
    url: baseUrl,
    data: requestData,
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    dataType: 'json',
    success: function (res) {
      console.log("==================================================返回请求结果start========================================")
      console.log(res.data)
      console.log("==================================================返回请求结果end===========================================")
      if (res.data.code == 0) { //成功
        onSuccess(res.data)
      } else { //失败
        let error = res.data == null || typeof (res.data) == "undefined" ? "网络请求失败，请稍后再试" : res.data.desc
        onFail(error)
        console.log("error===========>", error);
      }
    },
    fail: function (res) {
      console.log("onFail===========>", res);
      onFail("网络请求失败，稍后再试")
    },
    complete: function (res) {
      wx.hideLoading()
    }
  })
}


export function requestApi(requestData, isShowLoading = true,isEndLoading = true, token = null,onSuccess, onFail) {
  let app = getApp().globalData;
  // 1、检查是否已经登录
  if (!util.hasLogin()) {
    return;
  }
  // 2、检查网络状态
  if (!util.checkNetworkConnected()) { //没有网络
    onFail("网络请求失败，稍后再试")
    return;
  }
  if (!requestData) {
    onFail("数据异常，请稍后再试")
    return;
  }
  let cacheToken =  util.takeToken()
  let newToken = token == null ? cacheToken : token
  console.log("newToken===========>", newToken)
  requestData.token = newToken
  requestData.version = app.version
  console.log("==================================================开始请求网络数据start========================================")
  console.log(requestData)
  console.log("==================================================开始请求网络数据end===========================================")
  var baseUrl = app.debug ? app.debugUrl : app.releaseUrl    
  console.log("===baseUrl===>" + baseUrl)
  if (isShowLoading){
    util.showLoading("加载中")
  }
  const requestTask = wx.request({
    url: baseUrl,
    data: requestData,
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    dataType: 'json',
    success: function(res) {
      console.log("==================================================返回请求结果start========================================")
      console.log(res.data)
      console.log("==================================================返回请求结果end===========================================")
      if (res.data.code == 0) { //成功
        // console.log("onSuccess===========>", onSuccess);
        onSuccess(res.data)
      } else if (res.data.code == 1021) { //未缴纳押金
        wx.navigateTo({
          url: '/pages/recharge/recharge',
        })
        return false;
      } else if (res.data.code == 1006) { //余额不足
        wx.navigateTo({
          url: '/pages/deposited/deposited',
        })
        return false;
      } else if (res.data.code == 1019) { //未实名
        wx.navigateTo({
          url: '/pages/certify/certify',
        })
        return false;
      } else if (res.data.code == 1001) { //token过期
        wx.reLaunch({
          url: '/pages/login/login'
        });
        return false;
      } else { //失败
        let error = res.data == null || typeof (res.data) == "undefined" ? "网络请求失败，请稍后再试" : res.data.desc
        onFail(error)
        console.log("error===========>", error);
      }
    },
    fail: function(res) {
      console.log("onFail===========>", res);
      onFail("网络请求失败，稍后再试")
    },
    complete: function(res) {
      console.log("complete===========>", isEndLoading);
      if (isEndLoading){
        wx.hideLoading()
      }
    }
  })
};




// export function cancleRequest() {
//   let requestTask = this.data.requestTask
//   if (requestTask) {
//     requestTask.abort()
//     console.log("cancleRequest====abort==>")
//   }
//   console.log("cancleRequest======>")
// }

// export {
//   request,
//   cancleRequest
// }
// export const config