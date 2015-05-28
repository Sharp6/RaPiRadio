// CONSTANTS
// sleep time, podcast playlist name, spotify playlist name

var mode = "podcast";
var sleeper;

var rprMopidy = require("./rprMopidy");


var GPIO    = require('onoff').Gpio;
var button1  = new GPIO(2, 'in', 'rising');
var button2  = new GPIO(3, 'in', 'rising');
var button3  = new GPIO(4, 'in', 'rising');


function closureSwitchMode() {
	rprMopidy.switchMode(mode).then(function(newMode) {
		mode = newMode;
		console.log("The new mode is: " + newMode);
	});
//	.catch(console.error.bind(console))
//  .done();
}

// CALLBACKS =======================================================================================
button1.watch(rprMopidy.volumeUp);
button2.watch(rprMopidy.volumeDown);
button3.watch(closureSwitchMode);
