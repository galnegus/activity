var States = require('./states');
var Constants = require('./constants');

module.exports = (function() {
	function Spinner(spinningTextArray, $container) {
		this._spinningTexts = spinningTextArray;
		this._state = States.STOPPED;
		this._velocity = 0;

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

	Spinner.prototype.start = function() {
		var i = 0;
		var N = 120;
		var velocityStep = 1 / N;
		var time = 1000 / Constants.FPS;

		var loop = function(that, i) {
			if (that._velocity <= 1) {
 		 		that._velocity += velocityStep;
			}

			that._update();
			that._render();
			i++;
			setTimeout(loop, time, that, i);
		};

		loop(this, i);
	};

	return Spinner;
})();
