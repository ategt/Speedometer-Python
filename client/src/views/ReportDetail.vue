<template>
  <div id="main" class="main">
    <Graph v-if="showGraph"></Graph>
    <TextDetail v-if="showText"></TextDetail>
  </div>
</template>
<script>
import Graph from '../components/Graph.vue';
import TextDetail from '../components/TextDetail.vue';

export default {
  name: 'ReportDetail',
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
  }
}
</script>