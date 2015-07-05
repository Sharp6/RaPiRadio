// CONSTANTS
// sleep time, podcast playlist name, spotify playlist name

// GLOBAL STATE
var mode = "podcast";
var sleeper;

var rprMopidy = require("./rprMopidy");
var j5controls = require("./j5controls");

function parameteredSwitchMode() {
	rprMopidy.switchMode(mode).then(function(newMode) {
		mode = newMode;
		console.log("The new mode is: " + newMode);
	});
}

function enableSleepMode() {
  if(sleeper) {
    clearTimeout(sleeper);
  } 
  sleeper = setTimeout(goToSleep, 5000);
  console.log("Sleepmode activated");
};

function goToSleep() {
  console.log("Nighty night!");
};

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