var States = require('./states');
var Constants = require('./constants');

module.exports = (function() {
	function Spinner(spinningTextArray, $container) {
		this._spinningTexts = spinningTextArray;
		this._loopRunning = false;
		this._velocity = 0;

		var seconds = 5;

		// loop/update values
		this._accelerationStep = 1 / (Constants.ACCELERATION_TIME * Constants.FPS);
		this._decelerationStep = 1 / (Constants.DECELERATION_TIME * Constants.FPS);
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
						instance._newWinner();
						instance._start = new Date().getTime();
						instance._loopRunning = true;
						instance._loop(instance);
					}
					break;
				case States.STOP:
					break;
			}
		});
	}

	Spinner.prototype._newWinner = function() {
		this._winner = this._spinningTexts[Math.floor(Math.random() * this._spinningTexts.length)];
	};

	Spinner.prototype._render = function() {
		this._spinningTexts.forEach(function(spinningText) {
			spinningText.render();
		}.bind(this));
	};

	Spinner.prototype._update = function() {
		if (global.activity.state === States.SPIN && this._velocity <= 1) {
	 		this._velocity += this._accelerationStep;
		} else if (global.activity.state === States.STOP) {
			if (this._velocity > 0.1) {
				this._velocity -= this._decelerationStep;
			} 

			if (this._velocity < 0.2 && this._winner.winningPosition() && Math.random() < 0.75) {
				this._velocity = 0;
				global.activity.mediator.publish('state', States.IDLE);
			}
		}

		this._spinningTexts.forEach(function(spinningText) {
			spinningText.update(this._velocity);
		}.bind(this));
	};

	Spinner.prototype._loop = function(instance) {
		instance._update();
		instance._render();

		if (global.activity.state !== States.IDLE) {
			setTimeout(instance._loop, instance._delay, instance);
		}
	};

	return Spinner;
})();
