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