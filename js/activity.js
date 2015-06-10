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