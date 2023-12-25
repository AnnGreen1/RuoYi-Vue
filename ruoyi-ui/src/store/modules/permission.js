import auth from '@/plugins/auth'
/**
 * @author: anngreens
 * router: 路由器实例
 * constantRoutes: 公共路由
 * dynamicRoutes: 动态路由（但是是直接写在代码里的）
 */
import router, { constantRoutes, dynamicRoutes } from '@/router'
import { getRouters } from '@/api/menu'
/**
 * @author: anngreens
 * 直接导入一个组件，名字叫 Layout
 */
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'

const permission = {
  state: {
    routes: [], // @author: anngreens 所有路由
    addRoutes: [], // @author: anngreens 有权限的路由
    defaultRoutes: [], // @author: anngreens 默认路由
    topbarRouters: [], // @author: anngreens 顶部菜单
    sidebarRouters: [] // @author: anngreens 侧边栏菜单
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes // @author: anngreens 有权限的路由
      state.routes = constantRoutes.concat(routes) // @author: anngreens 所有路由
    },
    /**
     * @author: anngreens 
     * 设置默认路由 
     */
    SET_DEFAULT_ROUTES: (state, routes) => {
      state.defaultRoutes = constantRoutes.concat(routes) // @author: anngreens 默认路由
    },
    SET_TOPBAR_ROUTES: (state, routes) => {
      state.topbarRouters = routes
    },
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      state.sidebarRouters = routes
    },
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        getRouters().then(res => {
          const sdata = JSON.parse(JSON.stringify(res.data)) // @author: anngreens 深拷贝
          const rdata = JSON.parse(JSON.stringify(res.data)) // @author: anngreens 深拷贝
          const sidebarRoutes = filterAsyncRouter(sdata) // @author: anngreens 深拷贝
          const rewriteRoutes = filterAsyncRouter(rdata, false, true) // @author: anngreens 过滤路由
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes); // @author: anngreens 过滤路由
          rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
          /**
           * @author: anngreens
           * 经过一系列操作，添加动态路由到路由器
           * 这和 @/permission.js line 42 有什么区别？
           */
          console.log("@/store/modules/permission.js addRoutes()");
          console.log(asyncRoutes);
          router.addRoutes(asyncRoutes);
          commit('SET_ROUTES', rewriteRoutes)
          commit('SET_SIDEBAR_ROUTERS', constantRoutes.concat(sidebarRoutes))
          commit('SET_DEFAULT_ROUTES', sidebarRoutes)
          commit('SET_TOPBAR_ROUTES', sidebarRoutes)
          /**
           * @author: anngreens
           * rewriteRoutes 是经过 filterAsyncRouter 过滤后的路由？和原始的有什么不同呢？
           */
          console.log("@/store/modules/permission.js res.data");
          console.log(res.data);
          console.log("@/store/modules/permission.js rewriteRoutes");
          console.log(rewriteRoutes);

          resolve(rewriteRoutes)
        })
      })
    }
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        /**
         * @author: anngreens
         * 把导入的一个组件直接赋值给 component 属性
         */
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        /**
         * @author: anngreens
         * 加载组件
         */
        route.component = loadView(route.component)
      }
    }
    /**
     * @author: anngreens
     * 使用一个递归，具有子路由的继续构造子路由，没有子路由的去除 route 对象的 children 和 redirect 两个键
     */
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    /**
     * @author: anngreens
     * 保留构造好的路由
     */
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  /**
   * @author: anngreens
   * el: 数组中正在处理的当前元素。
   * index: 数组中正在处理的当前元素的索引。
   */
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = []
  routes.forEach(route => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}

/**
 * @author: anngreens
 * 参考 实现的一个简单（简陋）的动态路由
 */
export const loadView = (view) => {
  if (process.env.NODE_ENV === 'development') {
    return (resolve) => require([`@/views/${view}`], resolve)
  } else {
    /**
     * @author: anngreens
     * 这里加不加 .vue 都是可以的，应该是与编译器有关
     */
    // 使用 import 实现生产环境的路由懒加载
    return () => import(`@/views/${view}`)
  }
}

export default permission
