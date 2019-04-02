/**
 * Dep 即 Dependency
 * 作为 Observer 和  Compile 之间的桥梁
 * 用来收集依赖项（依赖）并重新运行所有依赖项（notify）
 * 维护一个数组，用来收集订阅者（watcher）
 */
let uid = 0
export default class Dep {
  constructor () {
    this.subs = []
    this.id = ++uid
  }

  addSub (sub) {
    this.subs.push(sub)
  }

  depend () {
    Dep.target.addDep(this)
  }

  notify () {
    console.log('dep notify')
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}