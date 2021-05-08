<template>
    <div id="graph" class="aGraph"></div>
</template>
<script>
import { SpeedGraph } from '../shared/graph';

export default {
  name: 'Graph',
  props: ['speeds'],
  data () {
    return {
      speedGraph: null,
    };
  },
  watch: {
    speeds: function () {
      this.speedGraph.update( this.speeds );
    },
  },
  mounted () {
    this.speedGraph = new SpeedGraph( "#graph", this.speeds );
  },
}
</script>