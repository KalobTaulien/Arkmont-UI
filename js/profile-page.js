$(document).ready(function () {
  $(document)
  // Certificate is being clicked.
  .on('click', '.certificate__url[data-certificate-id]', function (e) {
    const imgSrc = $(this).find('img').attr('src');
    const modal = new Modal({
      title: 'Certificate Name',
      message: '<img src="' + imgSrc + '" style="width: 100%; height: auto"/>',
      buttons: {
        cancel: {
          label: 'Close',
        },
      },
    });

    return e.preventDefault();
  });

  // When the page is done gathering all its assets, we can display the images.
  $(window).on('load', function () {
    // Select the preloading container
    const $preloadContainer = $('.preload__images');
    // All images-loading classes need to fade out using CSS.
    $preloadContainer.addClass('preload__images--fadeout');
    // Wait for 450ms (the time of the CSS transition to fade out, plus 50ms buffer)
    // before removing these classes.
    setTimeout(function () {
      $preloadContainer.removeClass('preload__images preload__images--fadeout');
    }, 450);
  });
});
