// class modules
var SpinningText = require('./spinning-text');
var Constants = require('./constants');
var States = require('./states');
var Spinner = require('./spinner');
var SpinButton = require('./spin-button');
var Mediator = require("mediator-js").Mediator;
var Bar = require('loading-bar');

// globals
global.activity = {};
global.activity.mediator = new Mediator();
global.activity.mediator.subscribe('state', function(state) {
	global.activity.state = state;
});


$(document).ready(function() {
	var spinner = new Spinner([
		'ett',
		'två',
		'tre',
		'fyra'
	], $('#spinaroo'));

	var spinButton = new SpinButton(spinner, $("#stop"));

	global.activity.mediator.publish('state', States.IDLE);

	if($.cookie('activity') !== null) {
		var activities = $.cookie('activity').split(/\s*,\s*/);
		spinner.newTexts(activities);
		$("#updateText").val(activities.join(', '));
	}

	var bar = new Bar();
	//bar.append();
});

$("#updateSubmit").on('click', function() {
	$.cookie('activity', $('#updateText').val().toString());
	location.reload();
});
$("#cookieDebug").on('click', function() {
	$.cookie('activity', null);
	location.reload();
});