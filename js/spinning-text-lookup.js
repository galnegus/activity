var interpolateColor = require('jsantell-interpolate-color');
var Constants = require('./constants');
var Helpers = require('./spinning-text-helpers');

module.exports = (function () {
    function SpinningTextLookup(granularity, textShadowCss) {
        this._granularity = granularity || 100;
        this._ratio = (Constants.MAX_POSITION - Constants.MIN_POSITION) / this._granularity;

        var i, pos;

        this._normalizedPosition = [];
        this._color = [];
        this._fontSize = [];
        this._textShadow = [];
        this._right = [];
        for (i = 0; i < this._granularity; i++) {
            pos = i * this._ratio;
    		this._normalizedPosition.push(Helpers.normalizedPosition(i * this._ratio));
            this._color.push(interpolateColor(Constants.FROM_COLOR, Constants.TO_COLOR, this._normalizedPosition[i]));
            this._fontSize.push(Helpers.fontSize(this._normalizedPosition[i]));
            this._textShadow.push(Helpers.textShadow(textShadowCss, this._color[i]));
            this._right.push(Helpers.right(pos));
    	}
    }

    SpinningTextLookup.prototype.normalizedPosition = function(position) {
        return this._normalizedPosition[Math.floor(position / this._ratio)];
    };

    SpinningTextLookup.prototype.color = function(position) {
        return this._color[Math.floor(position / this._ratio)];
    };

    SpinningTextLookup.prototype.fontSize = function(position) {
        return this._fontSize[Math.floor(position / this._ratio)];
    };

    SpinningTextLookup.prototype.textShadow = function(position) {
        return this._textShadow[Math.floor(position / this._ratio)];
    };

    SpinningTextLookup.prototype.right = function(position) {
        return this._right[Math.floor(position / this._ratio)];
    };

    return SpinningTextLookup;
})();
