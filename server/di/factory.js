const _factories = new WeakMap()

export default function factory(method = 'factory') {
  return function decorator(Clazz) {
    _factories.set(Clazz, method)
  };
}

export function hasFactory(clazz) {
  return _factories.has(clazz)
}

export function invokeFactory(clazz,instance){
  return instance[_factories.get(clazz)]()
}
