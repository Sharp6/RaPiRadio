// CONSTANTS
// sleep time, podcast playlist name, spotify playlist name

// GLOBAL STATE
var mode = "podcast";

var rprMopidy = require("./rprMopidy");
//var j5controls = require("./j5controls");
var onoffControls = require('./onoffControls');
var sleeper = require("./sleeper");

Promise.all([rprMopidy.init(), onoffControls.init()])
	.then(function(results){
		console.log("APP: binding controls");
		return onoffControls.bindControls([
			sleeper.enableSleepMode,
			rprMopidy.switchState,
			/*
			switchMode: parameteredSwitchMode,
			skipTrack: rprMopidy.skipTrack,
			*/
			rprMopidy.volumeUp,
			rprMopidy.volumeDown
		]);
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