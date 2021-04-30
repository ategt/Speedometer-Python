<template>
    <div id="graph" class="aGraph"></div>
</template>
<script>
import { top_speed } from '../src/constants';
import { graphSpeeds } from '../src/graph';

export default {
  name: 'Graph',
  props: ['readings'],
  components: {
  },
  methods: {
    buildGraph: function () {
      const speeds = this.readings.map(item => item[0]);
      graphSpeeds(speeds, top_speed);
    },
  },
  mounted () {
    this.buildGraph();
  },
}
</script>