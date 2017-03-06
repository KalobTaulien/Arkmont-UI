$(document).ready(function () {
  // Body selector.
  const body = $('body');
  // Course and lesson data, used mainly for ajax requests.
  const sender = {
    courseId: body.data('course-id'),
  };


  $(document)
  // When course "section" buttons are clicked.
  .on('click', '.course__otherpages', function (e) {
    // The 540 below MUST match the media query breakpoint in that works toghether with .course__otherpages
    if ($(window).outerWidth(true) <= 540) {
      $(this).toggleClass('course__otherpages--opened');
      return e.preventDefault();
    }

    return true;
  })

});
