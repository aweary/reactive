/**
 * Takes a source object and makes "reactive", invoking
 * `observer` whenever a property is changed.
 * @param {Object} source source object
 * @param {Function} observer function to call when on value change
 * @param {Boolean} deep whether to recursively handle objects
 */
function reactive(source, observer, deep) {
  const descriptors = Object.getOwnPropertyDescriptors(source)
  // TODO an object is maybe not right, WeakMap?
  const dataCache = {}
  for (const key in descriptors) {
    const descriptor = descriptors[key]
    /**
     * If it's already a computed property we won't do any additional
     * caching. The get/set calls will be passed up to the original
     * getter/setter and the observer will be called.
     */
    const getter = descriptor && descriptor.get
    const setter = descriptor && descriptor.set
    const value = descriptor
      ? getter ? getter.call(source) : descriptor.value
      : undefined
    dataCache[key] = value
    if (typeof value === 'object' && deep) {
      reactive(value, observer, deep)
    }
    Object.defineProperty(source, key, {
      // Disallow any other code from overwriting our
      // getter or setter.
      configurable: false,
      enumerable: descriptors[key].enumerable,
      get() {
        if (getter) {
          return getter.call(this)
        }
        return dataCache[key]
      },
      set(value) {
        observer(key, value, source[key])
        if (setter) {
          return setter.call(this, value)
        }
        dataCache[key] = value
        return value
      },
    })
  }
  return source
}

module.exports = reactive
