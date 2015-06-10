
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
	<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
	<title>Activity</title>
	<style type="text/css">
		body, html {
			height: 100%;
			margin: 0;
			padding: 0;
      font-family: ‘Lucida Console E Monaco, monospace;
		}
		body {
			/*background: #F6FFEB;*/
      background: #111;
			text-align: center;
		}
		#wrap {
			min-height: 100%;
		}
		#main {
			overflow: auto;
			padding-bottom: 100px;
		}
		#textspin {
			width: 1000px;
			height: 100px;
			color: #FFCC00;
			margin: 100px auto;
			text-shadow: 0px 0px 70px #FFCC00;
			font-size: 36px;
			font-weight: bold;
			cursor: default;
			-webkit-touch-callout: none;
			-webkit-user-select: none;
			-khtml-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			user-select: none;
		}
		#textspin .left {
			width: 300px;
			float: left;
			text-align: center;
		}
		#textspin .middle {
			width: 400px;
			float: left;
			text-align: center;
			font-size: 48px;
			color: #FF7C00;
			text-shadow: 0px 0px 70px #FF7C00;
		}
		#textspin .right {
			width: 300px;
			float: left;
			text-align: center;
		}
		#stop {
			display: inline-block;
			height: 60px;
			margin: 0 auto;
			padding: 30px;
			text-align: center;
			color: #111;
      background: #FF3C00;
			border: 15px #FF3C00 solid;
			-moz-border-radius: 15px;
			-webkit-border-radius: 15px;
			border-radius: 15px;
			font-size: 48px;
			font-weight: bold;
			cursor: default;
			-webkit-touch-callout: none;
			-webkit-user-select: none;
			-khtml-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			user-select: none;
		}
		#update {
			display: table;
			position: relative;
			margin-top: -100px;
			height: 90px;
			width: 100%;
			clear: both;
			background: #000;
			border-top: 10px #000 solid;
			color: #333;
		}
		#leftBox, #rightBox {
			display: table-cell;
		}
		#rightBox {
			width: 440px;
		}
		#updateText {
			width: 100%;
			height: 70px;
			float: left;
			padding: 10px;
			margin: 0px;
			font-size: 32px;
			border: none;
		}
		#updateSubmit, #cookieDebug {
			height: 100%;
			float: right;
			width: 200px;
			margin: 0px;
			line-height: 20px;
			display: table;
			background: #ddd;
			font-weight: bold;
		}
		#updateSubmit {
			border-left: 10px #111 solid;
		}
		#cookieDebug {
			border-left: 10px #111 solid;
		}
		#updateSubmit p, #cookieDebug p {
			display: table-cell;
			vertical-align: middle;
			margin: 0;
			padding: 0;
			font-size: 32px;
			cursor: default;
			-webkit-touch-callout: none;
			-webkit-user-select: none;
			-khtml-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			user-select: none;
		}
	</style>
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	<script type="text/javascript" src="jquery.cookie.js"></script>

</head>
<body>
	<div id="wrap">
		<div id="main">
			<div id="textspin">
				<div class="left"></div>
				<div class="middle"></div>
				<div class="right"></div>
			</div>
			<div id="stop"></div>
		</div>
	</div>
	<div id="update">
		<div id="leftBox">
			<input id="updateText" type="text" />
		</div>
		<div id="rightBox">
			<div id="cookieDebug"><p>reset</p></div>
			<div id="updateSubmit"><p>update</p></div>
		</div>
	</div>
	<script type="text/javascript">
		/**
		 * spinnerStates
		 * 0: not moving
		 * 1: spinning up
		 * 2: spinning at constant speed
		 * 3: spinning down
		 **/
		var spinnerState = 0;
		var activities = ["bleaches", "alchemy", "lone survivor", "hunger games", "the graveyard book"];

		function printActivities(i) {
			$("#textspin > .left").html(activities[(i - 1) % activities.length]);
			$("#textspin > .middle").html(activities[i % activities.length]);
			$("#textspin > .right").html(activities[(i + 1) % activities.length]);
		}

		function startSpinning() {
			if(spinnerState == 0) {
				spinnerState = 1;
				spinner();
				$("#textspin > .middle").css('color', "#FF7C00");
				$("#textspin > .middle").css('text-shadow', '0px 0px 70px #FF7C00');
				$("#stop").html("stop");
			}
		}

		function stopSpinning() {
			if(spinnerState == 1 || spinnerState == 2) {
				spinnerState = 3;
				$("#stop").html("stopping...");
			}
		}

		function constantSpinning() {
			spinnerState = 2;
		}

		function doneSpinning() {
			spinnerState = 0;
			$("#textspin > .middle").css('color', "#FF2200");
			$("#textspin > .middle").css('text-shadow', '0px 0px 70px #FF2200');
			$("#stop").html("stopped!");
		}

		function spinner() {
			
			var i = 1;
			var time = spinnerState == 1 ? 500 : 10;

			function doText(i) {
				printActivities(i);

				i++;

				if(spinnerState == 1) {
					time /= 1.1;

					if(time < 10) {
						constantSpinning();
					}
				}
				if(spinnerState == 3) {
					time *= 1.07;

					if(time > 1000) {
						doneSpinning();
					}
				}

				if(spinnerState != 0) {
					setTimeout(doText, time, i);
				}
			}

			doText(i);
		}

		$(document).ready(function() {
			if($.cookie('activity') != null) {
				activities = $.cookie('activity').split(/\s*,\s*/);
			}

			$("#updateText").val(activities.toString());
			$("#stop").html("start");
			printActivities(1);
			
		});

		$("#stop").mousedown(function() {
			if(spinnerState == 0 || spinnerState == 3) {
				startSpinning();
			} else if(spinnerState == 1 || spinnerState == 2) {
				stopSpinning();
			}

		});
		$("#updateSubmit").mousedown(function() {
			$.cookie('activity', $('#updateText').val().toString());
			location.reload();
		})
		$("#cookieDebug").mousedown(function() {
			$.cookie('activity', null);
			location.reload();
		})
	</script>
</body>
</html>
