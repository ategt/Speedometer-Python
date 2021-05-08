<template>
  <div id="main" class="main">
    <div v-if="showGraph">
      <Graph v-if="speeds.length" v-bind:speeds="speeds"></Graph>
      <div v-else-if="errors.length">
        {{ errors }}
      </div>
      <div v-else-if="loading">
        Loading Readings...
      </div>
      <Graph v-else-if="history.length" v-bind:speeds="historySpeeds"></Graph>
      <div v-else>
        No Readings Found
        <span class="reload-button" v-on:click="reload">Reload</span>
      </div>
    </div>
  	<div id="summary" class="summary" v-if="showText">
  	  <ReportTextDetail v-if="activeReport" v-bind:report="activeReport" v-bind:readings="readings"></ReportTextDetail>
  		<div class="error-report" v-else-if="errors.length">
  			There was a problem loading the Report.
  		</div>
  		<div class="loading-report" v-else-if="loading">
  			Loading Report Details...
  		</div>
  		<div class="other-report" v-else>
  			No Report Details Found
  		</div>
  	</div>
  </div>
</template>
<script>
import Graph from '../components/Graph.vue';
import ReportTextDetail from '../components/ReportTextDetail.vue';
import { generate_report } from '../shared/reports';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ReportDetail',
  components: {
    Graph,
    ReportTextDetail,
  },
  data () {
    return {
      showText: true,
      showGraph: true,
      activeReport: null,
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
      history: state => state.speedometer.speedHistory,
    }),
    readings () {
      if ( this.activeReport && 
            this.activeReport.id && 
            this.$store.state.readings.readings[this.activeReport.id] ) {
        return this.$store.state.readings.readings[this.activeReport.id];
      } else {
        return [];
      }
    },
    speeds () {
      return this.readings.map(item => item[0]);
    },
    historySpeeds () {
      return this.history.map(datum => parseInt(datum.currentRevsPerMin));
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
  mounted () {},
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
  .main {
    display: flex;
  }
  .summary {
    display: inline-block;
    width: auto;
  }
</style>