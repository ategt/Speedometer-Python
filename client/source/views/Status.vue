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
import TimerButtons from '../components/partials/TimerButtons.vue';
import Status from '../components/Status.vue';
import { is_fullscreen, close_fullscreen } from '../shared/status';

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
	computed: {
		clock_started () {
			return this.$store.getters['timer/hasClockStarted'];
		},
	},
	methods: {
		updateTimer (packet) {
    		const payload = packet.data;
    		this.timeRemaining = payload.timeRemaining;
    		this.activity = payload.activity;
		},
		updateSpeedometer (packet) {
    		const payload = packet.data;
    		this.speed = parseInt(payload.currentRevsPerMin);
		},
	},
	mounted () {
		this.$options.sockets["tabata timer update broadcast"] = this.updateTimer;
		this.$options.sockets["speedometer update broadcast"] = this.updateSpeedometer;
		this.$options.sockets["speedometer update broadcast"] = function (msg) {
			// If the clock is not running, and the bike is,
			// start the clock.
			if (!this.clock_started && +msg.data.currentRevsPerMin > 0) {
				this.$store.dispatch("timer/triggerTimerStart", this);
			} else {
				// Timer process seems to suspend at about 2:30 and
				// this code keeps it alive. Not sure why that is.
				this.$socket.emit('tabata timer action', {data:"PULSE"});
			}
		};
		this.$options.sockets['tabata timer update broadcast'] = function (msg) {
			// If timer runs out, exit fullscreen.
	    	if (msg.data.timeRemaining === " - " && is_fullscreen()) {
	    		close_fullscreen();
	    	}
		};

		this.$options.sockets['recorder action broadcast'] = function(msg) {
			// Recorder may have recieved an unrecognized command.
			if (msg.message === "Unknown Request Received") {
				console.warn(`RECORDER - ${msg.message}`, msg.data);
			}
	    };
	},
}
</script>
<style type="text/css">
.status-container {
	padding: 2em 5em 2em 5em;
}
.sub-banner {
    margin-top: 3em;
}
</style>