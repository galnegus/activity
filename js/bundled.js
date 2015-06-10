(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var SpinningText = require('./spinning-text');
var Constants = require('./constants');
var Spinner = require('./spinner');

var myObject = new SpinningText('awd');
myObject.update();

var spagalloo = new Spinner([
	new SpinningText('snusk', 0),
	new SpinningText('pervo', 33),
	new SpinningText('fyfan', 66)
], $('#spinaroo'));


$(document).ready(function() {
	if($.cookie('activity') !== null) {
		//activities = $.cookie('activity').split(/\s*,\s*/);
	}

	$("#stop").html("start");
});

$("#stop").click(function() {
	spagalloo.start();

});
$("#updateSubmit").click(function() {
	$.cookie('activity', $('#updateText').val().toString());
	location.reload();
});
$("#cookieDebug").click(function() {
	$.cookie('activity', null);
	location.reload();
});
},{"./constants":2,"./spinner":3,"./spinning-text":4}],2:[function(require,module,exports){
module.exports = {
	FPS: 60,

	// spinning-text position boundaries
    MIN_POSITION: 0,
    MAX_POSITION: 100,
    STEP: 10,

    // colors
    FROM_COLOR: 'hsl(48, 100%, 50%)',
    TO_COLOR: 'hsl(29, 100%, 50%)',
};

},{}],3:[function(require,module,exports){
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

},{"./constants":2,"./states":5}],4:[function(require,module,exports){
var Constants = require('./constants');
var smoothstep = require('interpolation').smoothstep;
var interpolateColor = require('jsantell-interpolate-color');

module.exports = (function () {
    function SpinningText(text, position) {
        this._text = text || 'null';
        this._position = position || 0;

        this.$ = $('<span>' + this._text + '</span>');
    }

    SpinningText.prototype.update = function(velocity) {
        this._position = this._position + velocity;
        if (this._position > Constants.MAX_POSITION) {
            this._position = Constants.MIN_POSITION + this._position - Constants.MAX_POSITION;
        }
    };

    SpinningText.prototype.render = function() {
        var normalizedToCenter = 1 - Math.abs(this._position - Constants.MAX_POSITION / 2) / (Constants.MAX_POSITION / 2);
        var smoothstepped = smoothstep(0, 1, normalizedToCenter);

        // size
        this.$.css('font-size', (16 + smoothstepped * 32) + 'pt');

        // color
        var color = interpolateColor(Constants.FROM_COLOR, Constants.TO_COLOR, smoothstepped);
        this.$.css('color', color);

        // shadow (color)
        var textShadow = this.$.css('text-shadow').replace(/rgba?\([^\)]+\)/, color);
        this.$.css('text-shadow', textShadow);

        // opacity
        this.$.css('opacity', smoothstepped);

        // position
        this.$.css('right', this._position * Constants.STEP - this.$.width() / 2);
    };

    SpinningText.prototype.getPosition = function() {
        return this._position;
    };

    SpinningText.prototype.getText = function() {
        return this._text;
    };

    return SpinningText;
})();

},{"./constants":2,"interpolation":6,"jsantell-interpolate-color":9}],5:[function(require,module,exports){
module.exports = {
    // spinner state
    STOPPED: 0,
    STARTING: 1,
    SPINNING: 2,
    STOPPING: 3
};

},{}],6:[function(require,module,exports){
/** Utility function for linear interpolation. */
module.exports.lerp = require('lerp')

/** Utility function for Hermite interpolation. */
module.exports.smoothstep = require('smoothstep')
},{"lerp":7,"smoothstep":8}],7:[function(require,module,exports){
function lerp(v0, v1, t) {
    return v0*(1-t)+v1*t
}
module.exports = lerp
},{}],8:[function(require,module,exports){
module.exports = function smoothstep (min, max, value) {
  var x = Math.max(0, Math.min(1, (value-min)/(max-min)));
  return x*x*(3 - 2*x);
};

},{}],9:[function(require,module,exports){
/**
 * A simple color interpolator.
 * Parses a `from` and `to` HSL string in the format
 * `hsl(200, 100%, 50%)` and a step value between 0 and 1
 * and returns a new HSL string.
 * An optional `precision` value may be provided for the
 * new HSL string
 *
 * @param {string} from
 * @param {string} to
 * @param {number} step
 * @param {precision} number
 */

var regex = /^hsl\(\s*([\-|\d|\.]*)\s*,\s*([\d|\.]*)%\s*,\s*([\d|\.]*)%/;
function interpolate (start, end, step, precision) {
  precision = precision != null ? precision : 0;
  start = start.match(regex);
  end = end.match(regex);
  var
    startH = +start[1],
    startS = +start[2],
    startL = +start[3],
    endH   = +end[1],
    endS   = +end[2],
    endL   = +end[3];

  var
    h = (startH - (startH - endH) * step).toFixed(precision),
    s = (startS - (startS - endS) * step).toFixed(precision),
    l = (startL - (startL - endL) * step).toFixed(precision);

  return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
}

module.exports = interpolate;

},{}]},{},[1]);
