var Constants = require('./constants');
var smoothstep = require('interpolation').smoothstep;

module.exports = {
	normalizedPosition: function(position) {
        return smoothstep(0, 1, 1 - Math.abs(position - Constants.MAX_POSITION / 2) / (Constants.MAX_POSITION / 2));
    },

    fontSize: function(smoothsteppedPos) {
        return (16 + smoothsteppedPos * 32) + 'pt';
    },

    textShadow: function(textShadowCss, color) {
        return textShadowCss.replace(/rgba?\([^\)]+\)/, color);
    },

    right: function(position) {
        return position * Constants.STEP;
    }


};
