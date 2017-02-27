$(document).ready(function () {
  // Body selector.
  const body = $('body');
  // Course and lesson data, used mainly for ajax requests.
  const sender = {
    courseId: body.data('course-id'),
    lessonId: body.data('lesson-id'),
  };

  let player;
  const lessonType = body.data('lesson-type');
  const $currentTime = $('.video__currenttime');
  const $progress = $('.video__progress');
  const questionTimes = [];
  const $slider = $('.video__slider');
  let volumeIsDragging = false;
  const playBtn = $('.js-play-video');
  // An object to hold player settings (playback rate, resolution, etc).
  // This is needed because when the resolution is changed, none of the user settings are retained.
  const playerSettings = {
    volume: 1,
    resolutionLabel: '720p', // Default
    speed: 1,
    addNoteOpen: false,
  };

  const togglePlayButton = function (setting) {
    const vjsPlayBtn = $('.vjs-big-play-button');
    if (setting === 'play') {
      playBtn.html('<a href="javascript: void(0);"><i class="fa fa-play"></i>Play</a>');
      vjsPlayBtn.removeClass('vjs-hidden');
    } else if (setting === 'pause') {
      playBtn.html('<a href="javascript: void(0);"><i class="fa fa-pause"></i>Pause</a>');
      vjsPlayBtn.addClass('vjs-hidden');
    }
  };

  const displaySecondsAsTime = function (timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds - (minutes * 60));
    const x = minutes < 10 ? minutes : minutes;
    const y = seconds < 10 ? '0' + seconds : seconds;

    return x + ':' + y;
  };




  // If this lesson type is a video, apply video JS
  if (lessonType === 'video') {
    // Get the video (if there is one).
    // An image will be loaded first.
    // The data.image that's returned from the Ajax request should match the image when the page loads.
    ajax('get-lesson-video', sender, // eslint-disable-line no-undef
    function ajaxStart(start) { // eslint-disable-line
      // Do something when starting
    },
    function ajaxSuccess(data) { // eslint-disable-line

      // Check if there are is a video. If there isn't, show the image
      if (data.videos.hasVideo) {
        // Set the video
        player = videojs('video_0', { // eslint-disable-line no-undef
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
          const overlayHtml = '<a href="/course-landing-page.html" class="overlay__title">' +
                                data.courseName +
                              '</a>' +
                              '<a href="/course-syllabus.html" class="overlay__lesson">' +
                                data.lessonName +
                              '</a>' +
                              '<div class="overlay__buttons">' +
                                '<a href="/course-syllabus.html"><i class="fa fa-bars"></i></a>' +
                                '<a href="javascript: void(0);"><i class="fa fa-clipboard js-add-note"></i></a>' +
                                '<a href="javascript: void(0);"><i class="fa fa-star-half-o js-rate-lesson"></i></a>' +
                                // '<a href="/PLACEHOLDER"><i class="fa fa-cloud-download"></i></a>' +
                                ((data.next.hastNextLesson)
                                  ? '<a href="' + data.next.lesson.url + '"><i class="fa fa-chevron-right"></i></a>'
                                  : '') +
                              '</div>';

          const videoOverlays = [{
            content: overlayHtml,
            start: 'ready',
            end: 'play',
            align: 'cover',
            class: 'fadeIn',
            attachToControlBar: true,
          }, {
            content: overlayHtml,
            start: 'pause',
            end: 'play',
            align: 'cover',
            class: 'fadeIn',
            attachToControlBar: true,
          }];

          // If there is a next lesson, when the video ends offer the student the opportunity to move to the next lesson.
          if (data.next.hastNextLesson) {
            videoOverlays.push({
              content: '<a href="' + data.next.lesson.url + '" class="next__lesson">Next Lesson</a>',
              start: 'ended',
              end: 'play',
              align: 'right',
              class: 'vjs-overlay-right-next-video fadeIn',
              attachToControlBar: true,
            });
          }

          // If there are any notes, loop through them and add them to the overlays.
          if (data.notes.totalNotes > 0) {
            for (let i in data.notes.notes) {
              videoOverlays.push({
                content: data.notes.notes[i].note,
                start: data.notes.notes[i].time,
                end: (data.notes.notes[i].time + data.notes.notes[i].duration),
                align: 'bottom-right',
                class: 'fadeIn',
                attachToControlBar: false,
              });
            }
          }

          // Add the note overlay
          videoOverlays.push({
            content: '<form class="js-add-note-form">' +
                        '<textarea placeholder="Add your note" class="comment__textarea comment__textarea--small"></textarea>' +
                        '<button type="submit" class="btn">Save</button>' +
                        '<button type="reset" class="btn btn--link js-cancel-note">Cancel</button>' +
                      '</form>',
            start: 'addNote',
            end: 'hideNote',
            align: 'top-right',
            class: 'fadeIn',
            attachToControlBar: false,
          });

          player.overlay({
            content: '',
            debug: false,
            overlays: videoOverlays,
          });


          player
          // When the video is being played, show the pause button.
          .on('play', function () {
            player.play();
            togglePlayButton('pause');
          })
          // When the video is being paused, show the play button.
          .on('pause', function () {
            player.pause();
            togglePlayButton('play');
          })
          // When entering fullscreen, allow default controls.
          // NOTE: Not all browsers support VideoJS skins and they use their own.
          .on('fullscreenchange', function () {
            setTimeout(function () {
              if (player.isFullscreen()) {
                player.isFullscreen(true);
                player.controls(true);
              } else {
                player.isFullscreen(false);
                player.controls(false);
              }
            }, 50);
          })
          .on('error', function () {
            $('.vjs-big-play-button').remove();
          })
          .on('addNote', function () {
            // Custom event for adding a note with overlay
            player.pause();
            togglePlayButton('play');
            playerSettings.addNoteOpen = true;
            $('.js-add-note-form textarea').focus();
          })
          .on('hideNote', function () {
            // Note is being cancelled.
            player.play();
            togglePlayButton('pause');
            playerSettings.addNoteOpen = false;
          })
          .on('saveNote', function () {
            // Note was saved.
            player.trigger('hideNote');
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

        // If the metadata was loaded already. Default is false.
        let metaLoaded = false;

        player.on('loadedmetadata', function (e) {
          // Check if the user has set a playback rate already set.
          if (getCookie('playbackRate') !== '') {
            // Set the playbackRate
            $('input[type="radio"][value="' + getCookie('playbackRate') + '"]').prop('checked', true);
            player.playbackRate(getCookie('playbackRate'));
          }

          if (!metaLoaded) {
            // The metadata is loaded.
            metaLoaded = true;
            // Set the video duration
            let videoDuration = Math.floor(player.duration());

            // If there are any notes, we should put them in the playbar as ticks.
            if (data.notes.totalNotes > 0) {
              for (let i in data.notes.notes) {
                let percent = (data.notes.notes[i].time / videoDuration) * 100;
                $slider.append('<div class="slider__note" style="left: ' + percent + '%"></div>');
              }
            }

            // If there are any in-video questions, add those as ticks as well.
            if (data.questions.totalQuestions > 0) {
              for (let i in data.questions.questions) {
                let percent = (data.questions.questions[i].time / videoDuration) * 100;
                $slider.append('<div class="slider__question" style="left: ' + percent + '%"></div>');
                questionTimes.push(data.questions.questions[i].time);
              }
            }

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

              const volumeAmount = percentage / 100;
              // Set the player volume
              player.volume(volumeAmount);
              // Set the page's player volume (in case cookies aren't enabled)
              playerSettings.volume = volumeAmount;
              // Set the player volume level cookie
              setCookie('volume', volumeAmount);
            };

            $slider.attr('data-duration', displaySecondsAsTime(videoDuration));

            // Set the playback rate.
            $('input[type="radio"][value="' + player.playbackRate() + '"]').prop('checked', true);

            // For setting the HTML quality options.
            let qualityHtml = '';

            // Loop through all the labels and create dynamic HTML.
            for (let label in player.getGroupedSrc().label) {
              qualityHtml += '<label>' +
                              "<input type='radio' class='js-change-quality' name='quality' value='" + label + "' /> " +
                              label +
                             '</label>';
            }

            // Set the HTML based on the avaialble resolutions.
            $('.qualityselect').html(qualityHtml);

            // Check (make seleccted) the currenltly used video source.
            $('.js-change-quality[value="' + player.currentResolution().label + '"]').prop('checked', true);


            // Check if the user has set a quality already set.
            if (getCookie('defaultVideoQuality') !== '') {
              // Set the video quality
              $('.js-change-quality[value="' + getCookie('defaultVideoQuality') + '"]').prop('checked', true);
              player.currentResolution(getCookie('defaultVideoQuality'));
            }

            // Check if the user has set a volume level, aply it
            if (getCookie('volume') !== '') {
              // Set the volume level.
              player.volume(getCookie('volume'));
              // Do not set any DOM changes; the volume menu will auto-adapt when it's opened.
            }

            let lastSecond = 0;
            player
            // Update the time sider when every 15-250ms.
            .on('timeupdate', function () {
              const time = player.currentTime();
              $currentTime.text(displaySecondsAsTime(time));
              const percent = (time / videoDuration) * 100;
              $progress.css('width', (percent <= 100 ? percent : 100) + '%');
              // The rounded-to-the-lowest-second value.
              const currentTime = Math.floor(time);

              if (currentTime !== lastSecond) {
                lastSecond = currentTime;

                // Check if there are any in-video questions for this time.
                if (questionTimes.indexOf(currentTime) !== -1) {
                  // Loop through all the available questions until we find the right one based on the time.
                  for (let i in data.questions.questions) {
                    if (data.questions.questions[i].time === currentTime
                        && data.questions.questions[i].seen === undefined
                        && !player.isFullscreen()) {
                      // Add another value to this questions object stating it was seen already.
                      data.questions.questions[i].seen = true;
                      // Pause the player for this question
                      player.pause();
                      togglePlayButton('play');

                      // Much shorter variable name..
                      const answers = data.questions.questions[i].answers;
                      // Create the message HTML.
                      let message = '<span class="video__question">' +
                                      data.questions.questions[i].question +
                                    '</span>';
                      message += '<form method="post" class="js-video-question">';
                      // Loop through all the answers and add them to the message var.
                      for (let a in answers) {
                        message += '<label class="label__block"><input type="checkbox" value="' + answers[a].id + '" /> '+
                                     answers[a].answer + 
                                    '</label>';
                      }
                      message += '</form>';

                      // Open a new modal.
                      const modal = new Modal({
                        title: 'Pop Question!',
                        message: message,
                        showClose: data.questions.questions[i].canSkip,
                        canEsc: data.questions.questions[i].canSkip,
                        buttons: {
                          answer: {
                            label: 'Answer Question',
                            className: 'js-answer-video-question',
                            callback: function () {
                              const btn = $('.js-answer-video-question');
                              const form = $('.js-video-question');
                              sender.questionId = data.questions.questions[i].id;
                              sender.answers = [];

                              $('input:checked', form).each(function() {
                                sender.answers.push(this.value);
                              });

                              if (sender.answers.length <= 0) {
                                // No answers were given.
                              } else {
                                // Answers were given
                                ajax('set-invideo-answers', sender,
                                  function beforeAnsweringQuestion() {
                                    btn.button();
                                  },
                                  function AnsweringQuestionComplete(answer) {
                                    // Do anything with the returned values
                                    if (answer.canContinue) {
                                      btn.button('saved', 'Correct <i class="fa fa-check"></i>');
                                      setTimeout(function () {
                                        modal.closeModal();
                                        player.play();
                                        togglePlayButton('pause');
                                      }, 1000);
                                    } else {
                                      // Student cannot continue; probably too many wrong answers.
                                      btn.button('saved', 'Try Again');
                                    }
                                  },
                                  function answeringQuestionFailed() {
                                    btn.button('reset');
                                  },
                                  function answeringQuestionAlways() {
                                    // An action to *always* take.
                                  });
                              }

                              return false;
                            },
                          },
                        },
                      });
                    }
                  }
                }
              }
            });

            $(document)
            // Click event: when the video is being played.
            .on('click', '.js-play-video', function (e) {
              if (player.paused()) {
                player.play();
                togglePlayButton('pause');
              } else {
                player.pause();
                togglePlayButton('play');
              }

              return e.preventDefault();
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
            .on('mouseup', 'body', function (e) {
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
            })
            .on('click', '.js-open-video-menu', function (e) {
              const parent = $(this).parent();
              const selected = parent.find('.videoselect__up');
              selected.toggleClass('videoselect__up--closed');
              // Close all others menus, except the volume one.
              $('.videoselect__up').not(selected).addClass('videoselect__up--closed');

              return e.preventDefault();
            })
            .on('click', '.js-change-playbackrate', function (e) {
              const rate = parseFloat( $(this).val() );
              player.playbackRate( rate );
              playerSettings.speed = rate;
              // Set the playback rate.
              setCookie('playbackRate', rate);
            })
            .on('click', '.js-change-quality', function (e) {
              const newSrc = $(this).val();
              const currentTime = player.currentTime();
              // Apply the new resolution.
              player.currentResolution(newSrc);
              // Re-apply the current playbackRate, volume and the currentTime
              player.playbackRate( playerSettings.speed );        
              player.volume( playerSettings.volume );        
              player.currentTime(currentTime);

              // Set the users cookie so these videos alway play at the same rate.
              setCookie('defaultVideoQuality', newSrc);
            })
            // Click event: Request fullscreen video
            .on('click', '.video__fullscreen', function (e) {
              player.requestFullscreen();
              player.controls(true);
              return e.preventDefault();
            }); // End video event listeners
          } // End if(!metaLoaded)...
        }) // End player.on('loadedmetadata'....
        .on('ended', function (e) {
          // The video has ended. Send data back to the servers so we can mark this lesson as completed.
          ajax('ajax/video-lesson-complete.html', sender,
            function videoFinishedStarted() {
              console.log('Prepping video completion ajax request');
            },
            function videoFinishedSuccess(data) {
              console.log('Completed video completion ajax request');
            },
            function videoFinishedFailed(error) {
              console.log('Failed video completion ajax request');
            },
            function videoFinishedAlways() {
              console.log('Cleaning up video completion ajax request');
            });
        }); // End player.on('ended'....
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
    // Click event: Add a new note.
    .on('click', '.js-add-note', function(e) {
      if(playerSettings.addNoteOpen) {
        // The menu is already open. Close it.
        player.trigger('hideNote');
      } else {
        // The menu is closed. Open it.
        player.trigger('addNote');
        // Scroll to the top of the page.
        $('html, body').animate({
          scrollTop: 0,
        }, 450);
      }
      return e.preventDefault();
    })
    // Click event: New note is being cancelled
    .on('click', '.js-cancel-note', function (e) {
      player.trigger('hideNote');
      return e.preventDefault();
    })
    // Submit event: New note is being saved.
    .on('submit', '.js-add-note-form', function (e) {
      e.preventDefault();
      const form = $(this);
      const btn = $('button[type="submit"]', form);
      const noteText = $.trim($('textarea', form).val());

      if (noteText !== '') {
        // Add the note text
        sender.note = noteText;
        sender.time = Math.floor(player.currentTime());

        ajax('set-note', sender,
          function beforeNoteSend() {
            btn.button();
          },
          function noteSaveComplete(note) {
            btn.button('saved', 'Note Saved');
            // Add the note to the DOM
            $('.noteslist').append('<li>' +
                                    '<span class="note__time">' +
                                      '<i class="fa fa-clock-o"></i> ' + displaySecondsAsTime(note.time) +
                                    '</span>' +
                                    '<a href="javascript: void(0);" class="note__link" data-note-id="' + note.id + '">' +
                                      note.note.substr(0, 30) +
                                    '</a>' +
                                  '</li>');
            setTimeout(function () {
              player.trigger('hideNote');
              // Remove the note value so another note can be added.
              $('textarea', form).val('');
            }, 1000);
          },
          function noteSaveFailed() {
            // Note failed.
            btn.button('reset');
          },
          function noteAlways() {
            // Ajax cleanup
          });
      } else {
        // No note to add, cancel the note.
        player.trigger('hideNote');
      }
      return false;
    });
  } // End if (lessonType === 'video') { ....
  else if (lessonType === 'document') {
  // If this lesson type is a document, apply document JS

    // Document page listeners
    $(document)
    // Click event: When the "Add note" button is clicked, auto focus on the textarea.
    .on('click', '.js-add-note--document', function (e) {
      $('.js-add-note-form--document textarea').focus();
      return e.preventDefault();
    })
    // Submit event: New note is being saved.
    .on('submit', '.js-add-note-form--document', function (e) {
      e.preventDefault();
      const form = $(this);
      const btn = $('button[type="submit"]', form);
      const noteText = $.trim($('textarea', form).val());

      if (noteText !== '') {
        // Add the note text
        sender.note = noteText;
        sender.time = null;

        ajax('set-note', sender,
          function beforeNoteSend() {
            btn.button();
          },
          function noteSaveComplete(note) {
            btn.button('saved');
            // Add the note to the DOM
            $('.note__container').prepend('<div class="review">' +
                                            '<div class="review__col review__col--right">' +
                                              '<div class="review__message">' +
                                                note.note +
                                              '</div>' +
                                            '</div>' +
                                          '</div>');

            // Remove the note value so another note can be added.
            $('textarea', form).val('').focus();
          },
          function noteSaveFailed() {
            // Note failed.
            btn.button('reset');
          },
          function noteAlways() {
            // Ajax cleanup
          });
      }
      return false;
    })

    const resizeDocumentNotesColumn = function () {
      // Resize the notes section.
      console.log('resizing');
      $('.note__container').css('max-height', $('.document__container').height() - ($('.document__notes').height() - $('.note__container').height() ));
    };

    window.onresize = resizeDocumentNotesColumn;

    resizeDocumentNotesColumn();
  }









  //
  // Global event listeners for all lesson types.
  //
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

    $('.ajax-gather', this).each(function () {
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

    // Attach the review data to the sender const.
    sender.review = review;

    // If this event managed to get this far, we can assume the data is being sent to the server for further validation.
    // Hide the error now.
    err.removeClass('review__error--visible');

    ajax('set-course-review', sender,
        function beforeAjax() {
          btn.button();
        },
        function ajaxSuccess(data) {
          console.log(data);
          btn.button('saved');
        },
        function ajaxFailed(error) {
          btn.button('reset');
        },
        function ajaxAlways() {
        });

    return false;
  })
  // User wants to open comments/answers for an open discussion
  .on('click', '.js-open-comments', function (e) {
    // The discusson parent.
    const discussion = $(this).closest('.discussion');
    const discussionId = discussion.data('discussion-id');
    // The comments container.
    const commentsContainer = discussion.find('.discussion__comments');

    // Attach the discussionId to the sender const.
    sender.discussionId = discussionId;

    // Load all the comments
    ajax('get-discussion-comments', sender,
      function beforeGetComments() {
        // Pause the video, if it's currently playing.
        if (player && !player.paused()) {
          player.pause();
          togglePlayButton('play');
        }
      },
      function getCommentsSuccess(data) {
        if (data.totalComments > 0) {
          // Turn json into html.
          let html = '';
          for (let i in data.comments) {

            html += '<div class="comment">' +
                      '<div class="boxes">' +
                        '<div class="box box--10 hidden--sm">' +
                          '<a href="' + data.comments[i].authorUrl + '" class="comment__author">' +
                            '<img src="' + data.comments[i].authorImage + '" class="img__responsive" />' +
                          '</a>' +
                        '</div>' +
                        '<div class="box">' +
                          '<div class="comment__headline">' +
                            '<a href="' + data.comments[i].authorUrl + '" class="comment__author">' +
                              data.comments[i].authorName +
                              (data.comments[i].isTeacher
                                ? ' <i class="fa fa-check-circle text--gold"></i>'
                                : '') +
                              '</a> replied on ' +
                              '<span class="comment__date">' + data.comments[i].date + '</span> with&hellip;' +
                          '</div>' +
                          '<div class="comment__container">' +
                            data.comments[i].comment +
                          '</div>' +
                        '</div>' +
                      '</div>' +
                    '</div>';
          }

          html += '<div class="new__comments"></div>';

          // Add the comment box so the discussion canc ontinue.
          html += '<div class="discussion discussion--inner">' +
                        '<div class="comment__headline">' +
                          'Make this discussion better by adding your comments.' +
                        '</div>' +
                        '<div class="comment__container">' +
                          '<form class="js-add-comment">' +
                            '<textarea type="text" class="comment__textarea comment__textarea--small" required="required" placeholder="Your question or comment in here."></textarea>' +
                            '<button type="submit" class="btn">Comment</button>' +
                          '</form>' +
                        '</div>' +
                  '</div>';
          commentsContainer.html(html);
          // Once comment loading is complete, show the comments.
          commentsContainer.show();
          // Move the viewer down to the question area.
          $('html, body').animate({
            scrollTop: discussion.offset().top - 70,
          }, 450);
        } else {
          // There were no comments. We could do something.. or nothing.
        }
      },
      function getCommentsFailed() {

      },
      function getCommentsAlways() {
        // Remove elements after the ajax request is complete.
        $('.js-remove-on-open', discussion).remove();
        // Remove the ability to re-open this thread.
        $('.js-open-comments', discussion).removeClass('js-open-comments');
      });
    return e.preventDefault();
  })
  // Submit event: when a comment is being added, take this action.
  .on('submit', '.js-start-discussion', function (e) {
    e.preventDefault();
    const t = $(this);
    const btn = $('button', t);
    const input = $('input', t);

    // Add the comment to the sender const.
    sender.comment = $.trim(input.val());

    // Load all the comments
    ajax('set-new-discussion', sender,
      function beforeGetComments() {
        // Pause the video, if it's currently playing.
        btn.button();
      },
      function getCommentsSuccess(data) {
        // Reset the input field
        input.val('');
        // Save button text
        btn.button('saved', 'Comment Added');
        // Create the new html for the discussion and append it after the submit area.
        const html = '<div class="discussion discussion--inner" data-discussion-id="' + data.discussionId + '">' +
                        '<a href="javascript: void(0);" class="discussion__title js-open-comments">' +
                          '<i class="fa fa-caret-down js-remove-on-open"></i>' +
                          data.comment +
                        '</a>' +
                        '<div class="discussion__author">' +
                          'Started by <a href="' + data.authorUrl + '">' + data.authorName + '</a> on ' +
                          data.date +
                        ' <i class="fa fa-eye"></i> 0 views ' +
                        ' <i class="fa fa-comment-o"></i> 0 comments ' +
                      '</div>' +
                      '<div class="discussion__comments"></div>' +
                    '</div>';
        $('.discussion__new').after(html);

        // Remove the .discussion--none section.
        // This block might not exist; but if it does we'll remove it.
        $('.discussion--none').remove();
      },
      function getCommentsFailed() {
        btn.button('reset');
      },
      function getCommentsAlways() {
      });
    return false;
  })
  // Click event: user is adding a new discussion point
  .on('click', '.js-add-discussion', function (e) {
    $('.discussion__new').slideToggle(150, function () {
      $('input', this).focus();
    });

    return e.preventDefault();
  })
  // Click event: user is downloading a resource from the "Resources" pane
  .on('click', '.js-download-file', function (e) {
    const t = $(this);
    const id = 'download_' + $.now();
    sender.resourceId = t.data('resource-id');

    ajax('get-resource-by-id', sender,
      function beforeResourceRequest() {
        t.addClass('disabled');
      },
      function resourceRequestComplete(data) {
        t.attr('href', data.url).attr('id', id);
        // Don't allow a second ajax request.
        t.removeClass('disabled js-download-file');
        // Open the new url.
        window.open(data.url, 'Arkmont Resource File');
      },
      function resourceRequestFailed() {
        t.addClass('disabled');
        const modal = new Modal({
          title: 'Download failed',
          message: 'You may need to refresh the page and try this download again.',
          buttons: {
            refresh: {
              label: 'Refresh Page',
              callback: function refreshPage() {
                location.reload();
              },
            },
            cancel: {
              label: 'Cancel',
            },
          },
        });
        // Don't allow a second ajax request.
        t.removeClass('js-download-file');
      },
      function resourceRequestAlways() {
      });
    return e.preventDefault();
  })

  // Submit event: a comment is being added to a discussion
  // Submit event: when a comment is being added, take this action.
  .on('submit', '.js-add-comment', function (e) {
    e.preventDefault();
    const t = $(this);
    const btn = $('button', t);
    const input = $('textarea', t);

    // Add the comment to the sender const.
    sender.comment = $.trim(input.val());
    console.log(sender);
    // Load all the comments
    ajax('set-discussion-comment', sender,
      function beforeGetComments() {
        // Pause the video, if it's currently playing.
        btn.button();
      },
      function getCommentsSuccess(data) {
        // Reset the input field
        input.val('');
        // Save button text
        btn.button('saved', 'Comment Added');
        // Create the new html for the discussion and append it after the submit area.
        const html = '<div class="comment">' +
                        '<div class="boxes">' +
                          '<div class="box box--10 hidden--sm">' +
                            '<a href="' + data.comments[0].authorUrl + '" class="comment__author">' +
                              '<img src="' + data.comments[0].authorImage + '" class="img__responsive" />' +
                            '</a>' +
                          '</div>' +
                          '<div class="box">' +
                            '<div class="comment__headline">' +
                              '<a href="' + data.comments[0].authorUrl + '" class="comment__author">' +
                                data.comments[0].authorName +
                                (data.comments[0].isTeacher
                                  ? ' <i class="fa fa-check-circle text--gold"></i>'
                                  : '') +
                                '</a> replied on ' +
                                '<span class="comment__date">' + data.comments[0].date + '</span> with&hellip;' +
                            '</div>' +
                            '<div class="comment__container">' +
                              data.comments[0].comment +
                            '</div>' +
                          '</div>' +
                        '</div>' +
                      '</div>';
        $('.new__comments').append(html);

      },
      function getCommentsFailed() {
        btn.button('reset');
      },
      function getCommentsAlways() {
      });
    return false;
  })
  // Click event: rate the current lesson
  .on('click', '.js-rate-lesson', function (e) {
    console.log(sender);
    alert('rate lesson');
    return e.preventDefault();
  })


});
