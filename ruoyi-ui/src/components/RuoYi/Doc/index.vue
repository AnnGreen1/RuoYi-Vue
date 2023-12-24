<template>
  <div>
    <!-- @author: anngreens
    svg-icon 是全局组件，在 @/src/assets/icons/index.js 中注册
    -->
    <svg-icon icon-class="question" @click="goto" />
  </div>
</template>

<script>
export default {
  name: "RuoYiDoc",
  data() {
    return {
      url: "http://doc.ruoyi.vip/ruoyi-vue",
    };
  },
  methods: {
    goto() {
      window.open(this.url);
    },
  },
};
</script>