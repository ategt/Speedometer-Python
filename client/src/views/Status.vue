<template>
	<div class="status-container">
		<Status v-bind:timeRemaining="timeRemaining" v-bind:speed="speed" v-bind:activity="activity"></Status>
		<div class="sub-banner receive-sub-banner">
			<div class="half-pane left-pane">
				<h2></h2>
			</div>
			<TimerButtons></TimerButtons>
		</div>
	</div>
</template>
<script>
import TimerButtons from '../components/partials/TimerButtons';
import Status from '../components/Status';

export default {
	name: "StatusView",
	components: {
		Status,
		TimerButtons,
	},
	data () {
		return {
			timeRemaining: null,
			speed: null,
			activity: null,
		};
	},
	mounted () {
		this.$options.sockets["tabata timer update broadcast"] = function (packet) {
    		const payload = packet.data;
    		this.timeRemaining = payload.timeRemaining;
    		this.activity = payload.activity;
		};

		this.$options.sockets["speedometer update broadcast"] = function (packet) {
    		const payload = packet.data;
    		this.speed = parseInt(payload.currentRevsPerMin);
		};
	},
}
</script>
<style>
.status-container {
	padding: 5em;
}	
</style>