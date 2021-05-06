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
						<!-- <a id="fullscreen-button" class="no-decoration">FULL&nbsp;SCREEN</a> -->
					</span>
				</h2>
			</div>
		</div>
		<div id="recieved" class="recieved-field"></div>
	</div>
</template>
<script>
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
    		console.log("Starting...");
    	},
    	stopTimer (event) {
    		console.log("Stopping...");
    	},
	},
	mounted () {
		this.$socket.on('speedometer update broadcast', this.logToBroadcastField);
		this.$socket.on('tabata timer update broadcast', this.logToBroadcastField);
		this.$socket.on('recorder action broadcast', this.logToBroadcastField);

		this.$socket.on('tabata timer update broadcast', function(msg) {
			// Log broadcast to recieving field.
	    	const el = document.getElementById("recieved");
	    	const divElement = document.createElement("div");

	    	divElement.innerText = JSON.stringify(msg.data);
	    	el.appendChild(divElement);
	    });

		this.$socket.io.on("connection", function (socket) {
    		socket.on("tabata timer update broadcast", function (msg) {
        		console.log(msg);
    		});
		});

		this.$options.sockets["tabata timer update broadcast"] = (data) => {
    		console.log(data);
		}

		window.sockx = this.$socket;
		window.optx  = this.$options;
	},
}	
</script>
<style type="text/css">
	
</style>