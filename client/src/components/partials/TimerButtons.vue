<template>
	<div class="half-pane right-pane">
        <div id="start-timer-button" class="timer-button">
          START TIMER
        </div>
        <div id="stop-timer-button" class="timer-button">
          STOP TIMER
        </div>
        <div id="reset-timer-button" class="timer-button">
          RESET TIMER
        </div>
        <h2>
          <span class="fullscreen-button-span">
            <a id="fullscreen-button" class="no-decoration">FULL&nbsp;SCREEN</a>
          </span>
        </h2>
    </div>
</template>
<script type="text/javascript">
import io from "socket.io-client";
//const socket = io();
export default {
	name: "Buttons",
	data () {
		return {
			socket: io(),
		}
	}
}
</script>