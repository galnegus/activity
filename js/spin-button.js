var States = require('./states');

module.exports = (function() {
	function SpinButton(spinner, $button) {
		this._spinner = spinner;

		var instance = this;
		$button.on('click', function() {
			switch (instance._spinner.getState()) {
				case States.STOPPED:
					spinner.start();
					break;
				case States.SPINNING:
					spinner.stop();
					break;
				case States.STOPPING:
					//
					break;
			}

			
		});
	}

	return SpinButton;
})();
