<template>
  <div id="main" class="main">
    <div id="graph" class="aGraph"></div>
    <Summary></Summary>
  </div>
</template>
<script>
import { runOnLoad } from '../src/graph';
import Summary from '../components/Summary.vue';

export default {
  name: 'graph',
  components: {
    Summary,
  },
  mounted () {
    runOnLoad();
  }
}
</script>