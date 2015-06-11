// class modules
var SpinningText = require('./spinning-text');
var Constants = require('./constants');
var States = require('./states');
var Spinner = require('./spinner');
var SpinButton = require('./spin-button');
var Mediator = require("mediator-js").Mediator;

// globals
global.activity = {};
global.activity.mediator = new Mediator();
global.activity.mediator.subscribe('state', function(state) {
	global.activity.state = state;
});

$(document).ready(function() {
	var spinner = new Spinner([
		new SpinningText('lorem', 50),
		new SpinningText('ipsum', 83),
		new SpinningText('hipp', 17)
	], $('#spinaroo'));

	var spinButton = new SpinButton(spinner, $("#stop"));

	global.activity.mediator.publish('state', States.IDLE);

	if($.cookie('activity') !== null) {
		//activities = $.cookie('activity').split(/\s*,\s*/);
	}
});

$("#updateSubmit").click(function() {
	$.cookie('activity', $('#updateText').val().toString());
	location.reload();
});
$("#cookieDebug").click(function() {
	$.cookie('activity', null);
	location.reload();
});