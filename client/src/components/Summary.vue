<template>
	<div id="summary" class="summary"></div>
</template>
<script>
import { runOnLoad, load_summary, load_peak, top_speed } from '../src/summary';
import { getReport, getReadings } from '../src/reports';
import { detectPeaks } from '../src/peak-detection';
import PeaksReadout from './PeaksReadout.vue';
import axios from "axios";

export default {
  name: 'Summary',
  components: {
  	PeaksReadout
  },
  data () {
  	return {
  		peaks: new Array(),
  	}
  },
  methods: {
  	populate: function (report) {
  		const empty_element = document.createElement("div");
  		empty_element.id = "peaks-readout";
  		load_summary(report, empty_element);
  		this.getPeaks(report.startTime, report.stopTime);
  	},
  	getPeaks: function (start, stop) {
  		getReadings(start, stop).then(this.parsePeaks)
  	},
  	parsePeaks: function (readings) {
  		const peaksIndexes = detectPeaks(readings.filter(d => d[0] < top_speed), d => d[0],
									{ 
									  lookaround: 20,  // the number of neighbors to compare to on each side
									  sensitivity: 0.5, // sensitivity, in terms of standard deviations above the mean
									  coalesce: 5     // coalesce together peaks within this distance of each other
									});

	  	const peakSet = new Set(peaksIndexes);
		const peaks = readings.map((itm, idx) => ({idx:idx, ...itm})).filter((itm, idx) => peakSet.has(idx));
		this.peaks = peaks;
		//const peaks_element = load_peak(peaks);
  	}
  },
  created () {
  	const params = {};
  	const route = this.$route;

	if (Object.keys(route.query).includes("start") && Object.keys(route.query).includes("stop")) {
		params.start = route.query.start;
		params.stop = route.query.stop;
	} else if (Object.keys(route.query).includes("base")) {
		const baseTimecode = parseInt(route.query.base);
		params.start = Math.round(baseTimecode/1000) - (24*60*60);
		params.stop = Math.round(baseTimecode/1000);
	}
	
	const reportId = parseInt(route.params.id);

	getReport(reportId).then(this.populate)

	// axios.get("http://127.0.0.1:5000/readings", {params:params}).then(function (response) {
	 //  	const peaksIndexes = detectPeaks(response.data.result.filter(d => d[0] < top_speed), d => d[0],
		// 							{ 
		// 							  lookaround: 20,  // the number of neighbors to compare to on each side
		// 							  sensitivity: 0.5, // sensitivity, in terms of standard deviations above the mean
		// 							  coalesce: 5     // coalesce together peaks within this distance of each other
		// 							});

	 //  	const peakSet = new Set(peaksIndexes);
		// const peaks = response.data.result.map((itm, idx) => ({idx:idx, ...itm})).filter((itm, idx) => peakSet.has(idx));
		// const peaks_element = load_peak(peaks);

		// axios.get("http://127.0.0.1:5000/report").then(function (response) {
		// 	const relevant_report = response.data.reports.filter(itm => itm.id === reportId)[0];
		// 	load_summary(relevant_report, peaks_element);
		// });
	//});
  },
  mounted () {
  }
}
</script>
<style>
	.summary {
		display: inline-block;
	    width: auto;
	}
	.summary-grid {
	    display: grid;
	    grid-template-columns: 10em 10em;
	    padding: 7em 1em 2em;
	}
	.summary-grid-row {
	    grid-row: auto;
	}
	.main {
		display: flex;
	}
	.peaks-grid {
	    display: grid;
	    grid-template-columns: 10em 10em;
	}
	.peaks-grid-item {
		padding: 0.1em 0.5em;
	}
	.peaks-grid-speed {
		text-align: left;
	}
	.peaks-grid-index {
		text-align: right;
	}
	.comment-textarea {
		width: 303px;
	    height: 4em;
	    padding: 1em 1em;
	    margin: 1em 0em;
	    border-radius: 7px;
	}
</style>