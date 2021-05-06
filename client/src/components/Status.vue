<template>
	<div class="info-banner-panel" id="info-panel" ref="info-banner-panel">
		<video id="video_background" width="320" height="240" autoplay="true" muted="true" loop="true" poster="">
		    <source src="../assets/media/movie.mp4" type="video/mp4">
		    <source src="../assets/media/movie.ogg" type="video/ogg">
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
export default {
	name: "Status",
	methods: {
	  makeFullscreen (element) {
	     if (element.requestFullscreen) {
	      element.requestFullscreen();
	    } else if (element.mozRequestFullScreen) {
	      element.mozRequestFullScreen();
	    } else if (element.webkitRequestFullscreen) {
	      element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
	    } else if (element.msRequestFullscreen) {
	      element.msRequestFullscreen();
	    }
	  },
	  closeFullscreen () {
	     if (document.exitFullscreen) {
	          document.exitFullscreen();
	        } else if (document.mozCancelFullScreen) {
	          document.mozCancelFullScreen();
	        } else if (document.webkitExitFullscreen) {
	          document.webkitExitFullscreen();
	        } else if (document.msExitFullscreen) {
	          document.msExitFullscreen();
	        }
	  },
	  isFullscreen () {
	    return (
	        document.fullscreenElement ||
	        document.webkitFullscreenElement ||
	        document.mozFullScreenElement ||
	        document.msFullscreenElement
	    );
	  },
	  startTimer () {
		socket.emit('tabata timer action', {data:"START", schedule: vm.buildSchedule()});
	  },
	  stopTimer () {
		socket.emit('tabata timer action', {data:"STOP"});
	  },
	  resetTimer () {
		socket.emit('tabata timer action', {data:"STOP"});
		clock_started = false;
	  },
	  stopRecorder () {
		socket.emit("recorder directive", {directive:"shutdown"});
	  },
	},
	mounted () {
		const element = document.getElementsByClassName("info-banner-panel")[0];

		// element.addEventListener("fullscreenchange", function (event) {
		//     if (is_fullscreen())   {
		//         element.classList.add("fullscreen");
		//         element.classList.add("fullscreen-dark");
		//     } else {
		//         element.classList.remove("fullscreen");
		//         element.classList.remove("fullscreen-dark");
		//     }
		// });

		// document.getElementById("fullscreen-button").addEventListener("click", function (event) {
		// 	make_fullscreen(element);
		// });

		// document.getElementById("start-timer-button").addEventListener("click", function (event) {
		// 	start_timer();
		// });

		// document.getElementById("stop-timer-button").addEventListener("click", function (event) {
		// 	stop_timer();
		// });

		// document.getElementById("reset-timer-button").addEventListener("click", function (event) {
		// 	reset_timer();
		// });
	}
}
</script>