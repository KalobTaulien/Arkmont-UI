// Get the video (if there is one).
// An image will be loaded first.
// The data.image that's returned from the Ajax request should match the image when the page loads.
ajax('get-video-sources', { id: 123456789 }, // eslint-disable-line no-undef
function ajaxStart(start) { // eslint-disable-line
    // Do something when starting
},
function ajaxSuccess(data) { // eslint-disable-line

  // Check if there are is a video. If there isn't, show the image
  if (data.videos.hasVideo) {
    // Set the video
    player = videojs('video_0', { // eslint-disable-line no-undef
      controls: true,
      preload: 'auto',
      // poster: data.preview.thumb_lg,
      playbackRates: [0.5, 1, 1.25, 1.5, 2],
      autoplay: false,
      plugins: {
        videoJsResolutionSwitcher: {
          default: 720,
          dynamicLabel: false,
        },
        samplePlugin: {
          option1: 'value1',
          option2: 'value2',
        },
      },
    }, function() { // eslint-disable-line
      // If need the videojs playerr id we can use this method:
      // var id = player.id();
      // Update the video sources.
      player.updateSrc(data.videos.sources); // eslint-disable-line no-undef

      // Remove the course image element.
      $('.preview__img').remove();
      // Show the video player.
      $('.preview__video').show();

      // Resize the player
      function resizeVideoJS() {
        if (player) { // eslint-disable-line no-undef
          const playerId = player.id(); // eslint-disable-line prefer-const
          const playerWidth = document.getElementById(playerId).parentElement.offsetWidth;
          player.width(playerWidth).height(playerWidth * 0.5625);
        }
      }
      // Initialize resizeVideoJS()
      resizeVideoJS();
      // Then on resize call resizeVideoJS()
      window.onresize = resizeVideoJS;
    });
  } else {
    // Remove the course video area.
    $('.preview__video').remove();
  }
},
function ajaxFailed(failed) { // eslint-disable-line
  // Ajax failed
  // Silently do nothing (because the course image was loaded with the page)
});

// If thereare ANY sections that require height mimicing, do it now.
if ($('[data-mimic-height]').length) {
  $('[data-mimic-height]').each(function setHeights() {
    const target = $(this).attr('data-mimic-height');
    $(this).css({
      'max-height': $(target).outerHeight(true),
    });
  });
}

// If there are any ratings we should apply the stars.
if ($('[data-review-rating]').length) {
  $('[data-review-rating]').each(function addRatingsToReviews() {
    $(this).html(formStarsFromRating($(this).data('review-rating')));
  });
}
