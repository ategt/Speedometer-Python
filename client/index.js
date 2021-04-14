const NUMBER_REGEX = new RegExp("b\\'([\\d]+)");
const socket = io();
let clock_started = false;

const schedule = [{id: 1, activity:"Warmup",    interval: 2*60},
      	          {id: 2, activity:"Sprint!",   interval: 30},
        	      {id: 3, activity:"Recover",   interval: 3*60},
            	  {id: 4, activity:"Sprint!",   interval: 30},
	              {id: 5, activity:"Recover",   interval: 3*60},
              	  {id: 6, activity:"Sprint!",   interval: 30},
                  {id: 7, activity:"Recover",   interval: 3*60},
              	  {id: 8, activity:"Sprint!",   interval: 30},
              	  {id: 9, activity:"Recover",   interval: 3*60},
              	  {id:10, activity:"Sprint!",   interval: 30},
              	  {id:11, activity:"Cool Down", interval: 3*60}];

window.addEventListener("load", function (event) {
	const vm = new Vue({
	  el: '#schedule-area',
	  data: {
	    schedule: 'schedule' in sessionStorage ? JSON.parse(sessionStorage['schedule']) : schedule,
	  },
	  methods: {
	  	retire: function (event) {
	  		const retire_id = event.currentTarget.dataset['id'];
	  		vm.schedule = vm.schedule.filter(item => item.id != retire_id);
	  	},
	  	addScheduleItem: function (event) {
	  		const new_id = vm.schedule.map(item => item.id).reduce((itm, acc) => itm > acc ? itm : acc, 0) + 1;
	  		vm.schedule.push({id:new_id, activity:"Activity", interval: 5});
	  	},
	  	buildSchedule: function () {
	  		return vm.schedule;
	  	},
	  	saveSchedule: function (event) {
			sessionStorage['schedule'] = JSON.stringify(vm.schedule);
			alert("This Feature is not Implimented Yet.");
	  	},
	  	updateInterval: function (event) {
	  		const updated_id = event.currentTarget.dataset['id'];
	  		const evaluated_value = eval(event.currentTarget.value);
	  		event.currentTarget.value = evaluated_value;
	  		vm.schedule.filter(item => item.id == updated_id)[0].interval = evaluated_value;
	  	}
	  },
	  computed: {},
	  mounted () {},
	});

	const make_fullscreen = function (element) {
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

	const close_fullscreen = function () {
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

	const is_fullscreen = function () {
	    return (
	        document.fullscreenElement ||
	        document.webkitFullscreenElement ||
	        document.mozFullScreenElement ||
	        document.msFullscreenElement
	      );
	};

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

	const start_timer = function() {
		socket.emit('tabata timer action', {data:"START", schedule: vm.buildSchedule()});
	};

	const stop_timer = function() {
		socket.emit('tabata timer action', {data:"STOP"});
	};

	const reset_timer = function() {
		socket.emit('tabata timer action', {data:"STOP"});
		clock_started = false;
	};

	const stop_recorder = function() {
		socket.emit("recorder directive", {directive:"shutdown"});
	};

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

	const format_time = function (count) {
		if (count === " - ") { return count; }
	    const seconds = count % 60;
	    const minutes = Math.floor(count / 60);
	    
	    const min_str = minutes < 10 ? `0${minutes}` : `${minutes}`;
	    const sec_str = seconds < 10 ? `0${seconds}` : `${seconds}`;

	    return `${min_str}:${sec_str}`;
	};

	socket.on('speedometer update broadcast', function(msg) {
		// Log broadcast to recieving field.
    	const el = document.getElementById("recieved");
    	const divElement = document.createElement("div");

    	divElement.innerText = JSON.stringify(msg.data);
    	el.appendChild(divElement);	        	
    });

	socket.on('speedometer update broadcast', function(msg) {
		// Update RPM speed field.
    	const el = document.getElementById("speed-banner");
    	const headingElement = document.createElement("h2");

    	headingElement.innerText = `${msg.data.currentRevsPerMin} RPMs`;
    	el.replaceChildren(headingElement);
	});

	socket.on('speedometer update broadcast', function(msg) {
		// If the clock is not running, and the bike is,
		// start the clock.
		if (!clock_started && +msg.data.currentRevsPerMin > 0) {
			clock_started = true;
			start_timer();
		} else {
			// Timer process seems to suspend at about 2:30 and
			// this code keeps it alive. Not sure why that is.
			socket.emit('tabata timer action', {data:"PULSE"});
		}
	});

	socket.on('tabata timer update broadcast', function(msg) {
		// Update Time Remaining field.
    	const el = document.getElementById("timer-banner");
    	const headingElement = document.createElement("h2");

    	headingElement.innerText = format_time(msg.data.timeRemaining);
    	el.replaceChildren(headingElement);
	});

	socket.on('tabata timer update broadcast', function(msg) {
		// Update activity field.
    	const el = document.getElementById("activity-banner");
    	const headingElement = document.createElement("h2");

    	headingElement.innerText = `${msg.data.activity}`;
    	el.replaceChildren(headingElement);
	});

	socket.on('tabata timer update broadcast', function(msg) {
		// Log broadcast to recieving field.
    	const el = document.getElementById("recieved");
    	const divElement = document.createElement("div");

    	divElement.innerText = JSON.stringify(msg.data);
    	el.appendChild(divElement);
    });

    socket.on('tabata timer update broadcast', function(msg) {
		// If timer runs out, exit fullscreen.
    	if (msg.data.timeRemaining === " - " && is_fullscreen()) {
    		close_fullscreen();
    	}
	});

    socket.on('tabata timer update broadcast', function(msg) {
		// If timer is running, mark variable as running.
		if (!clock_started && msg.data.timeRemaining !== " - ") {
			clock_started = true;
		}
	});

	socket.on('recorder action broadcast', function(msg) {
		// Log broadcast to recieving field.
    	const el = document.getElementById("recieved");
    	const divElement = document.createElement("div");

    	divElement.innerText = JSON.stringify(msg.data);
    	el.appendChild(divElement);
    });

	socket.on('recorder action broadcast', function(msg) {
		// Recorder may have recieved an unrecognized command.
		if (msg.message === "Unknown Request Received") {
			console.warn(`RECORDER - ${msg.message}`, msg.data);
		}
    });
});