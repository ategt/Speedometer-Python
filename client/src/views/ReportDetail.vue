<template>
  <div id="main" class="main">
    <div v-if="showGraph">
      <Graph v-if="readings.length" v-bind:readings="readings"></Graph>
      <div v-else-if="errors.length">
        {{ errors }}
      </div>
      <div v-else-if="loading">
        Loading Readings...
      </div>
      <div v-else>
        No Readings Found
      </div>
    </div>
  </div>
</template>
<script>
//<TextDetail v-if="showText"></TextDetail>
import Graph from '../components/Graph.vue';
import TextDetail from '../components/TextDetail.vue';
import { mapState, mapActions } from 'vuex';

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
  computed: mapState({
    readings: state => state.readings.readings,
    loading: state => state.readings.loading,
    errors: state => state.readings.errors,
    loadingReports: state => state.reports.loading,
    reports: state => state.reports.reports,
  }),
  watch: {
    '$route': 'loadGraph',
    'loadingReports': 'loadGraph',
    'reports': 'loadGraph',
  },
  methods: {
    loadGraph: function () {
      const reportIdStr = this.$route.params.id;
      if ( reportIdStr ) {
        const reportId = parseInt(reportIdStr);
        const report = this.$store.getters["reports/getReport"](reportId);

        if (report) {
          this.$store.dispatch('readings/getReadings', report);
        }
      }
    },
  },
  created () {
    this.$store.dispatch('reports/populateReports');
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