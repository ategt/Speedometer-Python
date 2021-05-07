<template>
    <div id="graph" class="aGraph"></div>
</template>
<script>
import { top_speed } from '../shared/constants';
import { graphSpeeds } from '../shared/graph';

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