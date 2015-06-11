var SpinningText = require('./spinning-text');
var Constants = require('./constants');
var Spinner = require('./spinner');
var SpinButton = require('./spin-button');

$(document).ready(function() {
	var spinner = new Spinner([
		new SpinningText('snusk', 0),
		new SpinningText('pervo', 33),
		new SpinningText('fyfan', 66)
	], $('#spinaroo'));

	var spinButton = new SpinButton(spinner, $("#stop"));

	if($.cookie('activity') !== null) {
		//activities = $.cookie('activity').split(/\s*,\s*/);
	}

	$("#stop").html("start");
});

$("#updateSubmit").click(function() {
	$.cookie('activity', $('#updateText').val().toString());
	location.reload();
});
$("#cookieDebug").click(function() {
	$.cookie('activity', null);
	location.reload();
});