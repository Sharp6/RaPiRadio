// CONSTANTS
// sleep time, podcast playlist name, spotify playlist name

// GLOBAL STATE
var mode = "podcast";

var rprMopidy = require("./rprMopidy");
var j5controls = require("./j5controls");
var sleeper = require("./sleeper");

Promise.all([rprMopidy.init(), j5controls.init()])
	.then(function(results){
		console.log("APP: binding controls");
		return j5controls.bindControls({
			enableSleepMode: sleeper.enableSleepMode,
			switchMode: parameteredSwitchMode,
			switchState: rprMopidy.switchState,
			skipTrack: rprMopidy.skipTrack,
			volumeUp: rprMopidy.volumeUp,
			volumeDown: rprMopidy.volumeDown
		});
	})
	.catch(function(err) {
		console.log(err);
	});

function parameteredSwitchMode() {
	rprMopidy.switchMode(mode).then(function(newMode) {
		mode = newMode;
		console.log("The new mode is: " + newMode);
	});
}

/*
function initButtons() {
  var GPIO = require('onoff').Gpio;
	var volumeUpButton    = new GPIO(2, 'in', 'rising');
	var volumeDownButton  = new GPIO(3, 'in', 'rising');
	var switchModeButton  = new GPIO(4, 'in', 'rising');
	var playButton; 
	var skipButton;
	var sleepButton;
	//var powerButton; // pure harware switch

	volumeUpButton.watch(rprMopidy.volumeUp);
	volumeDownButton.watch(rprMopidy.volumeDown);
	switchModeButton.watch(parameteredSwitchMode);
	playButton.watch(rprMopidy.switchState);
	skipButton.watch(skipTrack);
	sleepButton.watch(enableSleepMode);
}
*/