<template>
	<div class="info-banner-panel" id="info-panel" v-on:fullscreenchange="fullscreened">
		<video id="video_background" width="320" height="240" autoplay="true" muted="true" loop="true" poster="">
		    <source v-bind:src="movie_mp4" type="video/mp4">
		    <source v-bind:src="movie_ogg" type="video/ogg">
			Your browser does not support the video tag.
		</video>

		<div class="label speed">
			Speed
		</div>
		<div class="info-banner speed-banner" id="speed-banner">
			<h2 v-text="speedString"></h2>
		</div>
		<div class="label time-remaining">
			Time Remaining
		</div>
		<div class="info-banner timer-banner" id="timer-banner">
			<h2 v-text="timeRemainingString"></h2>
		</div>
		<div class="label current-activity">
			Activity
		</div>
		<div class="info-banner activity-banner" id="activity-banner">
			<h2 v-text="activityString"></h2>
		</div>
	</div>
</template>
<script>
import { format_time, is_fullscreen } from '../shared/status';
import movie_mp4 from '../assets/media/movie.mp4';
import movie_ogg from '../assets/media/movie.ogg';

console.log(movie_mp4);

export default {
	name: "Status",
	props: {
		timeRemaining: Number,
		speed: Number, 
		activity: String,
	},
	data () {
		return {
			movie_ogg,
			movie_mp4,
		};
	},
	computed: {
		activityString () {
			return String(this.activity) === this.activity ? this.activity : "-";
		},
		timeRemainingString () {
			return Number.isFinite(this.timeRemaining) && this.timeRemaining >= 0 ? format_time(this.timeRemaining) : "-";
		},
		speedString () {
		  return Number.isFinite(this.speed) ? `${this.speed} RPMs` : "-";
		},
	},
	methods: {
		fullscreened (event) {
			const element = event.currentTarget;

			if (is_fullscreen()) {
		        element.classList.add("fullscreen");
		        element.classList.add("fullscreen-dark");
		    } else {
		        element.classList.remove("fullscreen");
		        element.classList.remove("fullscreen-dark");
		    }
		},
	},
}
</script>