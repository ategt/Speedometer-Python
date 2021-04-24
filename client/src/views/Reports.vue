<template>
	<div id="reports">
		<div v-if="reports.length">
			Number of reports: {{ reports.length }}
			<div class="report-item" v-for="report in reports">
				<a v-bind:id="'retire-report-' + report.id" class="retire-report" v-on:click="" v-bind:data-report="report.id">X</a>&nbsp;
				<router-link v-bind:to="{name:'Graph', params: {id: report.id}}">
						{{report.id}}: <ReportTimestamp v-bind:report="report"></ReportTimestamp>
						<span class="remarks">{{report.remarks}}</span>
				</router-link>
			</div>
		</div>
		<div v-else-if="errors.length">
			{{ errors }}
		</div>
		<div v-else-if="loading">
			Loading Reports...
		</div>
		<div v-else>
			No Reports Found
		</div>
	</div>
</template>

<script>
import { top_speed, days_abreviated, days, months } from '../src/constants';
import { getReports, printReports, retireReport, sortByStartingTime } from '../src/reports';
import ReportTimestamp from '../components/partials/ReportTimestamp.vue';
import { mapState, mapActions } from 'vuex';

export default {
	name: "Reports",
	components: {
		ReportTimestamp,
	},
	// methods: {
	// 	retireReport: function (event) {
	// 		retireReport(event.target.dataset.report);
	// 	},
	// },
	methods: mapActions('reports', [
    	'retireReport'
  	]),
	computed: mapState({
    	reports: state => Array.from(state.reports.reports).sort(state.reports.sortFunction),
    	loading: state => state.reports.loading,
    	errors: state => state.reports.errors,
    	//sortFunction: state => state.reports.sortFunction,
  	}),
	// data () {
 //      return {
 //      	reports: new Array(),
 //      	loading: true,
 //      	errors: new Array(),
 //      	sortFunction: sortByStartingTime,
 //      }
 //  	},
	created () {
		//this.loadReports();
		this.$store.dispatch('reports/getAllReports')
	}
}
	// function runTests() {
	// 	const testReports = [{id: 2, date: 1616207821217, startTime: 1612556555, stopTime: 1612831634},
	// 	 					 {id: 3, date: 1616207878565, startTime: 1616175953, stopTime: 1616177165},
	// 	 					 {id: 1, date: 1616207821217, startTime: 1612, stopTime: 1615}];

	// 	const sortResults = testReports.sort(sortByStartingTime).map(r => r.id);
	// 	const sortTestExpectations = [1,2,3];

	// 	if (!sortResults.map((n,i) => sortResults[i] === n).some(v => v === false)) {
	// 		console.log("Sort test passed.");
	// 	} else {
	// 		console.error("Sort test failure", sortResults);
	// 	}
</script>
<style type="text/css">
	/* tell the SVG path to be a thin blue line without an area fill */
	path {
		stroke-linejoin: round;
  		stroke-linecap: round;
	}

	.axis {
		shape-rendering: crispEdges;
	}

	.x.axis line {
		stroke: lightgrey;
	}

	.x.axis .minor {
		stroke-opacity: 0.5;
	}

	.x.axis path {
		display: none;
	}

	.y.axis line, .y.axis path {
		fill: none;
		stroke: orange;
	}

	.report-item {
		padding: 2px;
		font-size: large;
	}

	.report-item a {
		text-decoration: none;
		color: currentcolor;
	}

	.remarks {
		margin: 1rem;
	}

	.retire-report {
		cursor: pointer;
	    border: 1px solid black;
	    padding: 1px;
	    border-radius: 3px;
	}
</style>