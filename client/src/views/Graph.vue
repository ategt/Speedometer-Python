<template>
  <div id="main" class="main">
    <div id="graph" class="aGraph"></div>
    <div id="summary" class="summary"></div>
  </div>
</template>
<script>
import { runOnLoad } from '../src/graph';

export default {
  name: 'graph',
  components: {
  },
  mounted () {
    runOnLoad();
  }
}
</script>
<style src="../graph.css"></style>