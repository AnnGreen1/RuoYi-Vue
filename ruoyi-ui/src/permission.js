import router from './router'
import store from './store'
import { Message } from 'element-ui'
/**
 * @author: anngreens
 * 一个进度条依赖包
 */
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { isRelogin } from '@/utils/request'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/register']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    to.meta.title && store.dispatch('settings/setTitle', to.meta.title)
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      /**
       * @author: anngreens
       * 有 token 不去登录页的情况
       */
      if (store.getters.roles.length === 0) { // 判断是否已经获取用户信息
        isRelogin.show = true
        // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(() => {
          isRelogin.show = false
          /**
           * @author: anngreens
           * @file: @/store/modules/permission.js line 33
           * 分发 action ，生成路由
           */
          store.dispatch('GenerateRoutes').then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            /**
             * @author: anngreens
             * 经过一系列操作，添加动态路由到路由器
             * 这和 @/store/modules/permission.js line 48 有什么区别？
             */
            console.log("@/permission.js addRoutes()");
            console.log(accessRoutes);
            router.addRoutes(accessRoutes) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成  放行-->路由跳转
          })
        }).catch(err => {
          store.dispatch('LogOut').then(() => {
            Message.error(err)
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      console.warn("重定向的位置");
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
