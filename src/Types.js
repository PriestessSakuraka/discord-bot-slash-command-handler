/**
 * 型判定用
 *
 * @class
 */
class Types {
    static isBoolean(obj) {
        return Object.prototype.toString.call(obj) === "[object Boolean]"
    }
    static isString(obj) {
        return Object.prototype.toString.call(obj) === "[object String]"
    }
    static isNumber(obj) {
        return Object.prototype.toString.call(obj) === "[object Number]"
    }
    static isObject(obj) {
        return Object.prototype.toString.call(obj) === "[object Object]"
    }
    static isArray(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]"
    }
    static isFunction(obj) {
        return Object.prototype.toString.call(obj) === "[object Function]"
    }
}

module.exports = Types