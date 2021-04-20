export const make_fullscreen = function (element) {
		    if (element.requestFullscreen) {
		      element.requestFullscreen();
		    } else if (element.mozRequestFullScreen) {
		      element.mozRequestFullScreen();
		    } else if (element.webkitRequestFullscreen) {
		      element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		    } else if (element.msRequestFullscreen) {
		      element.msRequestFullscreen();
		    }
		};
export const close_fullscreen = function () {
	     if (document.exitFullscreen) {
	          document.exitFullscreen();
	        } else if (document.mozCancelFullScreen) {
	          document.mozCancelFullScreen();
	        } else if (document.webkitExitFullscreen) {
	          document.webkitExitFullscreen();
	        } else if (document.msExitFullscreen) {
	          document.msExitFullscreen();
	        }
		};
export const is_fullscreen = function () {
		    return (
		        document.fullscreenElement ||
		        document.webkitFullscreenElement ||
		        document.mozFullScreenElement ||
		        document.msFullscreenElement
		      );
		};
export const format_time = function (count) {
			if (count === " - ") { return count; }
		    const seconds = count % 60;
		    const minutes = Math.floor(count / 60);
		    
		    const min_str = minutes < 10 ? `0${minutes}` : `${minutes}`;
		    const sec_str = seconds < 10 ? `0${seconds}` : `${seconds}`;

		    return `${min_str}:${sec_str}`;
		};
export const start_timer = function () {
			socket.emit('tabata timer action', {data:"START", schedule: vm.buildSchedule()});
		};
export const stop_timer = function () {
			socket.emit('tabata timer action', {data:"STOP"});
		};
export const reset_timer = function () {
			socket.emit('tabata timer action', {data:"STOP"});
			clock_started = false;
		};
export const stop_recorder = function () {
			socket.emit("recorder directive", {directive:"shutdown"});
		};
