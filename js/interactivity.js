$(document).ready(function() {
	current = ''; 
	height = ''; 
	margin_change = 0; 
	delay = 150; 
	num_projects = $('#projects article').siblings().length; 
	
	desktop = $('body').hasClass('desktop'); 
	is_ie = $('body').hasClass('ie'); 
	if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
		$('body').addClass('safari'); is_safari = true; 
	} else { 
		is_safari = false; 
	}
	if (desktop) { $('#projects article aside').slideUp(0); } 

	$('body').removeClass('no-js').addClass('js'); 
	$('#projects div.wrap').append('<div id="col1" class="col"></div><div id="col2" class="col"></div><div id="col3" class="col"></div>'); 	
	
	var scroll_top = function(t) {
		s = 500; 
		fade_speed = 500; 
	     $('html, body').animate({ scrollTop: ($(t).offset().top) }, s, function() { 
		     $('body').removeClass('click_scroll'); 
	     }); 
	     return false; 
	}
       
	// function to determine number of columns based on window width
	var set_num_cols = function() {
		w = $(window).width(); 
		if (w<=500) { cols = 1; } else if (w<=900) { cols = 2; } else { cols = 3; }
	}
	set_num_cols(); 

	// change active nav item and update url
	var change_active = function(t, d) {
		t = (t=='splash') ? 'home' : t; 
		$('nav a.active, .slide.active').removeClass('active'); 
		$('nav a').each(function() {
			if ($(this).attr('href')=='#'+t) {
				if (d=='down') { 
					$(this).addClass('active'); 
					$('#' + t).addClass('active'); 
				} else { 
					$(this).prev().addClass('active'); 
					tt = $('#' + t).prev().attr('id'); 
					if (tt==undefined) { tt = $('#' + t).prev().prev().attr('id'); }
					$('#' + tt).addClass('active'); 
					t=tt; 
				}
			}
		}); 
		//change url
		if (!is_ie) { 
			t = t || 'home'; 
			history.pushState({}, '', t); 
		}
	}
 	
	// function to add a project to a column
	var add_to_col = function(html, l, c, t) {
		c = c || curr_col; 
		t = t || 'end'; 
		l = (l=='show_lightbox') ? ' class="show_lightbox"' : ''; 
		html = '<article' + l + '>' + html + '</article'; 
		if (t=='start') { 
			$('#col' + c).prepend(html); 
		} else { 
			$('#col' + c).append(html); 
		}
	}
	
	//initial project sort into columns
	count = 1; 
	curr_col = 1; 
	$('#projects article').each(function() {
		add_to_col($(this).html(), $(this).attr('class'), curr_col, 'end'); 
		$(this).remove(); 
		if (curr_col==cols) { curr_col = 1; } else { curr_col++; }
	}); 
	
	// resort projects to cols if number of columns changes based on screen width
	var reorganize_cols = function() {
		curr_col = 1; 
		target_col = 1; 
		// check if the number of current columns is different than the number of columns calculated based on width
		curr_num_cols = cols; 
		set_num_cols(); 
		var projects_html = []; 
		if (curr_num_cols!=cols) {
			for (var i = 1; i <= num_projects; i++) {
				// cycle through projects, adding them to the end of the new column they belong to and then removing from the original position
				t = '#col' + curr_col + ' article'; 
				add_to_col($(t).first().html(), $(t).first().attr('class'), target_col, 'end');
				$(t).first().remove(); 
				if (target_col==cols) { target_col = 1; } else { target_col++; }
				if (curr_col==curr_num_cols) { curr_col = 1; } else { curr_col++; }
			}
		}
	}
	
	var reset_proportions = function() {
		// set section heights to at least 100%
		window_height = $(window).height(); 
		offset_scale = (window_height>600) ? 1 : 0.3; 
		$('.slide').css('min-height', window_height - 150); 
		window_width = $(window).width(); 
		// only do animations if window wider than 500px
		if (window_width<500) { 
			$('body').removeClass('fade'); 
			$('.quote').css('padding-bottom', 'auto'); 
		} else { 
			$('body').addClass('fade'); 
			$('.quote').css('padding-bottom', window_height/2); 
		}
		// prevents css3 animations from happening before all of the resizing happens
		$('body').addClass('ready'); 
		reorganize_cols(); 
	}
	reset_proportions(); 

	show_animations = (!is_ie&&desktop) ? true : false; 
	if (show_animations) { 
		$('body').addClass('fade'); 
		$('body').addClass('light'); 
	}
	
	// determines section of website to start with if included in url
	start_page = window.location.pathname.replace('/', ''); 
 	if (start_page!='') {
 		console.log(start_page);	
	     //$('html, body').animate({ scrollTop: ($('#' + start_page).offset().top) }, 0); 
 	}
 	change_active(start_page, 'down'); 
 			
	$(window).resize(function() {
		reset_proportions(); 
	}); 
	
	// on hover, focus on current project and fade out the rest
	var show_more = function(t) {
		console.log('1');
		t = t || '#projects div.wrap article.active'; 
		$('#projects article').each(function() {
			if (!$(this).hasClass('active')) { $(this).animate({opacity: 0.15}, 500, function() {}); } 
		}); 
		$(t + ' figure img').addClass('opaque'); 
		$(t).animate({opacity: 1}, 500); 
		$(t).find('aside').slideDown(500); 
	}

	// move/fade in contact icons 
	var contact_transition = function(d) {
		if (window_width>500 && desktop) { 
			if (d=='down') {
				$('#contact h1').delay(350).fadeIn(800); 
			} else { 
				$('#contact h1').delay(350).fadeOut(0); 
			}
			$('#contact ul li').each(function() {
				iconmargin = '150px'; 
				if (d=='down') {
					$(this).delay(750).animate({ 'margin-top' : 0, 'margin-bottom' : iconmargin, 'opacity' : 1}, 500); 
				} else { 
					$(this).animate({ 'margin-top' : iconmargin, 'margin-bottom' : 0, 'opacity' : 0}, 500); 
				}
			}); 
		}
	}
	if (start_page!='contact') { contact_transition('out'); } 
	
	var bg_color_class = function(theclass) {
		$('body').toggleClass('light').toggleClass('dark'); 		
	}
	
	// fades entire sections in/out, based on direction
	var fade_section = function(target, d) {
		if (show_animations) { 
			if (d=='down') { 
				$('#' + target).animate({'opacity':0}, 500);
			} else { 
				$('#' + target).animate({'opacity':100}, 500); 
			}
		}
	}

	// fades projects in/out one by one, based on direction
	jQuery.fn.reverse = [].reverse;
	var fade_projects = function(d, speed) {
		speed = speed || 500; 
		if (show_animations) { 
			i = 0; 
			if (d=='up') { 
				$('#projects article').each(function() {
					$(this).delay(125*i).fadeIn(speed); 
					i++; 
				}); 						
			} else { 
				proj_height = $('#projects').height(); 
				$('#projects').css('min-height', proj_height); 
				$('#projects article').reverse().each(function() {
					$(this).delay(125*i).fadeOut(speed); 
					i++; 
				}); 		
			}
		}
	}


	$(document)
	.on('click', 'nav#top a, .quote a', function(e) {
		e.preventDefault(); 
		$('body').addClass('click_scroll'); 
		t = $(this).attr('href'); 
		if (current!=t || $(this).closest('aside').hasClass('quote')) { 
			scroll_top(t); 
			current = t; 
		}
	})
	.on('mouseenter', '#projects article', function() {
		console.log('1');
		$(this).addClass('active'); 
		if (desktop) { show_more_timeout = setTimeout(show_more, delay); } 
	})	
	.on('mouseleave', '.desktop #projects article', function() {
		$(this).removeClass('active').find('aside').slideUp(350); 
		if (desktop) { clearInterval(show_more_timeout); } 
	}) 
	.on('mouseleave', '.desktop #projects .wrap', function() {
		$('#projects article').each(function() { 
			$(this).animate({opacity: 0.7}, 500); 
		})
	})
	.on('click touchstart', '.show_lightbox a, .desktop .show_lightbox figure', function(e) {
		e.preventDefault(); 
		show_lightbox('in', $(this).closest('.show_lightbox').find('img').attr('src').replace('high', 'original')); 
	})
	.on('click touchend', '#overlay-anchor.active, .close', function(e) {
		e.preventDefault(); 
		show_lightbox('out'); 
	}); 

	speed = 500; 
	if (show_animations) { 
		$('#projects article').fadeOut(speed); 
	}
    $.waypoints.settings.scrollThrottle = 500;
	$('.slide').waypoint(function(d) {
		change_active($(this).attr('id'), d); 
	}, { offset : 100 }); 
	$('.quote').waypoint(function(d) { 
		bg_color_class(); 
		if (show_animations) { 
			$('#about').toggleClass('hide'); 
			$('#projects article').fadeOut(speed); 
		} 
	}, { offset : 450*offset_scale }); 
	$('#projects').waypoint(function(d) {
		bg_color_class(); 
		fade_projects('up'); 
	}, { offset: 450*offset_scale }); 
	$('#contact').waypoint(function(d) {
		fade_projects(d); 
		contact_transition(d); 
		bg_color_class(); 
	}, { offset: 300*offset_scale }); 
	
});