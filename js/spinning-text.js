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
