"use strict";

var j5controls = function() {
	var raspi = require('raspi-io');
	var five = require('johnny-five');
	var board;

	var buttons = new Array();
	var pins = ["P1-38", "P1-36", "P1-26", "P1-24", "P1-22", "P1-18"];

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

				pins.map(function(pin) {
					buttons.push(new five.Button(pin));	
				});

				resolve(buttons);
			});
		});
	}

	function bindControls(methods) {
		console.log("Binding controls");
		return Promise.resolve()
			.then(function() {
				var btnNumber = 0;
				console.log("J5CONTROLS: METHODS: ", methods);
				for(var method in methods) {
					console.log("J5CONTROLS: ASSIGNING METHOD: ", method);
					console.log("Assigning button nr", btnNumber);
					buttons[btnNumber].on("down", methods[method]);
					btnNumber++;
				}
				console.log("J5: controls are bound.");
			});
  }

  return {
		init: init,
		bindControls: bindControls
  };

};


module.exports = new j5controls();







