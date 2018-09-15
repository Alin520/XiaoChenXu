import * as util from '../utils/util.js';

/******************************  添加数据******************************************** */
var tempMap;


/**
 * 缓存map含数组的集合，如 map<String,Set<String>>、map<String,Set<Bean>>，不支持双层Map集合，如Map<String,Map<?>>
 * 
 * 思路：
 *    1、先遍历需要缓存的集合cacheMap，得到key和value
 *    2、将value集合转为数组valueArray
 *    3、新建一个Map集合tempMap，存入数据，且key是需要缓存集合cacheMap的key，value是被转换的数组valueArray
 *    4、将tempMap集合转换为tempArray数组
 *    5、然后将tempArray数组通过JSON.stringify(tempArray)，转换为String字符串cacheString
 *    6、最后将字符串cacheString缓存到缓存中，完成Map转换为String的缓存转换
 * 
 * 注意：
 *    1、由于小程序无法直接缓存map集合，也无法缓存Set集合，只能缓存字符串。所以最终需要将对Map集合的缓存，转变为String的缓存
 *    2、由于JSON.stringify方法只支持将数组转换为String,所以，要在将Map转为String之前，必须将要缓存的集合cacheMap原来的value（Set集合）转  *         为数组、
 * 
 *  isNestedFlage： 嵌套类的复杂Map集合
 *              true ，缓存缓存map含数组的集合，如 map<String,Set<String>>、map<String,Set<Bean>>
 *              false: 缓存Map<String,Integer>、 Map<String,Boolean>、 Map<String,String>、 Map<String,Bean>(Bean是object的实体类)
 *              
 */
export function cacheMap(cacheKey, cacheMap, isSync = true) {
  if (cacheMap == null || cacheMap.length == 0 || !cacheKey) {
    return false;
  }
  if (tempMap == null) {
    tempMap = new Map()
  } else {
    tempMap.clear()
  }
  let isNestedFlage = false;
  cacheMap.forEach(function (value, key, cacheMap) {
    console.log("Key: %s, Value: %s", key, value);
    if (Object.getPrototypeOf(value) == Array.prototype || Object.getPrototypeOf(value) == Set.prototype) {
      //将value   数组
      var valueArray = Array.from(value)
      // // 将数组转换为一个json字符串
      tempMap.set(key, valueArray)
      isNestedFlage = true
    }
  });
  if (!isNestedFlage) {
    tempMap = cacheMap
  }
  // 将Map集合转为数组
  var tempArray = [...tempMap]
  var cacheString = JSON.stringify(tempArray)
  cacheKeyAndValue(cacheKey, cacheString, isSync)
}


/**
 *  缓存数组
 * 
 *  说明：
 *    1、支持数组Array集合、和Set集合
 *    2、支持简单数据类型（Array、Set）,如 set<Integer>、set<Boolean>、set<String>、set<Array>、set<Bean>(Bean是object的实体类)
 *    3、支持复杂数据类型（Array、Set）,如 set<Set<?>>、 set<Array<?>>、 set<Set<Set<?>>、 set<Set<Array<?>>> 、 set<Array<Set<?>>>等
 * 
 *    isSync true 同步缓存。且默认是true，同步缓存
 * */
export function cacheArray(cacheKey, cacheArray, isSync = true) {
  if (cacheArray == null || cacheArray.length == 0 || !cacheKey) {
    return false;
  }
  let realCacheArray = util.setToArray(cacheArray)
  var cacheString = JSON.stringify(realCacheArray)
  cacheKeyAndValue(cacheKey, cacheString, isSync)
}

// 支持键值对的存储，key-value
export function cacheKeyAndValue(key, value, isSync = true) {
  if (!key || !value) { //cacheInfo = null 、""
    return false;
  }
  let cacheInfo = {
    [key]: value
  }
  cacheValue(cacheInfo, isSync)
}

/**
 *   缓存对象
 *   isSync true 同步缓存。且默认是true，同步缓存
 * */
export function cacheValue(cacheInfo, isSync = true) {
  if (!cacheInfo) { //cacheInfo = null 、""
    return false;
  }
  for (var propertyName in cacheInfo) {
    if (!propertyName) {
      break;
    }
    try {
      var cacheKey = "key_" + propertyName
      if (isSync) {    //同步缓存
        wx.setStorageSync(cacheKey, cacheInfo[propertyName])
      } else {        //异步缓存
        wx.setStorage({
          key: cacheKey,
          data: cacheInfo[propertyName],
        })
      }
      if ("key_token" == cacheKey) {
        getApp().globalData.token = cacheInfo[propertyName]
      }
    } catch (error) {
      console.log("error===", error)
    }
  }
  return true;
}

/******************************  获取数据******************************************** */
/**
 * 异步获取缓存值，根据key获取缓存值===>异步回调
 *  cacheKey: 缓存key
 *  callback: 回调函数
 * */
