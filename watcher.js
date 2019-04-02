import Dep from './dep.js'

export default class Watcher {
  constructor (vm, exp, cb) {
    this.depIds = {}
    
    this.cb = cb
    this.vm = vm
    this.getter = this.parseGetter(exp)
    this.value = this.get()

  }

  update () {
    this.run()
  }
  
  run () {
    const value = this.get()
    const oldVal = this.value
    console.log('watcher run', value, '->', oldVal)

    if (value !== oldVal) {
      this.value = value
      this.cb.call(this.vm, value)
    }
  }

  addDep (dep) {
    console.log('addDep', dep.id, this.depIds.hasOwnProperty(dep.id))
    if (!this.depIds.hasOwnProperty(dep.id)) {
      dep.addSub(this)
      this.depIds[dep.id] = dep
    }
  }

  get () {
    Dep.target = this
    const value = this.getter.call(this.vm, this.vm.data) // 这行代码会触发 data 对应属性的 get 操作，将执行 dep.addDep
    Dep.target = null
    return value
  }

  parseGetter (exp) {
    if (/[^\w.$]/.test(exp)) return;

    return function (obj) {
      obj = obj[exp]
      return obj
    }
  }
}