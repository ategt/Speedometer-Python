<template>
	<div id="calendar">
		<div class="month-name">
			{{ monthName }}
		</div>
		<table>
			<thead v-text="monthName"></thead>
			<tr>
				<th>S</th>
				<th>M</th>
				<th>T</th>
				<th>W</th>
				<th>R</th>
				<th>F</th>
				<th>S</th>
			</tr>
			<tr v-for="(week, week_index) in weeksInMonth">
				<td v-for="(day, day_index) in daysInAWeek" v-on:click="selectReport" v-bind:data-report-id="getReportId(week_index, day_index)" v-bind:class="{'has-report': isReport(week_index, day_index)}">
					{{ dayOfMonth(week_index, day_index) }}
				</td>
			</tr>
		</table>
	</div>
</template>
<script>
import { months } from "../src/constants";

export default {
  name: 'Calendar',
  props: ['reports', 'month', 'year'],
  data () {
  	const daysInAWeek = 7;
  	const daysMonth = this.getLastDateOfMonth(this.month, this.year);
  	const weeksInMonth = Math.ceil((this.getFirstDayOfMonth(this.month, this.year) + daysMonth)/daysInAWeek);
  	const monthName = months[this.month];

  	return {
  		weeksInMonth,
  		daysInAWeek,
  		daysMonth,
  		monthName,
  	}
  },
  components: {
  },
  methods: {
  	dayOfMonth: function (week_index, day_index) {
  	  const dayOfCalendar = this.getFirstDayOfMonth(this.month, this.year) + this.daysMonth;
	  const output = week_index * this.daysInAWeek + day_index - this.getFirstDayOfMonth(this.month, this.year) + 1;

	  return output > 0 && output <= this.getLastDateOfMonth(this.month, this.year) ? output : "";
  	},
	getLastDateOfMonth: function (month, year) {
	  const date = new Date();
	  date.setYear(year);
	  date.setMonth(month + 1);
	  date.setDate(0);

	  return date.getDate();
	},
	getFirstDayOfMonth: function (month, year) {
	  const date = new Date();
	  date.setYear(year);
	  date.setMonth(month);
	  date.setDate(1);

	  return date.getDay();
	},
	isReport: function (week_index, day_index) {
	  return this.getReport(week_index, day_index);
	},
	sameDate: function (date_a, date_b) {
	  return date_a.getDate() === date_b.getDate() && date_a.getMonth() === date_b.getMonth() && date_a.getYear() === date_b.getYear();
	},
	buildDate: function (week_index, day_index) {
	  const dateOfMonth = this.dayOfMonth(week_index, day_index);

	  const date = new Date();
	  date.setMonth(this.month);
	  date.setYear(this.year);
	  date.setDate(dateOfMonth);

	  return date;
	},
	getReport: function (week_index, day_index) {
	  const cellDate = this.buildDate(week_index, day_index);
	  const report = this.reports.find(report => {
	  	const startDate = new Date(report.startTime * 1000);
	  	return this.sameDate(startDate, cellDate);
	  });
	  return report;
	},
	getReportId: function (week_index, day_index) {
	  const report = this.getReport(week_index, day_index);
	  return report ? report.id : -1;
	},
	selectReport: function (event) {
	  const reportId = event.currentTarget.dataset['reportId'];
	  const report = this.reports.find(report => report.id == reportId);
	  this.$emit("report-clicked", report);
	},
  },
  mounted () {
  },
}
</script>
<style type="text/css">
	table > td, td {
	    border: 1px solid black;
    	padding: 11px;
    	text-align: right;
	}
</style>