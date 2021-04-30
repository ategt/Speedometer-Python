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
        <span class="reload-button" v-on:click="reload">Reload</span>
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
      activeReport: new Object(),
    }
  },
  computed: {
    ...mapState({
      loading: state => state.readings.loading,
      errors: state => state.readings.errors,
      loadingReports: state => state.reports.loading,
      reports: state => state.reports.reports,
      outstandingLoads: state => state.readings.outstanding,
      readingKeys: state => Object.keys(state.readings.readings),
    }),
    readings: function () {
      return this.activeReport && this.activeReport.id && this.$store.state.readings.readings[this.activeReport.id] ? this.$store.state.readings.readings[this.activeReport.id] : [];
    },
  },
  watch: {
    '$route': 'loadGraph',
    'loadingReports': 'loadGraph',
    'reports': 'loadGraph',
    'outstandingLoads': 'loadGraph',
    'readingKeys': 'loadGraph',
  },
  methods: {
    loadGraph: function () {
      const reportIdStr = this.$route.params.id;
      if ( reportIdStr ) {
        const reportId = parseInt(reportIdStr);
        const report = this.$store.getters["reports/getReport"](reportId);

        if (report) {
          this.activeReport = report;
          this.$store.dispatch('readings/getReadings', report);
        }
      }
    },
    reload: function (event) {
      this.loadGraph();
    },
  },
  created () {
    this.loadGraph();
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
<style type="text/css">
  .reload-button {
    width: 173em;
    border: 2px solid black;
    border-radius: 6px;
    background: lightgrey;
    padding: 5px 15px;
    margin: 5px;
  }
</style>