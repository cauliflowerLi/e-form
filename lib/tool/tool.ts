const capitalizeFirstLetter = function (str: string): string {
  if (typeof str !== 'string') {
    return str
  }
  return str.charAt(0).toUpperCase() + str.slice(1)
}
// 判断类型
const is = (val, type) => {
  const typeArr = Array.isArray(type) ? type : [type]
  const valType = Object.prototype.toString.call(val)
  return typeArr.some((type) => `[object ${type}]` === valType)
}

export { capitalizeFirstLetter, is }
