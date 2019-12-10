$(document).ready(function () {

	var scrollLink = $('.bt');

	// Smooth scrolling
	scrollLink.click(function (e) {
		e.preventDefault();
		$('body,html').animate({
			scrollTop: $(this.hash).offset().top - 0
		}, 1000);
	});


	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			$('#scrollup').fadeIn();
		} else {
			$('#scrollup').fadeOut();
		}
	});

	$('#scrollup').click(function () {
		$("html, body").animate({ scrollTop: 0 }, 400);
		return false;
	});

	$(".navbar-burger").click(function () {
		$(".navbar-burger").toggleClass("is-active"), $(".navbar-menu").toggleClass("is-active")
	})
});
