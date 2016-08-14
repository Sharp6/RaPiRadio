"use strict";

var j5controls = function() {
	var raspi = require('raspi-io');
	var five = require('johnny-five');
	var board;

	var buttons = new Array();

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
				
				buttons.push(new five.Button(26));
				buttons.push(new five.Button(27));
				buttons.push(new five.Button(28));
				buttons.push(new five.Button(29));
				buttons.push(new five.Button(31));
				buttons.push(new five.Button(32));
				
				resolve(buttons);
			});
		});
	}

	function bindControls(methods) {
		return Promise.resolve()
			.then(function() {
				var btnNumber = 0;
				for(var method in methods) {
					buttons[btnNumber].on("down", method);
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







