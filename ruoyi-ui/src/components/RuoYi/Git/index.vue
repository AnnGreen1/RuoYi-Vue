<template>
  <div>
    <!-- @author: anngreens
    svg-icon 是全局组件，在 @/src/assets/icons/index.js 中注册
    -->
    <svg-icon icon-class="github" @click="goto" />
  </div>
</template>

<script>
export default {
  name: "RuoYiGit",
  data() {
    return {
      url: "https://gitee.com/y_project/RuoYi-Vue",
    };
  },
  methods: {
    goto() {
      window.open(this.url);
    },
  },
};
</script>