// CONSTANTS
// sleep time, podcast playlist name, spotify playlist name

var mode = "podcast";
var sleeper;

var rprMopidy = require("./rprMopidy");


var GPIO    = require('onoff').Gpio;
//var led     = new GPIO(18, 'out');
var button1  = new GPIO(2, 'in', 'rising');
var button2  = new GPIO(3, 'in', 'rising');
var button3  = new GPIO(4, 'in', 'rising');


// CALLBACKS =======================================================================================
function bindButtons() {
  button1.watch(volumeUp);
  button2.watch(volumeDown);
  button3.watch(switchMode);
}