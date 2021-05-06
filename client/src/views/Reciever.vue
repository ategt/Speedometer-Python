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
				<div id="reset-timer-button" class="timer-button" v-on:click="logToBroadcastField">
					TEST LOGGER
				</div>
				<h2>
					<span class="fullscreen-button-span">
					</span>
				</h2>
			</div>
		</div>
		<div id="recieved" class="recieved-field"></div>
	</div>
</template>
<script>
import { start_timer, stop_timer } from '../src/status';
export default {
	name: "Reciever",
	methods: {
		logToBroadcastField: function(msg) {
			// Log broadcast to recieving field.
	    	const el = document.getElementById("recieved");
	    	const divElement = document.createElement("div");

	    	divElement.innerText = JSON.stringify(msg.data);
	    	el.appendChild(divElement);	        	
    	},
    	sendTime (event) {
    		this.$socket.emit("tabata timer update", {"data": {"activity":"Some Text", "timeRemaining":Math.floor(Math.random() * 2500)}})
    	},
    	startTimer (event) {
    		start_timer(this);
    	},
    	stopTimer (event) {
    		stop_timer(this);
    	},
	},
	mounted () {
		this.$options.sockets["tabata timer update broadcast"] = this.logToBroadcastField;
		this.$options.sockets["speedometer update broadcast"]  = this.logToBroadcastField;
		this.$options.sockets["recorder action broadcast"]     = this.logToBroadcastField;
	},
}	
</script>
<style type="text/css" scoped="true">
.recieved-field {
    height: 29em;
    padding: 5px;
    overflow-y: overlay;
    margin: 1em;
}
</style>