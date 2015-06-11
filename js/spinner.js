var States = require('./states');
var Constants = require('./constants');

module.exports = (function() {
	function Spinner(spinningTextArray, $container) {
		this._spinningTexts = spinningTextArray;
		this._loopRunning = false;
		this._velocity = 0;
		this._winner = this._spinningTexts[Math.floor(Math.random() * this._spinningTexts.length)];

		var N = 120;
		this._velocityStep = 1 / N;
		this._delay = 1000 / Constants.FPS;

		// init spinningTexts
		this._spinningTexts.forEach(function(spinningText) {
			$container.append(spinningText.$);
			spinningText.render();
		});

		// register mediator subscription
		var instance = this;
		global.activity.mediator.subscribe('state', function(state) {
			switch (state) {
				case States.IDLE:
					instance._loopRunning = false;
					break;
				case States.SPIN:
					if (!instance._loopRunning) {
						instance._loopRunning = true;
						instance._loop(instance);
					}
					break;
				case States.STOP:
					break;
			}
		});
	}

	Spinner.prototype._render = function() {
		this._spinningTexts.forEach(function(spinningText) {
			spinningText.render();
		}.bind(this));
	};

	Spinner.prototype._update = function() {
		this._spinningTexts.forEach(function(spinningText) {
			spinningText.update(this._velocity);
		}.bind(this));
	};

	Spinner.prototype._loop = function(instance) {
		if (global.activity.state === States.SPIN && instance._velocity <= 1) {
	 		instance._velocity += instance._velocityStep;
		} else if (global.activity.state === States.STOP) {
			if (instance._velocity > 0.1) {
				instance._velocity -= instance._velocityStep;
			} else if (instance._winner.winningPosition() && (Math.floor(Math.random() * 2) == 0)) {
				instance._velocity = 0;
				global.activity.mediator.publish('state', States.IDLE);
			}
		}

		instance._update();
		instance._render();

		if (global.activity.state !== States.IDLE) {
			setTimeout(instance._loop, instance._delay, instance);
		}
	};

	return Spinner;
})();
