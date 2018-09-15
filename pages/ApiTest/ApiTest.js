Page({
  data: {
  },
  onLoad: function () {
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
      util.showModal(error, "", function () {
      })
    })
  }
})
