/**
 * 作为数据监听器，能够对对象所有的属性进行监听
 * 一旦监听到变化，调用 dep.notify 通知到“订阅者”(Watcher)
 * @param {*} data 
 */
import Dep from './dep.js'
export default class Observer {
  constructor (data) {
    for (const key in data) {
      this.defineReactive(data, key, data[key])
    }
  }
  
  defineReactive (data, key, val) {
    const dep = new Dep()
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: false,
      get () {
        if (Dep.target) {
          dep.depend()
        }
        return val
      },
      set (newVal) {
        if (val === newVal) {
          return
        }
        val = newVal
        dep.notify()
        console.log('set new value')
      }
    })
  }
}