export function getCacheValue(cacheKey, callback = null) {
  if (!cacheKey) {
    return null;
  }
  var realCacheKey = "key_" + cacheKey;
  try {
    if ((callback && typeof (callback) === "function")) {   //异步获取
      wx.getStorage({
        key: realCacheKey,
        success: function (res) {
          if ((callback && typeof (callback) === "function")) {
            callback(res.data)
          }
        }
      })
    } else {    //同步获取
      return wx.getStorageSync(realCacheKey)
    }
  } catch (error) {
    console.log(error)
  }
}


export function getCacheArray(cacheKey, callback = null) {
  if ((callback && typeof (callback) === "function")){
    var cacheInfoSync = getCacheValue(cacheKey, function (cacheInfo) {
      if ((callback && typeof (callback) === "function") && cacheInfo) {   //异步
        let cacheArray = JSON.parse(cacheInfo)
        callback(cacheArray)
      }
    });
  }else{
    var result = getCacheValue(cacheKey)
    let realResult
    if (result == "undefined" || result == null || result == ""){  //如果返回的是空串、或者是之前未缓存的对象，这里默认是返回空数组
      realResult = []
    }else{
      realResult = JSON.parse(result)
    }
    return realResult
  }
}

/**
 * 取map集合，如 map<String,Set<String>>、map<String,Set<Bean>>，不支持双层Map集合，如Map<String,Map<?>>
 *  由于对Map的缓存，其实最终是将map转换为String缓存。所以，取值的时候，最终是将String 还原为Map集合的过程
 * 
 * 对于含单例集合，如map<String,Set<String>>：思路：
 *    1、先根据cacheKey获取缓存信息cacheMapInfo
 *    2、将获取缓存信息cacheMapInfo转换为字符串cacheMapStr
 *    3、将字符串转为Map集合tempCacheMap
 *    4、由于原来缓存Map集合时，将Set集合转为了数组，所以，这里也要对数组还原成Set集合。因此，遍历tempCacheMap，将其value值（即数组），转换  *         为Set集合
 *    5、最后将tempCacheMap集合遍历转换的结果存入cacheMap集合中，并且返回
 * 
 * 注意：
 *    由于原来缓存Map集合时，将Set集合转为了数组，所以，这里一定要要对缓存转换后的Map集合tempCacheMap的value值（数组）还原成Set集合
 */
export function getCacheMap(cacheKey, isSync = true) {
  if (!cacheKey) {
    return new Map();
  }
  var cacheMapInfo = getCacheValue(cacheKey)
  if (!cacheMapInfo) {
    return new Map();
  }
  var cacheMapStr = JSON.parse(cacheMapInfo)
  // 字符串转换为Map集合
  var tempCacheMap = util.objToMap(cacheMapStr)
  let cacheMap
  if (cacheMap == null) {
    cacheMap = new Map()
  } else {
    cacheMap.clear()
  }
  tempCacheMap.forEach(function (value, key, tempCacheMap) {
    console.log("===Key: %s, Value: %s", key, value);
    var mapKey = value[0];
    if (Object.getPrototypeOf(value[1]) == Set.prototype || Object.getPrototypeOf(value[1]) == Array.prototype) {
      // 由于原来缓存Map集合时，将Set集合转为了数组，所以，这里也要对数组还原成Set集合
      var mapValue = new Set(value[1]);
      cacheMap.set(mapKey, mapValue)
    } else if (Object.getPrototypeOf(value[1]) == Map.prototype) {
      throw new Error("数据格式错误，暂时不支持Mvalue是Map的结果")
    } else {  //number、string、boolean、Object对象类型
      cacheMap.set(value[0], value[1])
    }
  });
  return cacheMap;
}

/******************************  删除数据******************************************** */
// 异步删除
export function removeCache(cacheKey, callback = null) {
  if (!cacheKey) {
    return;
  }
  var realCacheKey = "key_" + cacheKey;
  if ((callback && typeof (callback) === "function")) {   //异步
    wx.removeStorage({
      key: realCacheKey,
      success: function (res) {
        callback(res)
      },
    })
  }else{      //同步
    return wx.removeStorageSync(realCacheKey);
  }
}



// 清理本地数据缓存，默认同步
export function clearCache(isSync = true) {
  try {
    if (isSync) {  //同步
      return wx.clearStorageSync()
    } else {
      return wx.clearStorage()
    }
  } catch (e) {
    console.log(e)
  }
}

/******************************  获取缓存所有的数据******************************************** */
export function getAllCacheInfo() {
  wx.getStorageInfo({
    success: function (res) {
      console.log("allCache--key---->", res.keys)
      console.log("allCache--currentSize---->", res.currentSize)
      console.log("allCache--limitSize---->", res.limitSize)
    },
  })
}
