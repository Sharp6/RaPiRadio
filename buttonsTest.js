"use strict";

var raspi = require('raspi-io');
var five = require('johnny-five');
var board = new five.Board({
	io: new raspi()
});

board.on('ready', function() {
	var buttons = ["P1-38", "P1-36", "P1-38", "P1-26", "P1-24", "P1-22", "P1-18"];

	buttons.map(function(pin) {
		var button = new five.Button(pin);
		button.on("down", function() {
			console.log(pin, "down");
		});
	});
});