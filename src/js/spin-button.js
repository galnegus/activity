var States = require('./states');

var $ = require('jquery');

module.exports = (function() {
	function SpinButton(spinner, $button) {
		this._spinner = spinner;
		this.$ = $button;
		this.$.html('start');

		var instance = this;
		$button.on('click', function() {
			switch (global.activity.state) {
				case States.IDLE:
					global.activity.mediator.publish('state', States.SPIN);
					break;
				case States.SPIN:
					global.activity.mediator.publish('state', States.STOP);
					break;
				case States.STOP:
					// do nothing
					break;
			}
		});

		global.activity.mediator.subscribe('state', function(state) {
			switch (state) {
				case States.IDLE:
					instance.$.html('start');
					break;
				case States.SPIN:
					instance.$.html('stop');
					break;
				case States.STOP:
					instance.$.html('stopping...');
					break;
			}
		});
	}

	return SpinButton;
})();
