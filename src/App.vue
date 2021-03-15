<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  #app {
    .sidebar-container .is-active > .el-submenu__title{
      color: #409EFF !important;
    }
    #container {
      margin: 30px;
      .tableBody{
        padding: 30px 0;
      }
      .tablePage{
        display: flex;
        justify-content: center;
      }
      .hide .el-upload--picture-card{
        display: none;
      }
      .el-upload-list__item:before{
        display: inline-block;
        vertical-align: middle;
        content: '';
        height: 100%;
      }
      .el-upload-list__item img{
        display: inline-block;
        height: auto !important; 
        vertical-align: middle;
      }
    }
  }
  .pswp{
    z-index: 9999 !important;
  }
</style>
