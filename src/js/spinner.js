var States = require('./states');
var SpinningText = require('./spinning-text');
var Constants = require('./constants');
var TWEEN = require('tween.js');

module.exports = (function() {
	function Spinner(texts, $container) {
		var instance = this; // booo

		this._$container = $container;

		// init the texts
		this.newTexts(texts);

		// loop/update values
		this._loopRunning = false;
		this._velocity = 0;
		this._accelerationStep = 1 / (Constants.ACCELERATION_TIME * Constants.FPS);
		this._decelerationStep = 1 / (Constants.DECELERATION_TIME * Constants.FPS);
		this._delay = 1000 / Constants.FPS;

		// register mediator subscription
		global.activity.mediator.subscribe('state', function(state) {
			switch (state) {
				case States.IDLE:
					instance._loopRunning = false;
					break;
				case States.SPIN:
					if (!instance._loopRunning) {
						instance._newWinner();
						instance._loopRunning = true;
						instance._time = typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now();
						instance._loop(instance);
					}
					break;
				case States.STOP:
					break;
			}
		});
	}

	Spinner.prototype.newTexts = function(texts) {
		var instance = this;

		this._$container.html('');
		this._spinningTexts = [];
		texts.forEach(function(text, i) {
			var spinningText = new SpinningText(text, (Constants.MIDDLE_POSITION + i * (Constants.MAX_POSITION / texts.length)) % Constants.MAX_POSITION);
			instance._spinningTexts.push(spinningText);
			spinningText.appendTo(instance._$container);
		});
	};

	Spinner.prototype._newWinner = function() {
		this._winner = this._spinningTexts[Math.floor(Math.random() * this._spinningTexts.length)];
	};

	Spinner.prototype._render = function() {
		this._spinningTexts.forEach(function(spinningText) {
			spinningText.render();
		}.bind(this));
	};

	Spinner.prototype._update = function(dt) {
		if (global.activity.state === States.SPIN && this._velocity <= 1) {
	 		this._velocity += this._accelerationStep;
		} else if (global.activity.state === States.STOP) {
			if (this._velocity > 0.05) {
				this._velocity -= this._decelerationStep;
			} 

			if (this._velocity < 0.4 && this._winner.winningPosition() && Math.random() < 0.99) {
				if (typeof this._tween === 'undefined') {
					var instance = this;

					// stopping animation
					this._tween = new TWEEN.Tween({x: instance._winner.getPosition()})
		            .to({x: [Constants.MIDDLE_POSITION + this._velocity * Constants.LOOPS_PER_SECOND * 20, instance._winner.getPosition()]}, Constants.LOOPS_PER_SECOND * 500)
		            .easing(TWEEN.Easing.Back.Out)
		            .onUpdate(function () {
		            	instance._winner._position = this.x;
		            })
		            .onComplete(function() {
		            	delete instance._tween;
		        		global.activity.mediator.publish('state', States.IDLE);
		            })
		            .start();

					this._velocity = 0;
				}
			}
		}

		if (typeof this._tween === 'undefined') {
			this._spinningTexts.forEach(function(spinningText) {
				spinningText.update(this._velocity, dt);
			}.bind(this));
		} else {
			TWEEN.update();
		}
		
	};

	Spinner.prototype._loop = function(instance) {
		// get delta time
		var time = typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now();
		dt = (time - instance._time);

		instance._update(dt);
		instance._render();

		// store time for next loop
		instance._time = typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now();
		
		// adjust delay based on execution time of loop
		var delay = instance._delay - (instance._time - time);
		delay = delay < 0 ? 0 : delay;

		// loop!
		if (global.activity.state !== States.IDLE) {
			setTimeout(instance._loop, delay, instance);
		}
	};

	return Spinner;
})();
