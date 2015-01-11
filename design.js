$(document).ready(function(){


//-----Часы-----------------------------

	var clock = $('#clock');
	var times_span = $('#clock .time span');
	var hour_field = times_span.eq(0);
	var minute_field = times_span.eq(1);
	var seconds_field = times_span.eq(2);

	setInterval(function(){

		var date = new Date;
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();

		if(hours<10) hours = '0'+hours;
		if(minutes<10) minutes = '0'+minutes;
		if(seconds<10) seconds = '0'+seconds;

		hour_field.html(hours);
		minute_field.html(minutes);
		seconds_field.html(seconds);

	}, 1000)

//-----/Часы----------------------------


//-----Окно-----------------------------


	


	var window_ = $('#window_');
	
	var blinds = $('#blinds');

	var blinds_top = $('#blinds-top');
	var blinds_body_wrapper = $('#blinds-body-wrapper');
	var blinds_body = $('#blinds-body');

	var cord = $('#cord');

	var cord_position = cord.position();
	var blinds_body_position = blinds_body.position();

	blinds_body_wrapper.css('top', blinds_top.height()/3);

	
	cord.on('mousedown.blinds', function(e) {

		var blinds_body_init_position = blinds_body.position();
		var cord_init_position = cord.position();

		var pageY_init = e.pageY;
				

		$(document).on('mousemove.blinds', function(e){
			
			var pageY = e.pageY;

			var blinds_body_new_position = blinds_body_init_position.top+(pageY-pageY_init);

			var cord_new_position = cord_init_position.top+(pageY-pageY_init);


			if( cord_new_position+1<cord_position.top ) {

				return false;
			} else if (cord_new_position-1>0) {
				return false;
			}


			cord.css('top', cord_new_position+'px');
			blinds_body.css('top', blinds_body_new_position+'px');
			//console.log('pageY: '+ (pageY-pageY_init)+'; top: '+cord.css('top'))
		});

		$(document).on('mouseup.blinds', function(e){
			$(this).off('mousemove.blinds')
			.off('mouseup.blinds');
		});
	});

//-----------------------/Окно------------


//-----------------------Доска------------

	var board_construction_wrapper = $('#board_construction_wrapper');
	
	board_construction_wrapper.on('mouseenter.moveOut', function(e) {

		$(this).animate({'right': '40px'}, {'duration': 1000, easing: 'swing', 'complete': showDisplay});
		$(this).off('mouseenter.moveOut');

	});

//-----------------------/Доска-----------	


	function showDisplay() {

		var panel = $('#panel');
		var displayOn = $('.display_on');
		
		setTimeout(function(){

			panel.animate({'top': '0px'}, {duration: 500, easing: 'linear', 'complete': turnDisplay });
			$('#panel_2').animate({'top': '0px'},{duration: 500, easing: 'linear',});

		}, 200);
		
		function turnDisplay() {
			displayOn.animate({'opacity': '1'}, {duration: 2000, 'complete': function() {$('.tools').css({'z-index': 2})}, });
		}

	}	


	var colors_container = $('#colors_container');

	for(var i = 1; i<=20; i++) {
		var div = $('<div><div>').attr({'id': 'color'+i, 'class': 'colors'}).appendTo(colors_container);
	}

});

