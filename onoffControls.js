var onoffControls = function() {

	var Gpio = require('onoff').Gpio;
	//button = new Gpio(20, 'in', 'rising', {debounceTimeout: 300});
	var buttons = new Array();
	var pins = [20,16,7,8,25,24];

	function init() {
		return Promise.resolve()
			.then(function() {
				pins.map(function(pin) {
					buttons.push(new Gpio(pin, 'in', 'rising', {debounceTimeout: 300}));
				});
			});
	}

	function bindControls(methods) {
		console.log("Binding controls");
		return Promise.resolve()
			.then(function() {
				methods.forEach(function(method,idx) {
					buttons[idx].watch(function(err,value) {
						if(err) {
							console.log(err);
						}
						if(value === 1) {
							method();
						}
					});
				});
				console.log("onoff: controls are bound.");
			});
	}

	return {
		init: init,
		bindControls: bindControls
  };
};

module.exports = new onoffControls();