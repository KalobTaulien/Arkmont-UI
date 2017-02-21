$(document).ready(function () {


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
    const player = videojs('video_0', { // eslint-disable-line no-undef
      controls: false,
      preload: 'auto',
      poster: data.image,
      playbackRates: [0.5, 1, 1.25, 1.5, 2],
      autoplay: false,
      plugins: {
        videoJsResolutionSwitcher: {
          default: 720,
          dynamicLabel: false,
        },
        overlay: {
          option1: 'value1',
          option2: 'value2',
        },
      },
    }, function() { // eslint-disable-line
      // If need the videojs playerr id we can use this method:
      // var id = player.id();
      // Update the video sources.
      player.updateSrc(data.videos.sources); // eslint-disable-line no-undef

      const overlayHtml = '<a href="/course-landing-page.html" class="overlay__title">Course name here</a>' +
                          '<a href="/course-syllabus.html" class="overlay__lesson">The sample name of the current lesson here</a>' +
                          '<div class="overlay__buttons">' +
                            '<a href="/PLACEHOLDER"><i class="fa fa-bars"></i></a>' +
                            '<a href="/PLACEHOLDER"><i class="fa fa-clipboard"></i></a>' +
                            '<a href="/PLACEHOLDER"><i class="fa fa-star-half-o"></i></a>' +
                            '<a href="/PLACEHOLDER"><i class="fa fa-cloud-download"></i></a>' +
                            '<a href="/PLACEHOLDER"><i class="fa fa-chevron-right"></i></a>' +
                          '</div>';
      player.overlay({
        content: '',
        debug: false,
        overlays: [{
          content: overlayHtml,
          start: 'ready',
          end: 'play',
          align: 'cover',
          attachToControlBar: true,
        }, {
          content: overlayHtml,
          start: 'pause',
          end: 'play',
          align: 'cover',
          attachToControlBar: true,
        }, {
          content: overlayHtml,
          start: 'end',
          end: 'play',
          align: 'cover',
          attachToControlBar: true,
        }],
      });

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

    player.on('loadedmetadata', function (e) {
      const videoDuration = Math.floor(player.duration());
      const $currentTime = $('.video__currenttime');
      const $progress = $('.video__progress');
      const $slider = $('.video__slider');
      const $playBtn = $('.video__play');
      let volumeIsDragging = false;

      const displaySecondsAsTime = function (timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds - (minutes * 60));
        const x = minutes < 10 ? minutes : minutes;
        const y = seconds < 10 ? '0' + seconds : seconds;

        return x + ':' + y;
      };

      const togglePlayButton = function (setting) {
        if (setting === 'play') {
          $playBtn.html('<i class="fa fa-play"></i>Play');
        } else if (setting === 'pause') {
          $playBtn.html('<i class="fa fa-pause"></i>Pause');
        }
      };

      const updateVideoVolume = function (y) {
        const volume = $('.videomenu__up li');
        // Get the position, height and percentage
        const position = y - volume.offset().top;
        const height = (100 * position) / volume.height();
        let percentage = Math.ceil(height / -1) + 100;

        if (percentage > 96) {
          percentage = 100;
        } else if (percentage < 4) {
          percentage = 0;
        }

        // update volume bar and video volume
        $('.volume__bar').css('top', height + '%');

        // Set the player volume
        player.volume(percentage / 100);
      };

      // Set the video duration
      $slider.attr('data-duration', displaySecondsAsTime(videoDuration));

      player
      // Update the time sider when every 15-250ms.
      .on('timeupdate', function () {
        const currentTime = player.currentTime();
        $currentTime.text(displaySecondsAsTime(currentTime));
        const percent = (currentTime / videoDuration) * 100;
        $progress.css('width', (percent <= 100 ? percent : 100) + '%');
      })
      // When the video is being played, show the pause button.
      .on('play', function () {
        togglePlayButton('pause');
      })
      // When the video is being paused, show the play button.
      .on('pause', function () {
        togglePlayButton('play');
      });

      $(document)
      // Click event: when the video is being played.
      .on('click', '.video__play', function (e) {
        if (player.paused()) {
          player.play();
          togglePlayButton('pause');
        } else {
          player.pause();
          togglePlayButton('play');
        }
      })
      // Click event: the slider is being clicked; we need to figure out (in seconds) where that click happened.
      .on('click', '.video__slider', function (e) {
        // Get the width of the video slider. Check every time in case the vw changes.
        const width = $(this).outerWidth(true);

        // The location of the cursor from the left of the screen (x axis)
        const x = e.pageX; // - parentOffset.left;

        // This is the percent of the progress slider to seek to as a decimal
        const pagePercent = x / width;

        // Get the video seconds by multiplying the pagePercent (decimal) and videoDuration
        const seconds = pagePercent * videoDuration;

        // Change the width of the progress slider
        $progress.css('width', (pagePercent * 100) + '%');

        // Move the player to this location. (seek)
        player.currentTime(seconds).play();

        // Force the play/pause button to change to the "pause" button
        togglePlayButton('pause');

        return e.preventDefault();
      })
      // Click event: The volume menu is being toggled
      .on('click', '.js-open-volume:not(.videomenu__up)', function (e) {
        $('.videomenu__up').toggleClass('videomenu__up--closed');
        // Show the current volume when the volume slider becomes visible.
        const percent = player.volume() * 100;
        const inverse = (100 - percent) + 0;
        $('.volume__bar').css('top', inverse + '%');
        return e.preventDefault();
      })
      .on('mousedown', '.videomenu__up li', function (e) { 
        volumeIsDragging = true;
        updateVideoVolume(e.pageY);
        return e.preventDefault();
      })
      .on('mouseup', '.videomenu__up li', function (e) {
        if (volumeIsDragging) {
          updateVideoVolume(e.pageY);
        }
        volumeIsDragging = false;
        return e.preventDefault();
      })
      .on('mousemove', '.videomenu__up li', function (e) {
        if (volumeIsDragging) {
          updateVideoVolume(e.pageY);
        }
        return e.preventDefault();
      }); // End video event listeners
    }); // End player.on('loadedmetadata'....

  } else {
    // Remove the course video area.
    $('.preview__video').remove();
  }
},
function ajaxFailed(failed) { // eslint-disable-line
  // Ajax failed
  // Silently do nothing (because the course image was loaded with the page)
});




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
  // When a "review star" is being clicked, toggle the ".star--selected" class.
  .on('click', '.review__selectstars .star', function (e) {
    $('.star--selected').not(this).removeClass('star--selected');
    $(this).addClass('star--selected');

    // Set the hidden input field.
    // This keeps the review data local to the form and out of JavaScript for as long as possible.
    $(this).closest('form').find('[name="rating"]').val($(this).data('rating'));
    return e.preventDefault();
  })
  // A review is being submitted.
  .on('submit', '.review__form', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    // Gather all values.
    const review = {};
    // The error object.
    const err = $('.review__error', this);
    // The form button
    const btn = $('button', this);

    $('.ajax-gather', this).each(function() {
      review[this.name] = $.trim($(this).val());
    });

    // Check if any of the `review` values are empty. If they are, show an error in the DOM.
    for (let field in review) {
      if (review[field] === '' || review[field] === undefined) {
        err.html('Please enter a ' + field).addClass('review__error--visible');
        return false;
      }
    }

    // Check if the review is at least a certain length.
    if (review.review.split(' ').length < 5) {
      err.html('Reviews must be at least 5 words long').addClass('review__error--visible');
      return false;
    }

    // If this event managed to get this far, we can assume the data is being sent to the server for further validation.
    // Hide the error now.
    err.removeClass('review__error--visible');

    ajax('reviews/submit.html', review,
        function beforeAjax() {
          console.log('Before ajax');
          btn.button();
        },
        function ajaxSuccess(data) {
          console.log('Returned data:');
          console.log(data);
          btn.button('saved');
        },
        function ajaxFailed(error) {
          console.log(error);
          btn.button('reset');
        },
        function ajaxAlways() {
          console.log('Perform cleanup');
        });

    return false;
  });
});
