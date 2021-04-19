<template>
  <div id="main" class="main">
    <div id="graph" class="aGraph"></div>
    <div id="summary" class="summary"></div>
  </div>
</template>
<script>
//import Nav from './components/partials/Nav.vue';
//import Footer from './components/Footer.vue';
import { runOnLoad } from './src/graph';

export default {
  name: 'graph',
  components: {
    //Footer
  },
  mounted () {
    runOnLoad();
  }
}
</script>