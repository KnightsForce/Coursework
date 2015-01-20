$(document).ready(function() {
alert(1)
var layer_id = 1;
var number_layer = 1;
var data_number_layer = 1;
var thic_line = $('#thic_line');

//-----Нулевой слой-----
	var golobalTarget;
	$(document).on('mouseup', function(e) {
		golobalTarget = e.target;
	})

	var canvas_div = $('#canvas_div');
	$('#layer_0').attr({'width': canvas_div.width(), 'height': canvas_div.height()});

//----/Нулевой слой-----

//-----Клик по инструментам-----

	$(document).on('mousedown.tools_action', function(e){
		var target = $(e.target);
		
		if(!target.hasClass('tools')) return false;

		target.css({'opacity': 0.5});
		target.on('mouseup.tools_action', function(e){
			target.css({'opacity': 1});
			target.off('mouseup.tools_action');
		});

	});

////----/Клик по инструментам-----

//-----------arrow_move--------------------------------------

	var arrow_move = $('#arrow_move');

	arrow_move.on('click.arrow_move', function(e) {

		offToolsHandlers();

		canvas_div.css({'cursor': 'move'});

		canvas_div.on('mousedown.tools.move_canvas', function(e){
			var layer = $('#layer_'+$('.select_layer').attr('data-number-layer'));
			
			if(!layer.length) return false;

			var origin_pos = layer.position();

			var pageX=e.pageX;
			var pageY=e.pageY;

			canvas_div.on('mousemove.tools.move_canvas', function(e){

				var newPageX = e.pageX;
				var newPageY = e.pageY;
				var diff_X = newPageX-pageX;
				var diff_Y = newPageY-pageY;
				layer.css({'top': origin_pos.top+diff_Y+'px', 'left': origin_pos.left+diff_X+'px'});

				var newPosition = layer.position();

				var newTop = newPosition.top;
				var newLeft = newPosition.left;
				var newBottom = newTop+layer.height();
				var newRight = newLeft+layer.width();

				var canvas_div_height = canvas_div.height();
				var canvas_div_width = canvas_div.width();


				if(newTop < 0) {
					layer.css('top', '0px');
				
				} else if(newBottom > canvas_div_height) {	
					layer.css('top', canvas_div_height-layer.height());
				
				}

				if(newLeft < 0) {
				layer.css('left', '0px');
				
				} else if(newRight > canvas_div_width) {
					layer.css('left', canvas_div_width-layer.width());
				
				}

			});

				$(document).on('mouseup.tools.move_canvas', function(){
					canvas_div.off('mousemove.tools.move_canvas')
					$(this).off('mouseup.tools.move_canvas')
				});
	
		});

	});

//-----------/arrow_move-------------------------------------
//-----------rect_newLayer-----------------------------------

	var rect_newLayer = $('#rect_newLayer');
	
	rect_newLayer.on('click.rect_newLayer', function(e){

		canvas_div.css({'cursor': 'crosshair'});

		offToolsHandlers();
		
		canvas_div.on('mousedown.tools.rect_newLayer', function(e){
			var target = $(e.target);
			
			if(!(target == canvas_div || target.closest(canvas_div))) return false;

			var canvas_div_offset = canvas_div.offset();

			var pageX=e.pageX-canvas_div_offset.left;
			var pageY=e.pageY-canvas_div_offset.top;

			$('.active_layer').removeClass('active_layer');

			newLayer(pageY-5, pageX-5);

			$(document).on('mousemove.tools.rect_newLayer', function(e){

				var nC_height = newCanvas.height();

				if(e.pageY <= canvas_div_offset.top) return false;
				else if(e.pageY >= canvas_div_offset.top+canvas_div.height()) return false;

				if(e.pageX <= canvas_div_offset.left) return false;
				else if(e.pageX >= canvas_div_offset.left+canvas_div.width()) return false;

				var newPageX=e.pageX-canvas_div_offset.left;
				var newPageY=e.pageY-canvas_div_offset.top;
				
				var diff_X = newPageX-pageX;
				var diff_Y = newPageY-pageY;
					

				if(diff_X>0) newCanvas.attr({'width': diff_X+5});
				else if(diff_X<0) {	
					newCanvas.attr({'width': Math.abs(diff_X)+''}).css({'left': newPageX+'px'})
				}

				if(diff_Y>0) newCanvas.attr({'height': diff_Y+5});
				else if(diff_Y<0) {
					newCanvas.attr({'height': Math.abs(diff_Y)+''}).css({'top': newPageY+'px'})

				}


			});//-----/mousemove-----

			$(document).on('mouseup.tools.rect_newLayer', function(){

					$(this).off('mousemove.tools.rect_newLayer')
					$(this).off('mouseup.tools.rect_newLayer')
				});


		}); //-----/mousedown-----
	}); //-----/click-----


//-----------/rect_newLayer----------------------------------


//-----------brush-------------------------------------------

	var brush = $('#brush');
	brush.on('click.brush', function() {

		canvas_div.css({'cursor': 'pointer'});

		offToolsHandlers();

		canvas_div.css('cursor', 'pointer')
		.on('mousedown.tools.brush', function(e){
				
			var targetLayer=$('#layer_'+$('.select_layer').attr('data-number-layer'));

			if(!targetLayer.length) return false;

			var targetLayer_offset = targetLayer.offset();

			var layer_pageY = e.pageY - targetLayer_offset.top;
			var layer_pageX = e.pageX - targetLayer_offset.left;

			
			
			//console.log(targetLayer);
			
			var ctx = targetLayer.get(0).getContext("2d");
						
			ctx.beginPath();
			ctx.lineCap='round';
			ctx.lineWidth=thic_line.attr('line-width');
			ctx.strokeStyle=$('#color').css('background-color');

			ctx.moveTo(layer_pageX, layer_pageY);
			ctx.lineTo(layer_pageX-1, layer_pageY-1);
			ctx.stroke();

			$(document).on('mousemove.tools.brush', function(e){
				var layer_newPageY = e.pageY - targetLayer_offset.top;
				var layer_newPageX = e.pageX - targetLayer_offset.left;

				ctx.moveTo(layer_pageX, layer_pageY);
				ctx.lineTo(layer_newPageX, layer_newPageY);
				ctx.stroke();

				layer_pageX=layer_newPageX;
				layer_pageY=layer_newPageY;

			})
			.on('mouseup.tools.brush', function(){
				$(this).off('mousemove.tools.brush').off('mouseup.tools.brush');
			})

		})
	})

//-----------/brush------------------------------------------

//------------color------------------------------------------
	var color = $('#color');
	var color_offset = color.offset();

	color.on('click.color', function(e){
		
		var colors_container = $('#colors_container');
		colors_container.css({'display': 'block', 'top': 250+'px', 'left': 120+'px'})
		.animate({'opacity': 1},700);

		$(document).on('mouseup.tools.color', function(e){
		
		var target = $(e.target);
		if(target.hasClass('colors')) color.css({'background-color': target.css('background-color')});
			colors_container.css({'display': 'none', 'opacity': 1});
			$(this).off('mouseup.tools.brush');
		})
	})

//-----------/color------------------------------------------

//------------eraser-----------------------------------------
	
	var eraser = $('#eraser');

	eraser.on('click.eraser', function(){
		
		canvas_div.css({'cursor': 'pointer'});

		offToolsHandlers();

		canvas_div.on('mousedown.tools.eraser', function(e) {
			var targetLayer=$('#layer_'+$('.select_layer').attr('data-number-layer'));

			if(!targetLayer.length) return false;

			var size = thic_line.attr('line-width');

			var targetLayer_offset=targetLayer.offset();
			var pageY = e.pageY-targetLayer_offset.top;
			var pageX = e.pageX-targetLayer_offset.left;

			var ctx = targetLayer.get(0).getContext("2d");
			ctx.clearRect(pageX, pageY, size, size);


			$(this).on('mousemove.tools.eraser2', function(e) {
				
				pageY = e.pageY-targetLayer_offset.top;
				pageX = e.pageX-targetLayer_offset.left;
				ctx.clearRect(pageX, pageY, size, size);
			
			
			});


			$(document).on('mouseup.tools.eraser', function(e) {
				$(this).off('mouseup.tools.eraser');
				canvas_div.off('mousemove.tools.eraser2');
			});
		});
	});

//-----------/eraser-----------------------------------------

//------------fill-------------------------------------------

	var fill = $('#fill');
	fill.on('click.fill',function(){
		
		canvas_div.css({'cursor': 'pointer'});

		offToolsHandlers();

		canvas_div.on('mousedown.tools.fill', function(e) {
			var targetLayer=$('#layer_'+$('.select_layer').attr('data-number-layer'));
			if(!targetLayer.length) return false;

			$(this).on('mouseup.tools.fill', function(){
				var ctx = targetLayer.get(0).getContext("2d");
				ctx.fillStyle=$('#color').css('background-color');
				ctx.fillRect(0,0,targetLayer.width(),targetLayer.height());
				
			})
		})
	});

//-----------/fill-------------------------------------------

//------------thic_line---------------------------------------
	
	var line_container = $('#line_container');

	thic_line.on('click.thic_line', function(){
		var offset = $(this).offset(); 
		line_container.css({'display': 'block', 'top': offset.top+20, 'left': offset.left+20});
		
		$(document).on('mousedown.tools.thic_line', function(e) {
			var target = $(e.target);
			
			if(target.get(0) == line_container.get(0) || target.get(0) == thic_line.get(0)) return false;
			if(target.hasClass('lines')) thic_line.attr({'line-width': target.height()});
			
			line_container.css({'display': 'none'});
			$(this).off('mousedown.tools.thic_line');
		})

	})

//-----------/thic_line--------------------------------------

//------------create_layer-----------------------------------

	$('#create_layer').on('click.create_layer', function() {


		$('.active_layer').removeClass('active_layer');
			newLayer(0, 0);
	})

//-----------/create_layer-----------------------------------


//------------delete-----------------------------------------

	$(document).on('keyup.delete', function(e) {
		var target = $(golobalTarget);
		
		if(e.keyCode == 46 || target.hasClass('list_layers')) {
				target.remove();
				$('#layer_'+target.attr('data-number-layer')).remove();
				golobalTarget = null;
				return false;
		}

	});

//------------save-------------------------------------------

 	$('#save').on('click.save', function(e) {
 		var layers = $('.layers');
 		var final_canvas = $('<canvas></canvas>')
 		.attr({'width': canvas_div.css('width'), 'height': canvas_div.css('height')})
 		.get(0);
 		var final_canvas_ctx = final_canvas.getContext('2d');

 		for(var i=0; i<layers.length; i++) {
 			var layer = layers.eq(i);
 			var layer_position = layer.position();
 			final_canvas_ctx.drawImage(layer.get(0), layer_position.left, layer_position.top);
 		}

 		var image = final_canvas.toDataURL();
 		window.open(image, 'Image');
 	})	

//-----------/save-------------------------------------------


//-----------Прочие функции----------------------------------

	function offToolsHandlers() {
		$(document).off('.tools');
		canvas_div.off('.tools');
	}


	function newLayer(top, left) {
		$('.active_layer').removeClass('active_layer');
			var newCanvas = $('<canvas></canvas>').appendTo(canvas_div)
							.attr({'id': 'layer_'+(layer_id++), 'width':''+canvas_div.width()+'px', 'height': ''+canvas_div.height()+'px',})
							.addClass('layers active_layer').css({'top': top, 'left': left, 'z-index': $('.layers').length});

			$('.select_layer').removeClass('select_layer');

			$('<li>Слой '+layer_id+'</li>').attr({'data-number-layer': layer_id}).addClass('list_layers select_layer').prependTo('#display_layers ul');	
	}
//-----------/Прочие функции---------------------------------

/*
//-----------drawind-----------------------------------------

	$(document).on('mousedown.drawing', function(e) {

		var canvas_div = $('#canvas_div');
		if(e.target != canvas_div[0]) return false;
		
		var pageX = e.pageX;
		var pageY = e.pageY;

		var newCanvas = $('<canvas></canvas>').appendTo('body')
		.attr({'width':''+15+'px', 'height': ''+15+'px'})
		.addClass('drawing layers')
		.css({'top': pageY-5, 'left': pageX-5,});

		var newCanvas_h = newCanvas.height();
		var newCanvas_p = $(newCanvas).offset();

		
		$(document).on('mousemove.drawing', function(e) {

			var canvas_div_w = canvas_div.width();
			var canvas_div_h = canvas_div.height();

			var newPageX = e.pageX;
			var newPageY = e.pageY;

			var canvas_div_p = canvas_div.offset();

			var canvas_div_t = +canvas_div_p.top;
			var canvas_div_b = +canvas_div_t+canvas_div_h;
			var canvas_div_l = +canvas_div_p.left;
			var canvas_div_r = +canvas_div_l+canvas_div_w;

			var factor = 15;

			var height = parseFloat(newCanvas.attr('height'));
			var width = parseFloat(newCanvas.attr('width'));
			
			if((newPageY-factor) < canvas_div_t) newCanvas.attr(parseFloat(newCanvas.attr('height')));
			if((newPageY+factor) > canvas_div_b) newCanvas.attr(parseFloat(newCanvas.attr('height')));
			if((newPageX-factor) < canvas_div_l) newCanvas.attr(parseFloat(newCanvas.attr('width')));
			if((newPageX+factor) > canvas_div_r) newCanvas.attr(parseFloat(newCanvas.attr('width')));




			var position = $(newCanvas).offset();
			var top = +position.top;
			var bottom = +top+height;
			var left = +position.left;
			var right = +left+width;
			
			
			
			if( (e.pageY-factor)<top ) {

				var inq_top =top-newPageY+factor;
				$(newCanvas).css({'top': '-='+inq_top,});
				$(newCanvas).attr('height', (height+inq_top));

			} else if((e.pageY+factor)>bottom) {

				var inq_height =newPageY-bottom+factor;
				$(newCanvas).attr('height', (height+inq_height));

			}

			if ((e.pageX-factor)<left) {
				var inq_left =left-newPageX+factor;
				$(newCanvas).css({'left': '-='+inq_left,});
				$(newCanvas).attr('width', (width+inq_left));
			
			} else if((e.pageX+factor)>right) {
				var inq_width = newPageX-right+factor;
				$(newCanvas).attr('width', (width+inq_width));
			}

		});

		$(document).on('mouseup', function(e) {
			$(document).off('mousemove.drawing');

		});

	});

//-----------/drawind----------------------------------------
*/


});