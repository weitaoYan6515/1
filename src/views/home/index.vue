<template>
  <div class="home-container" id="container">
    <div class="home-text">欢迎使用{{name}}质保管理总后台</div>
    <!-- <div class="home-text">name: {{ name }}</div> -->
  </div>
</template>

<script>
import defaultSettings from '@/settings'
// import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  /* computed: {
    ...mapGetters([
      'name'
    ])
  } */
  data() {
    return {
      name:defaultSettings.title
    }
  },
  mounted() {
    
  },
}
</script>

<style lang="scss" scoped>
.home {
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
