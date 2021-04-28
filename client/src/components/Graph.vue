<template>
    <div id="graph" class="aGraph"></div>
</template>
<script>
import { getReport, getReadings } from '../src/reports';
import { getLatestTimeCode } from '../src/summary';
import { top_speed } from '../src/constants';
import { graphSpeeds } from '../src/graph';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Graph',
  components: {
  },
  computed: {
    ...mapState({
          reports: state => Array.from(state.reports.reports).sort(state.reports.sortFunction),
          loading: state => state.reports.loading,
          errors: state => state.reports.errors,
          //sortFunction: state => state.reports.sortFunction,
          //readings: state => new A
    }),
    report: function () {
      return this.$store.getters["reports/getReport"](90);
    },
  },
  data () {
     return {
  //    report: null,
        readings: new Array(),
  //    loading: true,
  //    errors: new Array(),
     }
   },
  // methods: mapActions('reports', [
  //     'retireReport'
  //   ]),
  // watch: {
  //   report: function () {
  //     this.$nextTick(() => {
  //       const ul = this.$refs.list
  //       ul.scrollTop = ul.scrollHeight
  //     })
  //   }
  // },
  methods: {
    populate: function (report) {
      if (report) {
        this.report = report;
        this.loadGraph(report.startTime, report.stopTime);
      }
    },
    loadingDone: function () {
      this.loading = false;
    },
    accumulateErrors: function (error) {
      this.errors.push(error);
    },
    loadGraph: function (start, stop) {
      getReadings(start, stop).then(this.buildGraph);
    },
    buildGraph: function (readings) {
      const speeds = readings.map(item => item[0]);
      graphSpeeds(speeds, top_speed);
    },
    loadFromTimecode: function (timecode) {
      this.loadGraph(timecode - (2 * 60 * 60), timecode);
    },
    getReport: function (reportId) {
      return this.$store.getters["reports/getReport"](90);
    },
  },
  created () {
    const params = {};
    const route = this.$route;

    if ( route.params.id ) {
      const reportId = parseInt(route.params.id);

      //this.getReport(reportId).then(this.populate).catch(this.accumulateErrors).finally(this.loadingDone);
      //this.$store.dispatch('reports/getAllReports')
      this.report.then(this.populate).catch(this.accumulateErrors).finally(this.loadingDone);
    } else {
      if (Object.keys(route.query).includes("start") && Object.keys(route.query).includes("stop")) {
        params.start = route.query.start;
        params.stop = route.query.stop;
      } else if (Object.keys(route.query).includes("base")) {
        const baseTimecode = parseInt(route.query.base);
        params.start = Math.round(baseTimecode/1000) - (24*60*60);
        params.stop = Math.round(baseTimecode/1000);
      }

      if (Object.keys(params).includes("start") && Object.keys(params).includes("stop")) {
        this.loadGraph(params.start, params.stop);
      } else {
        getLatestTimeCode().then(this.loadFromTimecode);
      }
    }
  },
  mounted () {
    console.log(this.$route);
  },
}
</script>