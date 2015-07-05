module.exports = (function() {
  var a1;
	var b1, b2, b3, b4;

	var raspi = require('raspi-io');
	var five = require('johnny-five');
	var board = new five.Board({
	  io: new raspi()
	});
	board.on('ready', initJ5);

	function initJ5() {
		console.log("J5 ready for commands");

	  var virtual = new five.Board.Virtual(
	    new five.Expander("PCF8591")
	  );

	  a1 = new five.Sensor({
	    pin: "A0",
	    board: virtual
	  });
		
		b1 = new five.Button({
	    pin: 26
	  });
	}

	function bindControls() {
  	a1.on("change", function() {
	    console.log(this.value);
	  });

	  b1.on("down", function() {
	    console.log("b1 down");
	  });
  }

  return {
  	bindControls: bindControls
  };

})();







