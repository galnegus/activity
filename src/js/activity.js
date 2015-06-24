// class modules
var States = require('./states');
var Spinner = require('./spinner');
var SpinButton = require('./spin-button');
var Mediator = require("mediator-js").Mediator;

// jquery
var $ = require('jquery');
require('jquery.cookie');

// templates
var template = require('../templates/activity.hbs');

// globals
global.activity = {};
global.activity.mediator = new Mediator();
global.activity.mediator.subscribe('state', function(state) {
	global.activity.state = state;
});

$(document).ready(function() {

	$('body').prepend(template({
		resetText: 'reset',
		updateText: 'updates'
	}));

	var spinner = new Spinner([
		'ett',
		'två',
		'tre',
		'fyra'
	], $('#spinaroo'));

	new SpinButton(spinner, $("#stop"));

	global.activity.mediator.publish('state', States.IDLE);

	if($.cookie('activity') !== null) {
		var activities = $.cookie('activity').split(/\s*,\s*/);
		spinner.newTexts(activities);
		$("#update-text").val(activities.join(', '));
	}
});

$('body').on('click', '#update-submit', function() {
	$.cookie('activity', $('#update-text').val().toString());
	location.reload();
});
$('body').on('click', '#cookie-debug', function() {
	$.cookie('activity', null);
	location.reload();
});