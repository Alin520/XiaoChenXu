import * as cache from '../utils/cache.js';

//手机号码校验
export function phoneNumberReg(phoneNumber) {
  return phoneNumber.match(/^1[34578]\d{9}$/)
}

// 检查手机微信版本信息,微信版本过低，请更新至6.5.10或以上。
export function checkVersion(versions) {
  var versionInfo = versions.split('.')
  if (versionInfo == null) {
    return false;
  }
  for (var i = 0; i < versionInfo.length; i++) {
    switch (i) {
      case 0:     //第一位 6
        var isProperVersion = versionInfo[i] < 6 ? false : versionInfo[i] == 6 ? null : true
        if (isProperVersion == null) {
          break;
        } else {
          return isProperVersion;
        }
        break;
      case 1:    //第二位 5
        var isProperVersion = versionInfo[i] < 5 ? false : versionInfo[i] == 5 ? null : true
        if (isProperVersion == null) {
          break;
        } else {
          return isProperVersion;
        }
        break;
      case 2:      //第三位 10
        if (versionInfo[i] < 10) {
          return false;
        }
        break;
    }
  }
  return true;
}

var isConnected = true;
var networkType = null;

// 检查网络状态
export function checkNetworkConnected(requestData) {
  if (!isConnected) {
    showModal('提示', '网络无反应，请检查您的网络设置')
  }
  return isConnected;
}

export function getNetworkType(requestData) {
  return networkType;
}

export function takeToken() {
  let app = getApp().globalData;
  let cacheToken = app.token ? app.token :
    cache.getCacheValue("token")
  return cacheToken;
}

var count = 0;
export function hasLogin() {
  let isLogin = false
  var app = getApp().globalData;
  var cacheToken = app.token ? app.token :
    cache.getCacheValue("token")
  // 1、检查是否已经登录
  if (!cacheToken) {   //未登录
    isLogin = false
    if (count == 0) {
      count++
      wx.reLaunch({
        url: '/pages/login/login'
      });
    }
  } else {
    count = 0
    isLogin = true
  }
  return isLogin
}
// 获取网络类型
wx.onNetworkStatusChange(function (res) {
  // 当前是否有网络连接
  isConnected = res.isConnected
  // 网络类型
  networkType = res.networkType
})

// 刷新经纬度坐标
export function refreshLocationInfo() {
  console.log("=======refreshLocationInfo==========")
  let location = {
    pointLng: "",
    pointLat: ""
  }
  //pointLng  //经度
  //pointLat  //纬度
  wx.getLocation({
    type: 'gcj02',
    success: function (res) {
      location.pointLat = res.altitude
      location.pointLng = res.longitude
      cache.cacheValue(location)
    },
  })
}

// 检验数组数据
export function preCheckData(arry) {
  if (!arry || arry.length < 0) {
    showToast("数据异常，请刷新后重试")
    return null
  }
  return arry
}


/**
 * 倒计时
 *  time：倒计时时间 ，单位是秒
 */
var timer
export function countDownTime(time, content, callback = {}) {
  if (!verifyCallbackMethod(callback)) {
    return;
  }
  var that = this
  let title = content + " " + time + 's'
  showLoading(title)
  timer = setTimeout(function () {
    let newTime = time - 1
    if (newTime >= 0) {
      countDownTime(newTime, content, callback)
      console.log("countDown=====>", newTime);
    } else {
      wx.hideLoading()
      callback()
    }
  }, 1000)
}

/**
 * 结束倒计时
 */
export function stopCountDownTime() {
  if (timer != null) {
    clearTimeout(timer)
  }
}

//日志打印
export function log(key,...value) {
  if(getApp().globalData.debug){  //只有debug 时才打印
    console.log(key, value)
  }
}

//进度框loading
export function showLoading(msg) {
  let title = new String(msg)
  wx.showLoading({
    title: title,
    mask: true
  })
}

//提示框toast
export function showToast(msg) {
  let title = new String(msg)
  //延时弹toast,是为了解决有时候在接口请求后，设置的时间不起作用
  setTimeout(function () {
    wx.showToast({
      title: title,
      duration: 1200,
      icon: "none"
    })
  }, 100)


}

//确认框
export function showModal(title, content, callback = null) {
  let titleStr = new String(title)
  let contentStr = new String(content)
  wx.showModal({
    title: titleStr,
    content: contentStr,
    showCancel: false,
    success: function (res) {
      if (res.confirm && callback != null) {
        callback()
      }
    }
  })
}

/**
 * 校验 callback  是否是回调函数
 */
export function verifyCallbackMethod(callback) {
  return (callback && typeof (callback) === "function")
}


// 返回上一页
export function backPrePage(pageUrl, key, value) {
  let pages = getCurrentPages()
  let prePage = pages[pages.length - 2] //获取上一页
  prePage.setData({
    [key]: value
  })
  wx.navigateBack({
    delta: 1
  })
}
/**
 *  回退到对应的页面(如登录成功后的跳转)
 * 场景：登录后置。商城类APP，点击购物车，若没有登录，先跳转到登录页面登录，登录完成后再回退到购物车页面
*/
export function gotoTargetPage() {
  let pages = getCurrentPages()
  //当前页面大于1个，如果用户没有登录，或者没有实名，则重新登录或者实名完成后，继续返回到前一页继续相应的操作
  if (pages.length > 1) {
    wx.navigateBack({
      delta: 1
    })
  } else {
    //当前只有一个页面，即首次进来登录场景，这样登录完成后，跳转到首页
    //延时跳转,是为了解决有时候wx.reLaunch不起作用，设置的时间不起作用
    setTimeout(function () {
      wx.reLaunch({
        url: '/pages/index/index'
      })
    }, 100)
  }
}

/**
 *   对象（如String）转为Map集合
 * */
export function objToMap(obj) {
  let strMap = new Map()
  for (let key of Object.keys(obj)) {
    strMap.set(key, obj[key])
  }
  return strMap;
}

/**
 *   set集合转为Array数组
 * */
export function setToArray(originalArray) {
  if (originalArray == null || originalArray.length == 0) {
    return false;
  }
  let array = []
  if (Object.getPrototypeOf(originalArray) == Set.prototype) {
    array = [...originalArray]
  } else {
    array = originalArray
  }
  let newArray = []
  for (let i = 0; i < array.length; i++) {
    var value = array[i]
    if (Object.getPrototypeOf(value) == Set.prototype) {
      // 递归调用
      var val = setToArray(value)
      newArray[i] = val
    } else {
      newArray[i] = value
    }
  }
  return newArray;
}

