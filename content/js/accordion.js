jQuery(document).ready(function () {

    var childernDivId = "accordion-1";

    var mainDivIds = $("div[id^='accordion-section-']");

    function initializeValues() {
        $(mainDivIds).each(function (index, value) {
            //alert(value.id);

            if (index > 0) {
                // alert(index);
                $('#' + value.id).children().off('click');
            }
        });
    }

	function close_accordion_section() {
		jQuery('.accordion .accordion-section-title').removeClass('active');
		jQuery('.accordion .accordion-section-content').slideUp(300).removeClass('open');
	}

	jQuery('.accordion-section-title').click(function (e) {
		// Grab current anchor value
	    var currentAttrValue = jQuery(this).attr('href');

		if(jQuery(e.target).is('.active')) {
			close_accordion_section();
		}else {
			close_accordion_section();
            
			// Add active class to section title
			jQuery(this).addClass('active');
		    // Open up the hidden content panel
			jQuery('.accordion ' + currentAttrValue).slideDown(300).addClass('open'); 
		}

		e.preventDefault();
	});

	$('.accordion-button-next').click(function (e) {
	    var currentAttrValue = jQuery(this).attr('id');
	    var clickedNum = currentAttrValue.split("-");
	    var section = childernDivId.split("-");

	    var nextElement = section[0] + '-' + (parseInt(clickedNum[1]) + 1);

	    close_accordion_section();

	    // Add active class to section title
	    $('a[href$=#' + nextElement + ']').addClass('active');
	    
	    // Open up the hidden content panel
	    jQuery('.accordion #' + nextElement).slideDown(300).addClass('open');

	    e.preventDefault();
	});

	$('.accordion-button-prev').click(function (e) {
	    var currentAttrValue = jQuery(this).attr('id');
	    var clickedNum = currentAttrValue.split("-");
	    var section = childernDivId.split("-");

	    var prevElement = section[0] + '-' + (parseInt(clickedNum[1]) - 1);

	    close_accordion_section();

	    // Add active class to section title
	    $('a[href$=#' + prevElement + ']').addClass('active');

	    // Open up the hidden content panel
	    jQuery('.accordion #' + prevElement).slideDown(300).addClass('open');

	    e.preventDefault();
	});

	initializeValues();
});