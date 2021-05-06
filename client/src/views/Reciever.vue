<template>
	<div class="recieve-area">
		<div class="sub-banner receive-sub-banner">
			<div class="half-pane left-pane">
				<h2>Received:</h2>
			</div>
			<div class="half-pane right-pane">
				<div id="start-timer-button" class="timer-button" v-on:click="startTimer">
					START TIMER
				</div>
				<div id="stop-timer-button" class="timer-button" v-on:click="stopTimer">
					STOP TIMER
				</div>
				<div id="reset-timer-button" class="timer-button" v-on:click="sendTime">
					SEND TIME
				</div>
				<div id="reset-timer-button" class="timer-button" v-on:click="sendTime">
					TEST LOGGER
				</div>
				<h2>
					<span class="fullscreen-button-span">
					</span>
				</h2>
			</div>
		</div>
		<RecieverField></RecieverField>
	</div>
</template>
<script>
import { start_timer, stop_timer } from '../src/status';
import RecieverField from '../components/Reciever.vue';
export default {
	name: "Reciever",
	components: {
		RecieverField,
	},
	methods: {
    	sendTime (event) {
    		this.$socket.emit("tabata timer update", {"data": {"activity":"Some Text", "timeRemaining":Math.floor(Math.random() * 2500)}});
    	},
    	startTimer (event) {
    		start_timer(this);
    	},
    	stopTimer (event) {
    		stop_timer(this);
    	},
	},
}	
</script>
<style type="text/css">
.recieved-field {
    height: 29em;
    padding: 5px;
    overflow-y: overlay;
    margin: 1em;
}
</style>