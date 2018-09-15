// component/optionNumber-component/optionNumber-component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
     minNum:{
       type:Number,
       value: NaN
     },

     maxNum:{
       type:Number,
       value:NaN
     },
  },

  /**
   * 组件的初始数据
   */
  data: {
    num: 0,
    disabledMin: false,
    disabledMax:false
  },

  lifetimes:{
    
    /**
     * 
     * 
     * 
     */
    // 初始化数据
    attached:function(){
      let num, disabledMin, disabledMax
      if (this.checkIsMinNum(this.data.num)) { //小于最小数
        num = this.data.minNum
        disabledMin = true
        disabledMax = false
      } else if (this.checkIsMaxNum(this.data.num)){     //大于最大数
        num = this.data.maxNum
        disabledMax = true
        disabledMin = false
      }else {
        num = this.data.num
        disabledMin = false
        disabledMax = false
      }
      this.setData({
        num: num,
        disabledMin: disabledMin,
        disabledMax: disabledMax
      })
    },
  },


  /**
   * 组件的方法列表
   */
  methods: {
    // 减少数量
    _reduce: function (e) {
      // console.log("_reduce======", this.data.maxNum)
      let num, disabledMin, disabledMax
      num = parseInt(this.data.num) - 1
      if (this.checkIsMinNum(num)) { //小于最小数
        num = this.data.minNum
        disabledMin = true
        disabledMax = false
      }else{
        disabledMin = false
        disabledMax = false
      }
      this.setData({
        num: num,
        disabledMin: disabledMin,
        disabledMax: disabledMax
      })
      // console.log("disabledMin======", this.data.disabledMin)
      this.triggerEvent('optionNum',{num:num})
    },

    // 增加数量
    _add: function (e) {
      let num = parseInt(this.data.num) + 1
      // console.log("_add======", this.data.maxNum)
      if (this.checkIsMaxNum(num)) {        //大于最大数
        num = this.data.maxNum
        this.data.disabledMax = true 
        this.data.disabledMin = false
      }else {
        this.data.disabledMin = false
        this.data.disabledMax = false 
      }
      this.setData({
        num: num,
        disabledMin: this.data.disabledMin,
        disabledMax: this.data.disabledMax
      })
      this.triggerEvent('optionNum', { num: num })
    },


    // 手动输入数量
    _input: function (e) {
      let val = e.detail.value
      var num = val.replace(/^[0]+[0-9]*$/gi, "")
      if (this.checkIsMinNum(num)) {  //小于最小数
        this.data.disabledMin = true
        this.data.disabledMax = false
      } else if (this.checkIsMaxNum(num)) {    //大于最大数
        this.data.disabledMax = true
        this.data.disabledMin = false
      } else {
        this.data.disabledMin = false
        this.data.disabledMax = false
      }
      this.setData({
        num: num,
        disabledMin: this.data.disabledMin,
        disabledMax:this.data.disabledMax
      })
      this.triggerEvent('optionNum', { num: num })
    },

  // 失去焦点
    _blur:function(e){
      // console.log("_confirm======")
      let val = e.detail.value
      let num = val.replace(/^[0]+[0-9]*$/gi, "")
      let disabledMin, disabledMax
      if (this.checkIsMinNum(num)) {    //输入的数量 小于最小的数，则输入框显示最小值
        num = this.data.minNum
        disabledMin = true
        disabledMax = false
      } else if (this.checkIsMaxNum(num)) {     //输入的数量 大于最大的数，则输入框显示最大值
        this.data.disabledMax = true
        num = this.data.maxNum
        disabledMin = false
        disabledMax = true
      } else {     //输入的数量 大于最小的数，则输入框显示输入值
        disabledMin = false
        disabledMax = false
      }
      this.setData({
        num: num,
        disabledMin: disabledMin,
        disabledMax: disabledMax
      })
      this.triggerEvent('optionNum', { num: num })
    },

    // 检查是否是最大数
    checkIsMaxNum: function (checkNum) {
      return this.data.maxNum != "NaN" && checkNum >= this.data.maxNum
    },
    // 检查是否是最小数
    checkIsMinNum: function (checkNum) {
      return this.data.minNum != "NaN" && checkNum <= this.data.minNum
    }
  }
})
