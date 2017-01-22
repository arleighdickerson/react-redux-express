import * as needlepoint from "needlepoint";
import factory, {hasFactory, invokeFactory} from "./factory";

function override(object, methodName, callback) {
  object[methodName] = callback(object[methodName])
}
override(needlepoint.container, 'resolve', function (original) {
  return function (clazz) {
    const returnValue = original.apply(this, arguments)
    return hasFactory(clazz) ? invokeFactory(clazz, returnValue) : returnValue
  }
})

module.exports = {factory, ...needlepoint}
