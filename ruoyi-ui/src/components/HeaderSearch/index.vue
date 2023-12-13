<template>
  <div :class="{ show: show }" class="header-search">
    <!-- @author: anngreens
    svg-icon 是全局组件，在 @/src/assets/icons/index.js 中注册
    -->
    <svg-icon
      class-name="search-icon"
      icon-class="search"
      @click.stop="click"
    />
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="Search"
      class="header-search-select"
      @change="change"
    >
      <el-option
        v-for="option in options"
        :key="option.item.path"
        :value="option.item"
        :label="option.item.title.join(' > ')"
      />
    </el-select>
  </div>
</template>

<script>
/**
 * @author: anngreens
 * Fuse.js 是一个依赖，slogan:Powerful, lightweight fuzzy-search library, with zero dependencies.（强大、轻量级的模糊搜索库，零依赖。）
 * 是一个前端模糊搜索依赖
 * https://www.fusejs.io/
 */
// fuse is a lightweight fuzzy-search module
// make search results more in line with expectations
import Fuse from "fuse.js/dist/fuse.min.js";
import path from "path";

export default {
  name: "HeaderSearch",
  data() {
    return {
      search: "",
      options: [],
      searchPool: [],
      show: false,
      fuse: undefined,
    };
  },
  computed: {
    routes() {
      /**
       * @author: anngreens
       * 有权限的路由数组
       */
      return this.$store.getters.permission_routes;
    },
  },
  watch: {
    routes() {
      this.searchPool = this.generateRoutes(this.routes);
    },
    searchPool(list) {
      console.log("@/components/HeadSearch/index.vue searchPool");
      console.log(list);
      this.initFuse(list);
    },
    show(value) {
      if (value) {
        document.body.addEventListener("click", this.close);
      } else {
        document.body.removeEventListener("click", this.close);
      }
    },
  },
  mounted() {
    this.searchPool = this.generateRoutes(this.routes);
  },
  methods: {
    click() {
      /**
       * @author: anngreens
       * 点击图标时会切换根节点所绑定的 class，控制是否添加 show 类名（即改变 width 属性），再结合 width 上的 transition 即可实现过渡效果（动画）
       */
      this.show = !this.show;
      if (this.show) {
        /**
         * @author: anngreens
         * 点击了图标给 el-select 加上焦点
         */
        this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus();
      }
    },
    close() {
      this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur();
      this.options = [];
      this.show = false;
    },
    change(val) {
      const path = val.path;
      /**
       * @author: anngreens
       * 注意是外链（包含 http 时）如何在新标签页打开
       * 且使用 substr(start, length) 函数从 http 字串开始截取剩余全部字符串
       */
      if (this.ishttp(val.path)) {
        // http(s):// 路径新窗口打开
        const pindex = path.indexOf("http");
        window.open(path.substr(pindex, path.length), "_blank");
      } else {
        this.$router.push(val.path);
      }
      this.search = "";
      this.options = [];
      this.$nextTick(() => {
        this.show = false;
      });
    },
    /**
     * @author: anngreens 构造 fuse 实例并保存到 this.fuse
     */
    initFuse(list) {
      this.fuse = new Fuse(list, {
        shouldSort: true, // @author: anngreens Whether to sort the result list, by score. 是否按分数对结果列表进行排序
        threshold: 0.4, // @author: anngreens At what point does the match algorithm give up.A threshold of 0.0 requires a perfect match (of both letters and location), a threshold of 1.0 would match anything.
        location: 0,
        distance: 100,
        minMatchCharLength: 1,
        keys: [
          {
            name: "title",
            weight: 0.7,
          },
          {
            name: "path",
            weight: 0.3,
          },
        ],
      });
    },
    /**
     * @author: 过滤能在左侧展示的路由，并构造国际化的标题
     */
    // Filter out the routes that can be displayed in the sidebar
    // And generate the internationalized title
    generateRoutes(routes, basePath = "/", prefixTitle = []) {
      let res = [];

      for (const router of routes) {
        // skip hidden router
        if (router.hidden) {
          continue;
        }

        const data = {
          path: !this.ishttp(router.path)
            ? path.resolve(basePath, router.path)
            : router.path,
          title: [...prefixTitle],
        };

        if (router.meta && router.meta.title) {
          data.title = [...data.title, router.meta.title];

          if (router.redirect !== "noRedirect") {
            // only push the routes with title
            // special case: need to exclude parent router without redirect
            res.push(data);
          }
        }

        // recursive child routes
        if (router.children) {
          const tempRoutes = this.generateRoutes(
            router.children,
            data.path,
            data.title
          );
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes];
          }
        }
      }
      return res;
    },
    querySearch(query) {  // @author: anngreens query 就是输入的值
      if (query !== "") {
        this.options = this.fuse.search(query);
      } else {
        this.options = [];
      }
    },
    ishttp(url) {
      return url.indexOf("http://") !== -1 || url.indexOf("https://") !== -1;
    },
  },
};
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    /* @author: anngreens
    在0.2s时间对 width 的变化添加默认时间函数（默认时间函数ease） 
    */
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    ::v-deep .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
