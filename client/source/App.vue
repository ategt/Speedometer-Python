<template>
  <div id="app">
    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>
<script>
import Footer from './components/partials/Footer.vue';
export default {
  name: 'app',
  components: {
    Footer
  }  
}
</script>
<!-- <style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style> -->