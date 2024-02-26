/**
 * 
 * @author: anngreens （GPT回答）
 * 这段代码是一个JavaScript函数，用于实现页面平滑滚动效果。让我们逐步解释这段代码：

    1. `Math.easeInOutQuad` 函数定义了一个基于二次缓动函数的数学计算，用于平滑动画效果的计算。

    2. `requestAnimFrame` 定义了一个跨浏览器的动画帧请求函数，用于在动画中执行回调函数。

    3. `move` 函数用于将页面滚动到指定位置，通过设置不同元素的 `scrollTop` 属性实现滚动效果。

    4. `position` 函数用于获取当前页面滚动位置，优先使用 `document.documentElement.scrollTop`，其次是 `document.body.parentNode.scrollTop` 或 `document.body.scrollTop`。

    5. `scrollTo` 函数是一个导出的函数，用于实现页面滚动到指定位置，并在指定的时间内应用平滑滚动效果。该函数接受目标滚动位置 `to`、滚动持续时间 `duration` 和回调函数 `callback` 作为参数。

    具体实现逻辑如下：
    - 计算起始位置 `start` 和滚动距离 `change`。
    - 设定时间增量 `increment`，默认为 20 毫秒。
    - 开始时间为 0，如果未提供滚动持续时间，则默认为 500 毫秒。
    - 在 `animateScroll` 函数中，不断增加当前时间 `currentTime`，并通过二次缓动函数计算滚动值 `val`。
    - 将页面滚动到计算得到的值 `val`。
    - 判断当前时间是否小于滚动持续时间，如果是则继续执行动画，否则执行回调函数。
    - 如果提供了回调函数且为函数类型，则在动画结束后执行回调函数。

    总的来说，这段代码实现了一个平滑滚动效果的函数 `scrollTo`，使页面能够在指定的时间内以平滑的方式滚动到指定位置，并在滚动结束后执行回调函数。 
 */
Math.easeInOutQuad = function(t, b, c, d) {
  t /= d / 2
  if (t < 1) {
    return c / 2 * t * t + b
  }
  t--
  return -c / 2 * (t * (t - 2) - 1) + b
}

// requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
var requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) { window.setTimeout(callback, 1000 / 60) }
})()

/**
 * Because it's so fucking difficult to detect the scrolling element, just move them all
 * @param {number} amount
 */
function move(amount) {
  document.documentElement.scrollTop = amount
  document.body.parentNode.scrollTop = amount
  document.body.scrollTop = amount
}

function position() {
  return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop
}

/**
 * @param {number} to
 * @param {number} duration
 * @param {Function} callback
 */
export function scrollTo(to, duration, callback) {
  const start = position()
  const change = to - start
  const increment = 20
  let currentTime = 0
  duration = (typeof (duration) === 'undefined') ? 500 : duration
  var animateScroll = function() {
    // increment the time
    currentTime += increment
    // find the value with the quadratic in-out easing function
    var val = Math.easeInOutQuad(currentTime, start, change, duration)
    // move the document.body
    move(val)
    // do the animation unless its over
    if (currentTime < duration) {
      requestAnimFrame(animateScroll)
    } else {
      if (callback && typeof (callback) === 'function') {
        // the animation is done so lets callback
        callback()
      }
    }
  }
  animateScroll()
}
