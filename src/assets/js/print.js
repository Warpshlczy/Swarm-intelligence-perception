import html2canvas from 'html2canvas'
// 打印类属性、方法定义
/* eslint-disable */
const Print = function (dom, options) {
  if (!(this instanceof Print)) return new Print(dom, options)
 
  this.options = this.extend({
    'noPrint': '.no-print'
  }, options)
  
  if ((typeof dom) === "string") {
    this.cloneDom = document.querySelector(dom)
  } else {
    this.isDOM(dom)
    this.cloneDom = this.isDOM(dom) ? dom : dom.$el
  }
 
  //主要修改：将打印的dom转换成图片
  html2canvas(this.cloneDom).then(canvas => {
      this.imgmap = canvas.toDataURL()
      setTimeout(()=>{
          this.dom = `<div style='width:100%;height:100%;'><img style='width:100%;height:auto' src='${this.imgmap}'/></div>`
          this.init()
      })
  })
}
Print.prototype = {
  init: function () {
    var content = this.dom
    this.writeIframe(content)
  },
  extend: function (obj, obj2) {
    for (var k in obj2) {
      obj[k] = obj2[k]
    }
    return obj
  },
 
  writeIframe: function (content) {
    var w, doc, iframe = document.createElement('iframe'),
      f = document.body.appendChild(iframe)
    iframe.id = "myIframe"
    //iframe.style = "position:absolutewidth:0height:0top:-10pxleft:-10px"
    iframe.setAttribute('style', 'position:absolutewidth:0height:0top:-10pxleft:-10px')
    w = f.contentWindow || f.contentDocument
    doc = f.contentDocument || f.contentWindow.document
    doc.open()
    doc.write(content)
    doc.close()
    var _this = this
    iframe.onload = function(){
      _this.toPrint(w)
      setTimeout(function () {
        document.body.removeChild(iframe)
      }, 100)
    }
  },
 
  toPrint: function (frameWindow) {
    try {
      setTimeout(function () {
        frameWindow.focus()
        try {
          if (!frameWindow.document.execCommand('print', false, null)) {
            frameWindow.print()
          }
        } catch (e) {
          frameWindow.print()
        }
        frameWindow.close()
      }, 10)
    } catch (err) {
      console.log('err', err)
    }
  },
  isDOM: (typeof HTMLElement === 'object') ?
    function (obj) {
      return obj instanceof HTMLElement
    } :
    function (obj) {
      return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string'
    }
}
const MyPlugin = {}
MyPlugin.install = function (Vue, options) {
  // 4. 添加实例方法
  Vue.prototype.$print = Print
}
export default MyPlugin