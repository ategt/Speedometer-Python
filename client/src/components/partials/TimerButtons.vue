<template>
	<div class="half-pane right-pane">
    <div id="start-timer-button" class="timer-button" v-on:click="startTimer">
      START TIMER
    </div>
    <div id="stop-timer-button" class="timer-button" v-on:click="stopTimer">
      STOP TIMER
    </div>
    <div id="reset-timer-button" class="timer-button" v-on:click="resetTimer">
      RESET TIMER
    </div>
    <h2>
      <span class="fullscreen-button-span">
        <a id="fullscreen-button" v-on:click="fullScreen" class="no-decoration">FULL&nbsp;SCREEN</a>
      </span>
    </h2>
  </div>
</template>
<script>
import { make_fullscreen, start_timer, stop_timer, reset_timer } from '../../src/status';

export default {
	name: "TimerButtons",
  methods: {
    fullScreen: function (event) {
      const element = document.getElementsByClassName("info-banner-panel")[0];
      make_fullscreen(element);
    },
    startTimer: function (event) {
      start_timer(this);
    },
    stopTimer: function (event) {
      stop_timer(this);
    },
    resetTimer: function (event) {
      reset_timer(this);
    },
  },
}
</script>