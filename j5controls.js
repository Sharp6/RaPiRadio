module.exports = (function() {
  var a1;
	var b1, b2, b3, b4;

	var raspi = require('raspi-io');
	var five = require('johnny-five');
	var board;

	function init() {
		board = new five.Board({
		  io: new raspi()
		});
		var myP = new Promise(function(resolve,reject) {
			initJ5().then(function() {
				resolve();
			});
		});
		return myP;
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
	    console.log(this.value);
	  });

	  b1.on("down", function() {
	    console.log("b1 down");
	    methods.enableSleepMode();
	  });

	  console.log("J5: controls are bound.");
  }

  return {
  	init: init,
  	bindControls: bindControls
  };

})();







