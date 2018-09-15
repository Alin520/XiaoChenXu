// pages/cacheTest/cacheTest.js
import * as cache from '../../utils/cache.js';
import * as util from '../../utils/util.js';

//获取应用实例
const app = getApp()

Page({
  data: {
    text1: "map<String,set<?>>结构集合缓存",
    text2: "map<String,?>结构集合缓存",
    text3: "set<?>结构集合缓存",
    text4: "set<set<?>>结构集合缓存",
    arr: [],
  },

  /**
   *  Map的集合：
   *    如 Map<String,set<Integer>>、 Map<String,set<Boolean>>、 Map<String,set<String>>、 Map<String,set<Bean>>(Bean是object的实体类)
   */
  mapCacheClick1: function () {
    // 初始化数据
    var testBean1 = {
      demoName: "",
      demoInfo: ""
    }
    testBean1.demoInfo = "666666666666"
    testBean1.demoName = "777777777777name"

    var testBean2 = {
      beanName: "",
      beanId: ""
    }
    testBean2.beanName = "beanName00000"
    testBean2.beanId = "beanId5555555"
    var testSet1 = new Set();
    testSet1.add(testBean1)
    testSet1.add(testBean2)
    var testSet2 = new Set();
    testSet2.add("aaaaa")
    testSet2.add(11111)
    testSet2.add(3.14444)
    testSet2.add(false)
    var map = new Map();
    map.set("test1", testSet1)
    map.set("test2", testSet2)

    // 缓存map集合
    cache.cacheMap("cacheMaptest", map);
    // 获取缓存Map
    var map = cache.getCacheMap("cacheMaptest");
    var setBean1 = map.get("test1")
    var setBean2 = map.get("test2")
    console.log("setBean1=========>", setBean1)
    console.log("setBean2=========>", setBean2)
    for (let bean of setBean1) {
      console.log("bean=========>", bean)
      var beanName = bean.beanName
      var beanId = bean.beanId
      console.log("beanId=========>", beanId)
      console.log("beanName=========>", beanName)
    }

    map.forEach(function (value, key, map) {
      console.log("==>Key: %s, ==>Value: %s", key, value);
    });
  },

  /**
   *  Map的集合：
   *    如 Map<String,Integer>、 Map<String,Boolean>、 Map<String,String>、 Map<String,Bean>(Bean是object的实体类)
   */
  mapCacheClick2: function () {
    // 清除缓存
    cache.clearCache()
    // 初始化数据
    var testBean1 = {
      beanName1: "",
      beanId1: ""
    }
    testBean1.beanName1 = "beanName1111111"
    testBean1.beanId1 = "beanId11111111"
    var testMap = new Map();
    testMap.set("testInt", 1111)
    testMap.set("testString", "testString")
    testMap.set("testBoolean", false)
    testMap.set("testObject", testBean1)

    // 缓存Map
    cache.cacheMap("cacheMap22", testMap)
    // 获取Map
    var testMap = cache.getCacheMap("cacheMap22")
    testMap.forEach(function (value, key, testMap) {
      console.log("==>Key: %s, ==>Value: %s", key, value);
    });
  },


  /**
   *  set的集合简单数据类型：
   *    如 set<Integer>、set<Boolean>、set<String>、set<Array>、set<Bean>(Bean是object的实体类)
   */
  setCacheClick1: function () {
    // 实体Bean
    var testBean6 = {
      beanName6: "",
      beanId6: ""
    }
    testBean6.beanName6 = "beanName6666666666"
    testBean6.beanId6 = "beanId666666666"
    // 数组Array
    var testArr = []
    testArr[0] = "aaaaa"
    testArr[1] = 11111
    testArr[2] = 3.14444
    testArr[3] = false
    // Set集合
    let testSet = new Set();
    testSet.add("aaaaa")
    testSet.add(11111)
    testSet.add(3.14444)
    testSet.add(false)
    testSet.add(testArr)
    testSet.add(testBean6)
    console.log("====cacheSetTest======>", testSet);
    cache.cacheArray("cacheSetTest", testSet)
    var cacheSetTest = cache.getCacheValue("cacheSetTest")
    console.log("cacheSetTest======>", cacheSetTest);
        // 缓存结果：["aaaaa",11111,3.14444,false,["aaaaa",11111,3.14444,false],{"beanName6":"beanName6666666666","beanId6":"beanId666666666"}]
  },

  /**
   *  set的集合复杂数据类型：
   *    如 set<Set<?>>、 set<Array<?>>、 set<Set<Set<?>>、 set<Set<Array<?>>> 、 set<Array<Set<?>>>等
   */
  setCacheClick2: function () {
    let arrTest = ["ab", ["12", ["SET"]]]  
    var newArrTest = Array.from(arrTest)
    console.log("newArrTest======>", newArrTest);
    // 第四层
    var endArr = []
    endArr[0] = "aaaaa"
    endArr[1] = 11111
    endArr[2] = 3.14444
    endArr[3] = false
    // 第三层
    var lastSet = new Set();
    lastSet.add("lastSet11111")
    lastSet.add("lastSet222222")
    lastSet.add("lastSet333333")
    lastSet.add(endArr)
    // 第二层
    var innerSet = new Set();
    innerSet.add("111aaa")
    innerSet.add(2.2222)
    innerSet.add(true)
    innerSet.add(lastSet)
    // 第一层
    var testSet2 = new Set();
    testSet2.add("aaaaa")
    testSet2.add(11111)
    testSet2.add(3.14444)
    testSet2.add(false)
    testSet2.add(innerSet)
    console.log("====cacheSetTest======>", testSet2);
    cache.cacheArray("cacheSetTest", testSet2)
    // 缓存结果：["aaaaa",11111,3.14444,false,["111aaa",2.2222,true,["lastSet11111","lastSet222222","lastSet333333",["aaaaa",11111,3.14444,false]]]]
    var cacheSetTest = cache.getCacheValue("cacheSetTest")
    console.log("cacheSetTest======>", cacheSetTest);
  },
})