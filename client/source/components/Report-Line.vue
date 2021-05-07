<template>
	<div class="report-item">
		<a v-bind:id="'retire-report-' + report.id" class="retire-report" v-on:click="retire" v-bind:data-report="report.id">X</a>&nbsp;
		<router-link v-bind:to="{name:'Graph', params: {id: report.id}}">
				{{report.id}}: <ReportTimestamp v-bind:report="report"></ReportTimestamp>
				<span class="remarks">{{report.remarks}}</span>
		</router-link>
	</div>
</template>
<script>
import ReportTimestamp from './partials/ReportTimestamp.vue';

export default {
	name: "ReportLine",
	props: ['report'],
	components: {
		ReportTimestamp,
	},
	methods: {
		retire: function (event) {
			this.$emit('retire', this.report);
		},
	},
}	
</script>
<style type="text/css">
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