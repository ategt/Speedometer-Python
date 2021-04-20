<template>
	<div id="summary" class="summary">
		<div  v-if="report">
			<div class="summary-grid">
				<div class="summary-grid-item">ID</div>
				<div class="summary-grid-item">{{report.id}}</div>
				<div class="summary-grid-item">Top Speed</div>
				<div class="summary-grid-item">{{report.topSpeed}}</div>
				<div class="summary-grid-item">Avg. Sprint Speed</div>
				<div class="summary-grid-item">{{ avgSprintSpeed }}</div>
				<div class="summary-grid-item">Avg. Sprint Length</div>
				<div class="summary-grid-item">{{ avgSprintLength }}</div>
				<div class="summary-grid-item">Cool Down</div>
				<div class="summary-grid-item">{{ coolDown }}</div>
				<div class="summary-grid-item">Date</div>
				<div class="summary-grid-item">{{display_string}}</div>
				<div class="summary-grid-item">Faulty Reading Count</div>
				<div class="summary-grid-item">{{report.faultyReadingCount}}</div>
				<div class="summary-grid-item">Workout Length</div>
				<div class="summary-grid-item">{{ totalLengthString }}</div>
				<div class="summary-grid-item">Sprint Count</div>
				<div class="summary-grid-item">{{report.sprintCount}}</div>
				<div class="summary-grid-item">Start Time</div>
				<div class="summary-grid-item">{{startTime.toLocaleTimeString()}}</div>
				<div class="summary-grid-item">Stop Time</div>
				<div class="summary-grid-item">{{stopTime.toLocaleTimeString()}}</div>
			</div>
			<PeaksReadout v-bind:peaks="peaks"></PeaksReadout>
			<textarea class="comment-textarea" v-model="report.remarks" v-on:blur="remarksUpdated"></textarea>
		</div>
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
</template>
<script>
import { load_summary, load_peak, updateRemarks, top_speed } from '../src/summary';
import { getReport, getReadings } from '../src/reports';
import { months } from '../src/constants';
import { detectPeaks } from '../src/peak-detection';
import PeaksReadout from './PeaksReadout.vue';
import axios from "axios";

Number.prototype.pad = function (size) {
	let s = String(this);
	while ( s.length < ( size || 2)) { s = "0" + s;}
	return s;
}

export default {
  name: 'Summary',
  components: {
  	PeaksReadout,
  },
  data () {
  	return {
  		peaks: new Array(),
  		report: null,
  		loading: true,
  		errors: new Array(),
  	}
  },
  computed: {
  	startTime: function () {
  		return new Date(parseInt(this.report.startTime)*1000);
  	},
  	stopTime: function () {
  		return new Date(parseInt(this.report.stopTime)*1000);
  	},
  	date: function () {
  		return new Date(parseInt(this.report.date));
  	},
  	display_string: function () {
  		return `${months[this.startTime.getMonth()]} ${this.startTime.getDate()}, ${this.startTime.getFullYear()}`;
  	},
  	avgSprintSpeed: function () {
  		return Math.round(this.report.averageSpeedDuringSprint * 100)/100;
  	},
  	avgSprintLength: function () {
  		return Math.round(this.report.avgSprintLength * 100)/100;
  	},
  	coolDown: function () {
  		return `${Math.floor(this.report.cooldownTime/60)}:${(this.report.cooldownTime%60).pad(2)} (${this.report.cooldownTime})`;
  	},
  	totalLengthString: function () {
  		return `${Math.floor(this.report.lengthOfWorkout/60)}:${(this.report.lengthOfWorkout%60).pad(2)} (${this.report.lengthOfWorkout})`;
  	}
  },
  methods: {
  	remarksUpdated: function (event) {
		updateRemarks(this.report.id, this.report.remarks);
  	},
  	populate: function (report) {
  		if (report) {  			
  			this.report = report;
  			this.getPeaks(report.startTime, report.stopTime);
  		}
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
  	},
  	loadingDone: function () {
  		this.loading = false;
  	},
  	accumulateErrors: function (error) {
  		this.errors.push(error);
  	},
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

	getReport(reportId).then(this.populate).catch(this.accumulateErrors).finally(this.loadingDone);
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