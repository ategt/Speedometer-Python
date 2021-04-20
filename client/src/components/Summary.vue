<template>
	<div id="summary" class="summary"></div>
</template>
<script>
import { runOnLoad, load_summary, load_peak, top_speed } from '../src/summary';
import { detectPeaks } from '../src/peak-detection';
import axios from "axios";

export default {
  name: 'Summary',
  components: {
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

	axios.get("http://127.0.0.1:5000/readings", {params:params}).then(function (response) {
	  	const peaksIndexes = detectPeaks(response.data.result.filter(d => d[0] < top_speed), d => d[0],
									{ 
									  lookaround: 20,  // the number of neighbors to compare to on each side
									  sensitivity: 0.5, // sensitivity, in terms of standard deviations above the mean
									  coalesce: 5     // coalesce together peaks within this distance of each other
									});

	  	const peakSet = new Set(peaksIndexes);
		const peaks = response.data.result.map((itm, idx) => ({idx:idx, ...itm})).filter((itm, idx) => peakSet.has(idx));
		const peaks_element = load_peak(peaks);

		const reportId = parseInt(route.params.id);
		axios.get("http://127.0.0.1:5000/report").then(function (response) {
			const relevant_report = response.data.reports.filter(itm => itm.id === reportId)[0];
			load_summary(relevant_report, peaks_element);
		});
	});
  },
  // beforeResolve (to) {
  //   if (to.meta.requiresCamera) {
  //     // do async things asking for camera
  //   }
  // },
  mounted () {
    //console.log("Holla!");
    //runOnLoad();
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