<template>
	<div id="calendar">
		<table>
			<tr v-for="(week, week_index) in weeksInMonth">
				<td v-for="(day, day_index) in daysInAWeek">

					{{ dayOfMonth(week_index, day_index) }}
				</td>
			</tr>
		</table>
	</div>
</template>
<script>
export default {
  name: 'Calendar',
  props: ['reports', 'month', 'year'],
  data () {
  	const daysInAWeek = 7;
  	const daysMonth = 31;

  	return {
  		weeksInMonth: Math.ceil(daysMonth/daysInAWeek),
  		daysInAWeek,
  		daysMonth,
  	}
  },
  components: {
  },
  methods: {
  	dayOfMonth: function (week_index, day_index) {
	  return week_index * this.daysInAWeek + day_index;
  	},
	daysOfMonth: function () {
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
  },
  mounted () {
  }
}
</script>
<style type="text/css">
	table > td, td {
	    border: 1px solid black;
    	padding: 11px;
    	text-align: right;
	}
</style>