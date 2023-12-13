<template>
  <!-- @author: anngreens
  v-on="$listeners"
  还有一个问题，vue2 单文件组件不是不支持多根节点的吗？那这个组件是什么情况？
  -->
  <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$listeners" />
  <svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners">
    <!-- @author: anngreens
    use 标签是什么？（是一个 HTML 原生标签）怎么用？
    -->
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  name: 'SvgIcon',
  /**
   * @author: anngreens
   * 在 @/components/HeaderSearch/index.vue 中使用到该组件时所传的 props 写的是 icon-class 和 class-name，还可以这样写？
   */
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.iconClass)
    },
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    },
    /**
     * @author: anngreens
     * 绑定的样式对象的写法，使用一个 computed，属性值是函数使用模板字符串，属性名是带有连字符的使用''
     */
    styleExternalIcon() {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover!important;
  display: inline-block;
}
</style>
