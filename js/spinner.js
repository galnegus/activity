var States = require('./states');
var Constants = require('./constants');

module.exports = (function() {
	function Spinner(spinningTextArray, $container) {
		this._spinningTexts = spinningTextArray;
		this._state = States.STOPPED;
		this._velocity = 0;

		var N = 120;
		this._velocityStep = 1 / N;
		this._delay = 1000 / Constants.FPS;

		this._spinningTexts.forEach(function(spinningText) {
			$container.append(spinningText.$);
			spinningText.render();
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
		if (instance._velocity <= 1) {
	 		instance._velocity += instance._velocityStep;
		}

		instance._update();
		instance._render();

		setTimeout(instance._loop, instance._delay, instance);
	};

	Spinner.prototype.start = function() {
		this._state = Constants.SPINNING;

		this._loop(this);
	};

	Spinner.prototype.stop = function() {
		this._state = States.STOPPING;
	};

	Spinner.prototype.getState = function() {
		return this._state;
	};

	return Spinner;
})();
