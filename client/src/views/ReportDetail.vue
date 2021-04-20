<template>
  <div id="main" class="main">
    <Graph v-if="showGraph"></Graph>
    <TextDetail v-if="showText"></TextDetail>
  </div>
</template>
<script>
//<Summary v-if="showText"></Summary>
import Graph from '../components/Graph.vue';
import TextDetail from '../components/TextDetail.vue';
//import { runOnLoad } from '../src/graph';

export default {
  name: 'graph',
  components: {
    Graph,
    TextDetail,
  },
  data () {
    return {
      showText: true,
      showGraph: true,
    }
  },
  mounted () {
    if (this.$route.params.spec) {
      switch (this.$route.params.spec) {
        case "graph":
          this.showText = false;
          break; 
        case "text":
          this.showGraph = false;
          break;
        default:
          console.log("Here");        
      }
    }
    console.log("Holla!");
  }
}
</script>