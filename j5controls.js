module.exports = (function() {
  var a1;
	var b1, b2, b3, b4;

	var a1buffer = 0;

	var raspi = require('raspi-io');
	var five = require('johnny-five');
	var board;

	function init() {
		board = new five.Board({
		  io: new raspi()
		});
		return initJ5();
	}

	function initJ5() {
		return new Promise(function(resolve,reject) {
			board.on('ready', function() {
				console.log("J5: ready for action.");

			  var virtual = new five.Board.Virtual(
			    new five.Expander("PCF8591")
			  );

			  a1 = new five.Sensor({
			    pin: "A0",
			    board: virtual
			  });
				
				b1 = new five.Button(26);
				b2 = new five.Button(27);
				b3 = new five.Button(28);
				b4 = new five.Button(29);	
				
				resolve();
			});	
		});
		
	}

	function bindControls(methods) {
  	a1.on("change", function() {
  		if(Math.abs(this.value - a1buffer) > 50) {
  			a1buffer = this.value;
  			var newVolume = this.value * 100 / 1024;
	  		if(newVolume > 99) {
	  			newVolume=100;
	  		}
	  		methods.setVolume(newVolume);
		    console.log("VolumeKnob changed " + this.value);
  		}
	  });

	  b1.on("down", function() {
	  	console.log("sleepButton down");
	    methods.enableSleepMode();
	  });

	  b2.on("down", function() {
	  	console.log("modeButton down");
	    methods.switchMode();
	  });
		
		b3.on("down", function() {
			console.log("stateButton down");
	    methods.switchState();
	  });

	  b4.on("down", function() {
	  	console.log("skipButton down");
	    methods.skipTrack();
	  });

	  console.log("J5: controls are bound.");
  }

  return {
  	init: init,
  	bindControls: bindControls
  };

})();







