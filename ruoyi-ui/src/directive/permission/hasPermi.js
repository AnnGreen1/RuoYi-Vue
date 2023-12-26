 /**
 * v-hasPermi 操作权限处理
 * Copyright (c) 2019 ruoyi
 */
 
import store from '@/store'

export default {
  // @author: anngreens 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
  inserted(el, binding, vnode) {
    console.log(el);
    const { value } = binding
    const all_permission = "*:*:*";
    const permissions = store.getters && store.getters.permissions

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value

      const hasPermissions = permissions.some(permission => {
        return all_permission === permission || permissionFlag.includes(permission)
      })
      /**
       * @author: anngreens
       * Node.parentNode 的用法：https://developer.mozilla.org/zh-CN/docs/Web/API/Node/parentNode
       * 这和 v-if 移除 dom 有什么区别？v-if 底层是怎么移除 dom 的？这可能直接去看 v-if 的源码更合适。
       */
      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  }
}
