<template>
    <div id="graph" class="aGraph"></div>
</template>
<script>
import { top_speed } from '../shared/constants';
import { graphSpeeds } from '../shared/graph';

export default {
  name: 'Graph',
  props: ['speeds'],
  components: {
  },
  methods: {
    buildGraph: function () {
      graphSpeeds(this.speeds, top_speed);
    },
  },
  mounted () {
    this.buildGraph();
  },
}
</script>