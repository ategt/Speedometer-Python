<template>
	<div class="info-banner-panel" id="info-panel">
		<video id="video_background" width="320" height="240" autoplay="true" muted="true" loop="true" poster="">
		    <source src="./send/cdn-movie.mp4" type="video/mp4">
		    <source src="./send/cdn-movie.ogg" type="video/ogg">
			Your browser does not support the video tag.
		</video>
		<div class="label speed">
			Speed
		</div>
		<div class="info-banner speed-banner" id="speed-banner">
			<h2>-</h2>
		</div>
		<div class="label time-remaining">
			Time Remaining
		</div>
		<div class="info-banner timer-banner" id="timer-banner">
			<h2>-</h2>
		</div>
		<div class="label current-activity">
			Activity
		</div>
		<div class="info-banner activity-banner" id="activity-banner">
			<h2>-</h2>
		</div>
	</div>
</template>
<script type="text/javascript">
import io from 'socket.io-client';
export default {
	name: "Status",
	data () {
		return {
			socket: 
		}
	},
	methods: {

	},
	mounted () {
		const element = document.getElementsByClassName("info-banner-panel")[0];

		element.addEventListener("fullscreenchange", function (event) {
		    if (is_fullscreen())   {
		        element.classList.add("fullscreen");
		        element.classList.add("fullscreen-dark");
		    } else {
		        element.classList.remove("fullscreen");
		        element.classList.remove("fullscreen-dark");
		    }
		});
	}


	document.getElementById("fullscreen-button").addEventListener("click", function (event) {
		make_fullscreen(element);
	});

	document.getElementById("start-timer-button").addEventListener("click", function (event) {
		start_timer();
	});

	document.getElementById("stop-timer-button").addEventListener("click", function (event) {
		stop_timer();
	});

	document.getElementById("reset-timer-button").addEventListener("click", function (event) {
		reset_timer();
	});

	

	}
}
</script>