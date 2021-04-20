<template>
	<span>{{days[date.getDay()]}} {{months[date.getMonth()]}} {{date.getDate()}}, {{date.getFullYear()}} {{date.toLocaleTimeString()}}</span>
</template>
<script>
import { top_speed, days_abreviated, days, months } from '../../src/constants';
export default {
  name: "report-timestamp",
  props: ['report'],
  data() {
    return {
      days: days,
      months: months,
    }
  },
  computed: {
  	date: function () {
  		return new Date(parseInt(this.report.startTime)*1000);
  	}
  }
}
</script>
