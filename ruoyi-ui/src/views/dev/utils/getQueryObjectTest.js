function getQueryObject(url) {
    url = url == null ? window.location.href : url
    const search = url.substring(url.lastIndexOf('?') + 1)
    const obj = {}
    const reg = /([^?&=]+)=([^?&=]*)/g
    search.replace(reg, (rs, $1, $2) => {
        const name = decodeURIComponent($1)
        let val = decodeURIComponent($2)
        val = String(val)
        obj[name] = val
        return rs
    })
    return obj
}

function param2Obj(url) {
    const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
    if (!search) {
      return {}
    }
    const obj = {}
    const searchArr = search.split('&')
    searchArr.forEach(v => {
      const index = v.indexOf('=')
      if (index !== -1) {
        const name = v.substring(0, index)
        const val = v.substring(index + 1, v.length)
        obj[name] = val
      }
    })
    return obj
  }

// console.log(getQueryObject("https://cloud.tencent.com/act/redirect?fromSource=gwzcw.2477393.2477393.2477393&utm_medium=cpc&utm_id=gwzcw.2477393.2477393.2477393&cps_key=198c8df2ed259157187173bc7f4f32fd&page=voucherslist"));

console.log(getQueryObject("?key1=value1&key2=value2&key3=value3%20with%20space"));
console.log(param2Obj("?key1=value1&key2=value2&key3=value3%20with%20space"));