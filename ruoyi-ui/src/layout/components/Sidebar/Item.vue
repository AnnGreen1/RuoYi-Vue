<script>
export default {
  name: 'MenuItem',
  /**
   * @author: anngreens
   * 函数式组件
   */
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  /**
   * @author: anngreens
   * render 函数，jsx，高级🤔
   * @param { h } createElement函数 (该函数负责创建VNode)简写
   * @param { context } 函数组件的上下文，只在函数组件中可用
   */
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      /**
       * @author: anngreens
       * 'svg-icon' 是在 @/assets/icons/index.js 里全局注册的一个组件
       */
      vnodes.push(<svg-icon icon-class={icon}/>)
    }

    if (title) {
      /**
       * @author: anngreens
       * 这个 span 设置了 text-overflow: ellipsis !important; 属性，当 title 宽度不够时出现省略号，并且当 title 长度大于5时会添加 title 属性，这会使得鼠标悬浮时展示完整 title
       */
      if (title.length > 5) {
        vnodes.push(<span slot='title' title={(title)}>{(title)}</span>)
      } else {
        vnodes.push(<span slot='title'>{(title)}</span>)
      }
    }
    return vnodes
  }
}
</script>
