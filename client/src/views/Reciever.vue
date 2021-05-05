<template>
	<div class="recieve-area">
		<div class="sub-banner receive-sub-banner">
			<div class="half-pane left-pane">
				<h2>Received:</h2>
			</div>
			<div class="half-pane right-pane">
			</div>
		</div>
		<div id="recieved" class="recieved-field"></div>
	</div>
</template>
<script>
				// <div id="start-timer-button" class="timer-button">
				// 	START TIMER
				// </div>
				// <div id="stop-timer-button" class="timer-button">
				// 	STOP TIMER
				// </div>
				// <div id="reset-timer-button" class="timer-button">
				// 	RESET TIMER
				// </div>
				// <h2>
				// 	<span class="fullscreen-button-span">
				// 		<a id="fullscreen-button" class="no-decoration">FULL&nbsp;SCREEN</a>
				// 	</span>
				// </h2>
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
	},
	mounted () {
		this.$socket.on('speedometer update broadcast', this.logToBroadcastField);
		this.$socket.on('tabata timer update broadcast', this.logToBroadcastField);
		this.$socket.on('recorder action broadcast', this.logToBroadcastField);
		this.$socket.io.on("connection", function (socket) {
    		socket.on("tabata timer update broadcast", function (msg) {
        		console.log(msg);
    		});
		});
		window.sockx = this.$socket;
		window.optx  = this.$options;
	},
}	
</script>