<template>
  <i-frame :src="url" />
</template>
<script>
import iFrame from "@/components/iFrame/index";
export default {
  name: "Druid",
  components: { iFrame },
  data() {
    return {
      /**
       * @author: anngreens
       * 注意 url 需要的 ip ，如何得到
       */
      url: process.env.VUE_APP_BASE_API + "/druid/login.html"
    };
  },
};
</script>
