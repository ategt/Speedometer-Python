<template>
	<div class="recieve-area">
    <div class="sub-banner receive-sub-banner">
      <div class="half-pane left-pane">
        <h2>Received:</h2>
      </div>
    </div>
    <div id="recieved" class="recieved-field"></div>
  </div>
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
