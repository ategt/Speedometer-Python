<template>
    <div id="graph" class="aGraph"></div>
</template>
<script>
import { getReport, getReadings } from '../src/reports';
import { top_speed } from '../src/constants';
import { graphSpeeds } from '../src/graph';

export default {
  name: 'Graph',
  components: {
  },
  data () {
    return {
      report: null,
      readings: new Array(),
      loading: true,
      errors: new Array(),
    }
  },
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
  },
  created () {
    const params = {};
    const route = this.$route;

    if ( route.params.id ) {
      const reportId = parseInt(route.params.id);

      getReport(reportId).then(this.populate).catch(this.accumulateErrors).finally(this.loadingDone);
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
        console.error("Nothing to load");
      }
    }
  },
  mounted () {
  }
}
</script>