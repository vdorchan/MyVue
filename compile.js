/**
 * 解析模版指令，讲模板中的变量替换成数据，然后初始化页面视图，
 * 并将每个节点绑定更新函数，添加舰艇数据的节点订阅者，
 * 一旦数据有变动，收到通知，更新视图
 * @param {*} el 
 * @param {*} vm 
 */
import Watcher from './watcher.js'
export default class Compile {
  constructor (el, vm) {
    this.$vm = vm
    this.$el = document.querySelector(el)

    this.compileElement(this.$el)
  }

  compile (node) {
    const nodeAttrs = node.attributes
    
    Array.prototype.slice.call(nodeAttrs).forEach(attr => {
      const exp = attr.value

      if (attr.name === 'v-model') {
        const updaterFn = updater['modelUpdater']
        let val = this.$vm.data[exp]

        updaterFn(node, val)

        new Watcher(this.$vm, exp, function (value) {
          updaterFn(node, value)
        })

        node.addEventListener('input', e => {
          const newVal = e.target.value
          if (newVal === val) {
            return
          }

          this.$vm.data[exp] = newVal

          val = newVal
        })
      }
    })
  }

  compileElement (el) {
    const reg = /\{\{(.*)\}\}/

    Array.prototype.slice.call(el.childNodes).forEach(node => {
      if (node.nodeType === 1) { // 如果是元素节点
        this.compile(node)
      } else if (node.nodeType == 3 && reg.test(node.textContent)) { // 如果是文本节点
        const updaterFn = updater['textUpdater']
        const exp = RegExp.$1.trim()
        const val = this.$vm.data[exp]
        updaterFn(node, val)

        new Watcher(this.$vm, exp, function (value) {
          updaterFn(node, value)
        })
      }

      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node)
      }
    })
  }

  getVMVal (exp) {
    return this.$vm.data[exp]
  }
}

// 各种类型的更新器
const updater = {
  textUpdater (node, value) {
    console.log('text update')
    node.textContent = typeof value == 'undefined' ? '' : value
  },

  modelUpdater (node, value) {
    console.log('model update')
    node.value = typeof value == 'undefined' ? '' : value
  }
}