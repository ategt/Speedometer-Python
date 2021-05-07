<template>
	<div id="reports">
		<div v-if="reports.length">
			Number of reports: {{ reports.length }}
			<ReportLine v-for="report in reports" v-bind:key="report.id" v-bind:report="report" v-on:retire="retireReport"></ReportLine>
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
import ReportLine from '../components/Report-Line.vue';
import { mapState, mapActions } from 'vuex';

export default {
	name: "Reports",
	components: {
		ReportLine,
	},
	methods: {
		retireReport: function (report) {
			this.$store.dispatch("reports/retireReport", report.id);
		},
	},
	computed: mapState({
    	reports: state => Array.from(state.reports.reports).sort(state.reports.sortFunction),
    	loading: state => state.reports.loading,
    	errors: state => state.reports.errors,
  	}),
	created () {
		this.$store.dispatch('reports/populateReports');
	}
}
</script>
<style type="text/css">
</style>