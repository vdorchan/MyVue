import Compile from './compile.js'
import Observer from './observer.js'

export default class Vue {
  constructor (options) {
    const { el, data } = options
    this.data = data

    new Observer(data)
    new Compile(el, this)
  }
}