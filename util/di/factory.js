const _factories = new WeakMap()

/**
 *
 * @param method the factory method name
 * @returns {decorator}
 */
export default function factory(method = 'getObject') {
  return function decorator(Clazz) {
    if (!Clazz.prototype.hasOwnProperty(method)) {
      throw new Error(
        `Factory method '${method}' was not found on factory-annotated object`
      )
    }
    _factories.set(Clazz, method)
  }
}

export function hasFactory(clazz) {
  return _factories.has(clazz)
}

const _flyweights = new WeakMap()

export function invokeFactory(clazz, instance) {
  if (!_flyweights.has(instance)) {
    const flyweight = instance[_factories.get(clazz)]()
    _flyweights.set(instance, flyweight);
  }
  return _flyweights.get(instance)
}
