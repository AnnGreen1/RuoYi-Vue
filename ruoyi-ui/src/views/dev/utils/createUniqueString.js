function createUniqueString() {
    const timestamp = +new Date() + ''// @author: anngreens 隐式类型转换，可以直接拿到时间戳
    const randomNum = parseInt((1 + Math.random()) * 65536) + ''
    console.log(randomNum);
    return (+(randomNum + timestamp)).toString(32)
}
console.log(createUniqueString());