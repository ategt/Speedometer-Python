<template>
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
		<textarea class="comment-textarea" v-model="remarks" v-on:blur="remarksUpdated"></textarea>
	</div>
</template>
<script>
import { months, top_speed } from '../shared/constants';
import { detectPeaks } from '../shared/peak-detection';
import PeaksReadout from './PeaksReadout.vue';
import { mapActions } from 'vuex';
import '../shared/decorate-number-pad';

export default {
  name: 'ReportTextDetail',
  components: {
  	PeaksReadout,
  },
  props: ['report', 'readings'],
  data () {
  	return {
  		peaks: new Array(),
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
  	},
    remarks: {
      get () {
        return this.report.remarks;
      },
      set (value) {
        this.$store.commit('reports/setRemarks', {reportId: this.report.id, comment:value});
      }
    },
  },
  methods: {
  	remarksUpdated: function (event) {
		  this.$store.dispatch("reports/updateRemarks", this.report);
  	},
  	parsePeaks: function (readings) {
      if ( readings && readings.length > 5 ) {
    		const peaksIndexes = detectPeaks(readings.filter(d => d[0] < top_speed), d => d[0],
  									{ 
  									  lookaround: 20,  // the number of neighbors to compare to on each side
  									  sensitivity: 0.5, // sensitivity, in terms of standard deviations above the mean
  									  coalesce: 5     // coalesce together peaks within this distance of each other
  									});

  	  	const peakSet = new Set(peaksIndexes);
  		  this.peaks = readings.map((itm, idx) => ({idx:idx, ...itm})).filter((itm, idx) => peakSet.has(idx));
      }
  	},
  },
  watch: {
    'readings': function () {
      this.parsePeaks(this.readings);
    },
  },
  created () {
	  this.parsePeaks(this.readings);
  },
}
</script>
<style type="text/css">
.comment-textarea {
  width: 303px;
    height: 4em;
    padding: 1em 1em;
    margin: 1em 0em;
    border-radius: 7px;
}
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
</style>