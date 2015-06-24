var Constants = require('./constants');
var interpolateColor = require('jsantell-interpolate-color');
var Helpers = require('./spinning-text-helpers');
var SpinningTextLookup = require('./spinning-text-lookup');

var $ = require('jquery');

module.exports = (function () {
    function SpinningText(text, position) {
        this._text = text || 'null';
        this._position = position || 0;
        this._previousPosition = 0;

        this._$ = $('<span>' + this._text + '</span>');

        this._lookup = new SpinningTextLookup(1000, this._$.css('text-shadow'), this._$.width());
    }

    SpinningText.prototype.appendTo = function($container) {
        $container.append(this._$);
        this.render();
    };

    SpinningText.prototype.update = function(velocity, dt) {
        this._previousPosition = this._position;
        var velocityFactor = Constants.LOOPS_PER_SECOND * (Constants.MAX_POSITION - Constants.MIN_POSITION) * (dt / 1000);
        this._position = this._position + velocity * velocityFactor;
        if (this._position > Constants.MAX_POSITION) {
            this._position = Constants.MIN_POSITION + this._position - Constants.MAX_POSITION;
        }
    };

    SpinningText.prototype.renderOld = function() {
        var normalizedPosition = Helpers.normalizedPosition(this._position);
        var color = interpolateColor(Constants.FROM_COLOR, Constants.TO_COLOR, normalizedPosition);

        // size
        this._$.css('font-size', Helpers.fontSize(normalizedPosition));

        // color
        this._$.css('color', color);

        // shadow (color)
        this._$.css('text-shadow', Helpers.textShadow(this._$.css('text-shadow'), color));

        // opacity
        this._$.css('opacity', normalizedPosition);

        // position
        this._$.css('right', Helpers.right(this._position, this._$.width()));
    };

    SpinningText.prototype.render = function() {
        this._$.css({
            'font-size': this._lookup.fontSize(this._position),
            'color': this._lookup.color(this._position),
            'text-shadow': this._lookup.textShadow(this._position),
            'opacity': this._lookup.normalizedPosition(this._position),
            'z-index': this._lookup.normalizedPosition(this._position)
        });
        // width varies with font-size, why this is done seperately
        //this._$.css('right', this._lookup.right(this._position) - this._$.width() / 2);
        var translate = this._lookup.right(this._position) - this._$.width() / 2;
        this._$.css({transform: 'translateX(' + translate + 'px)'});
    };

    SpinningText.prototype.getPosition = function() {
        return this._position;
    };

    SpinningText.prototype.getText = function() {
        return this._text;
    };

    SpinningText.prototype.winningPosition = function() {
        if (this._previousPosition < Constants.MIDDLE_POSITION && this._position >= Constants.MIDDLE_POSITION) {
            return true;
        }
        return false;
    };

    return SpinningText;
})();
