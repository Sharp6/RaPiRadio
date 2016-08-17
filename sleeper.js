module.exports = (function() {
	var sleeper;

	function enableSleepMode() {
		if(sleeper) {
			clearTimeout(sleeper);
		}
		sleeper = setTimeout(goToSleep, 5000);
		console.log("Sleepmode activated");
	}

	function goToSleep() {
		console.log("Nighty night!");
	}

	return {
		enableSleepMode: enableSleepMode,
		goToSleep: goToSleep
	}
})();