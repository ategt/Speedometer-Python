<template>
	<Status v-bind:timeRemaining="timeRemaining" v-bind:speed="speed" v-bind:activity="activity"></Status>	
</template>
<script>
import Status from '../components/Status';

export default {
	name: "StatusView",
	components: {
		Status,
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