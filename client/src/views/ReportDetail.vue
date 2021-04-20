<template>
  <div id="main" class="main">
    <Graph v-if="showGraph"></Graph>
    <Summary></Summary>
  </div>
</template>
<script>
    //<Summary v-if="showText"></Summary>
//<Summary v-if="showText"></Summary>
//import { runOnLoad } from '../src/graph';
//import Summary from '../components/Summary.vue';
import Summary from '../components/Summary.vue';
import Graph from '../components/Graph.vue';

export default {
  name: 'graph',
  components: {
    Graph,
    Summary,
  },
  data () {
    return {
      showText: true,
      showGraph: true,
    }
  },
  mounted () {
    if (this.$route.params.spec) {
      // switch (this.$route.params.spec) {
      //   case "graph":
      //     this.showText = false;
      //     break; 
      //   case "text":
      //     this.showGraph = false;
      //     break;
      //   default:
           console.log("Here");        
      // }
    }
    console.log("Holla!");
  }
}
</script>