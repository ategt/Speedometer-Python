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
    <div class="fullscreen-button">
      <a id="fullscreen-button" v-on:click="fullScreen" class="no-decoration">FULL&nbsp;SCREEN</a>
    </div>
  </div>
</template>
<script>
import { make_fullscreen, start_timer, stop_timer, reset_timer } from '../../shared/status';

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
<style type="text/css" scoped>
div.fullscreen-button {
  display: block;
  font-size: 1.5em;
  margin-block-start: 0.8em;
  margin-block-end: 1.1em;
  font-weight: bold;
  cursor: pointer;
  padding: 0.56em 0.6em;
  margin: 9px;
}
div.fullscreen-button:hover {
  border: 1px solid black;
  border-radius: 4px;
  margin: 8px;
}
.right-pane {
  padding-right: 1rem;
}
</style>