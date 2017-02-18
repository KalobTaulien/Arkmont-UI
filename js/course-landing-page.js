// A container for all players.
window.players = [];

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
      poster: data.image,
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

      // Add this video to the list of players.
      // This is added in case the student previews a lesson -- this video will pause along with all others.
      window.players.video_0 = 'video_0';

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

// If there are no reviews shown on this page, remove the reviews box entirely.
if ($('.review').length !== 0) {
  $('.js-review-box').show();
}

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

// Events 
$(document)
// When the enroll button is clicked
.on('click', '.js-enroll', function (e) {
  const modal = new Modal({
    title: 'Sample Modal Title',
    message: 'Your message can be HTML',
    showClose: true,
    buttons: {
      // Closes the modal by default
      cancel: {
        // Add an extra class.
        className: '',
        // Give the button a label
        label: 'Cancel',
      },
      // A second button
      somethingElse: {
        // Has no extra class name
        className: '',
        // A sampel label
        label: 'Sample Label',
        //  An optional callback method.
        callback: function () {
          // Code to execute in the callback.
          alert('something else');
        },
      },
    },
  });
  return e.preventDefault();
})
// When a video lesson is going to be previewed.
.on('click', '.js-preview-lesson', function (e) {
  // Allow us to use $(this) in other jQ functions
  const t = $(this);
  // The lessonId from the DOM. Just used for opening multiple video players.
  const lessonId = t.data('lesson-id');
  // The parent element. Used for creating the video container.
  const parent = t.parent();
  // The new videoId of this preview video
  const videoId = 'video_lesson_' + lessonId;

  // If this player doesn't exist, request it.
  if ( window.players[videoId] === undefined ) {
    ajax('get-video-sources', { id: lessonId }, // eslint-disable-line no-undef
    function ajaxStart(start) { // eslint-disable-line
      // Pause all preview videos. If the new video is being freshly loaded, autoplay will take over.
      for (let i in window.players) {
        let video = window.players[i];

        videojs(video).ready(function () {
          this.pause();
        });
      }

      // Scroll down to this video now.
      $('html, body').animate({
        scrollTop: parent.offset().top - $('.nav:first').outerHeight(true),
      }, 250);
    },
    function ajaxSuccess(data) { // eslint-disable-line
      // Make this lesson block "active"
      parent.addClass('syllabus__lesson--active');
      // Check if there are is a video. If there isn't, show the image
      if (data.videos.hasVideo) {
        parent.append('<div class="preview__player"><div class="embed-responsive embed-responsive-16by9">' +
                  '<video class="embed-responsive-item video-player video-js vjs-default-skin" id="' + videoId + '" ' +
                      'poster="' + data.image + '">' +
                    '<p class="vjs-no-js">' +
                      'To view this video please enable JavaScript, and consider upgrading to a web browser that' +
                      '<a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>' +
                    '</p>' +
                  '</video>' +
                '</div></div>');

        // Set the video
        player = videojs(videoId, { // eslint-disable-line no-undef
          controls: true,
          preload: 'auto',
          poster: data.image,
          playbackRates: [0.5, 1, 1.25, 1.5, 2],
          autoplay: true,
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
          // Add this player to the global list of players.
          window.players[videoId] = videoId;

          // Update the video sources.
          player.updateSrc(data.videos.sources); // eslint-disable-line no-undef

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
      }
    },
    function ajaxFailed(failed) { // eslint-disable-line
      // Ajax failed
      // Silently do nothing (because the course image was loaded with the page)
    });
  }

  return e.preventDefault();
});
