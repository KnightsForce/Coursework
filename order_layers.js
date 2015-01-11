$(document).ready(function() {


	
	var display_layers=$('#display_layers');
	
	display_layers.on('mousedown.select_layer', select_layer);



	
//-----Обработчики событий-----

	function select_layer(e) {
		var target = $(e.target);
		if(!target.hasClass('list_layers')) return false;

		var select_layer = target;
		var select_layer_clone = select_layer.clone(true);

		var list_layers=$('.list_layers');
		var pageY = e.pageY;
		var pageX = e.pageX;
		var newPageY;
		var newPageX;

		var shiftY = pageY-select_layer.offset().top;
		var shiftX = pageX-select_layer.offset().left;

		list_layers.removeClass('select_layer');
		select_layer.addClass('select_layer');
		$('.active_layer').removeClass('active_layer');

		select_layer_clone.css({'display': 'none',}).appendTo('body');
		
		$(document).on('mousemove.select_layer', function(e){
			
			newPageY = e.pageY;
			newPageX = e.pageX;

			select_layer_clone.css({'position': 'absolute', 'display': 'block', 'top': newPageY, 'left': newPageX});			

		}).on('mouseup.select_layer', function(e){

			if(!newPageY) newPageY = e.pageY;
			if(!newPageX) newPageX = e.pageX;

			select_layer_clone.css({'display': 'none'});
			var target_element = $(document.elementFromPoint(newPageX, newPageY));
			
			if(!target_element.hasClass('list_layers')) {
				select_layer_clone.remove();
				return false;
			};
			
			select_layer_clone.css({'display': 'block'});
			
			select_layer_clone.css({'position': 'static'})
			
			target_element.before(select_layer);
			select_layer_clone.remove();

			list_layers=$('.list_layers');


				for (var i = 0; i < list_layers.length; i++) {
					var number = list_layers.eq(i).attr('data-number-layer');
					var index = list_layers.length-i;
					$('#layer_'+number).css({'z-index': index});
				};


			$('#layer_'+select_layer.attr('data-number-layer')).addClass('active_layer');
			
			$(this).off('mousemove.select_layer mouseup.select_layer');
			
		})
	}
//----/Обработчики событий-----
			
});