$(document).ready(function () {
  // Body selector.
  const body = $('body');
  // Course and lesson data, used mainly for ajax requests.
  const sender = {
    courseId: body.data('course-id'),
  };

  const error = function (errSelector, message) {
    if (message !== undefined && message !== 'reset') {
      errSelector.html(message).addClass('account__error--visible');
    } else {
      errSelector.removeClass('account__error--visible');
    }

    return false;
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
  // Submit event: Change course details
  .on('submit', '.js-change-details', function (e) {
    e.preventDefault();

    const form = $(this);
    const btn = $('button', form);
    const errorSelector = $('.js-error', form);

    sender.details = {
      name: $.trim($('[name="course_name"]', form).val()),
      brief: $.trim($('[name="course_brief"]', form).val()),
      url: $.trim($('[name="course_url"]', form).val()),
      category: $.trim($('[name="course_category"]', form).val()),
    };

    ajax('set-course-details', sender,
      function beforeAjaxRequest() {
        // Remove any errors.
        error(errorSelector, 'reset');
        // Change button to "loading" state
        btn.button();
      },
      function ajaxRequestComplete(data) {
        // Button in saved state
        btn.button('saved');
        // Set the fields to whatever was returned by the database.
        for (let key in data) {
          $(':input[name="course_' + key + '"]', form).val(data[key]);
        }
      },
      function ajaxRequestFailed() {
        btn.button('reset');
      },
      function ajaxRequestAlways() {

      });
    return false;
  })
  // Submit event: Change course license
  .on('submit', '.js-change-license', function (e) {
    e.preventDefault();

    const form = $(this);
    const btn = $('button', form);
    const errorSelector = $('.js-error', form);

    sender.license = $('[name="course_license"]', form).val();

    ajax('set-course-license', sender,
      function beforeAjaxRequest() {
        // Remove any errors.
        error(errorSelector, 'reset');
        // Change button to "loading" state
        btn.button();
      },
      function ajaxRequestComplete(data) {
        // Button in saved state
        btn.button('saved');
        // Change the license field to what Arkmont recognizes it to be.
        $(':input[name="course_license"]', form).val(data.license);
      },
      function ajaxRequestFailed() {
        btn.button('reset');
      },
      function ajaxRequestAlways() {

      });
    return false;
  })
  // Submit event: Change course price
  .on('submit', '.js-change-price', function (e) {
    e.preventDefault();

    const form = $(this);
    const btn = $('button', form);
    const errorSelector = $('.js-error', form);

    sender.price = parseFloat($('[name="course_price"]', form).val()).toFixed(2);

    if (sender.price > 0) {
      if (sender.price < 9 || sender.price >= 1000) {
        return error(errorSelector, 'Course prices must be between $9 and $999.99');
      }
    } else {
      // The price is 0 or less than zero, the course will be made free.
      sender.price = 0.00;
    }

    ajax('set-course-price', sender,
      function beforeAjaxRequest() {
        // Remove any errors.
        error(errorSelector, 'reset');
        // Change button to "loading" state
        btn.button();
      },
      function ajaxRequestComplete(data) {
        // Button in saved state
        btn.button('saved');
        // Change recognized price. Minimums and maximums may take place through server-side validation
        $(':input[name="course_price"]', form).val(data.price);
      },
      function ajaxRequestFailed() {
        btn.button('reset');
      },
      function ajaxRequestAlways() {

      });
    return false;
  })
  // Click event: Show the new coupon form.
  .on('click', '.js-create-coupon', function (e) {
    $(this).hide();
    $('.js-add-coupon').slideDown(300, function () {
      $('html, body').animate({
        scrollTop: $(this).offset().top - 70,
      }, 450, function() {
        $(':input[name="coupon_code"]').focus();
      });
    });
    return e.preventDefault();
  })
  // Submit event: Add a coupon
  .on('submit', '.js-add-coupon', function (e) {
    e.preventDefault();

    const form = $(this);
    const btn = $('button', form);
    const errorSelector = $('.js-error', form);

    sender.coupon = {
      price: parseFloat($('[name="coupon_price"]', form).val()).toFixed(2),
      totalCoupons: Number($('[name="coupon_total"]', form).val()),
      code: String($('[name="coupon_code"]', form).val()).toUpperCase(),
    };

    // Minimum price validation
    if (sender.coupon.price < 5) {
      return error(errorSelector, 'Coupon price must be $5 or more.');
    }

    // totalCode vaidation
    if (sender.coupon.totalCoupons < 1 || sender.coupon.totalCoupons > 200) {
      return error(errorSelector, 'You can create between 1 and 200 coupons at a time');
    }

    ajax('set-course-coupon', sender,
      function beforeAjaxRequest() {
        // Remove any errors.
        error(errorSelector, 'reset');
        // Change button to "loading" state
        btn.button();
      },
      function ajaxRequestComplete(data) {
        // Button in saved state
        btn.button('saved');
        // Table object
        const table = $('.js-coupon-table');
        // Change recognized price. Minimums and maximums may take place through server-side validation
        $(':input[name="course_price"]', form).val(data.price);
        $('tbody', table)
          .append('<tr>' +
                    '<td>' + data.code + '</td>' +
                    '<td>$' + data.price.toFixed(2) + '</td>' +
                    '<td>' + data.totalCoupons + '</td>' +
                    '<td class="js-coupon-active">Yes</td>' +
                    '<td class="text--right"><button class="btn btn--sm js-deactivate-coupon" ' +
                          'data-coupon-id="' + data.id + '" data-action="confirm">Deactivate</button></td>' +
                  '</tr>');
        table.show();
      },
      function ajaxRequestFailed() {
        btn.button('reset');
      },
      function ajaxRequestAlways() {

      });
    return false;
  })
  // Click event: a coupon is beign deactivated
  // This event takes a different action based on the data-action attr.
  .on('click', '.js-deactivate-coupon', function (e) {
    const btn = $(this);
    const action = btn.attr('data-action');
    if (action === 'confirm') {
      btn.text('Are you sure?');
      // Change the action to "deactivate"
      btn.attr('data-action', 'deactivate');
    } else {
      // Deactivate this coupon.
      sender.couponId = btn.attr('data-coupon-id');

      ajax('set-course-coupon-deactivate', sender,
        function beforeDeactivation() {
          btn.button();
        },
        function deactivationComplete() {
          btn.closest('tr').find('.js-coupon-active').text('No');
          btn.button('reset');
          btn.prop('disabled', true).addClass('disabled').text('Inactive');
        },
        function deactivationFailed() {
          btn.button('reset');
        },
        function deactivationAlways() {

        });
    }
    return e.preventDefault();
  })
  // Click event: report a review
  .on('click', '.js-report-review', function (e) {
    const btn = $(this);
    const action = btn.attr('data-action');
    if (action === 'confirm') {
      btn.text('Are you sure?');
      // Change the action to "report"
      btn.attr('data-action', 'report');
    } else {
      // Deactivate this coupon.
      sender.reportType = btn.attr('data-report');
      sender.reviewId = Number(btn.attr('data-review-id'));

      ajax('set-course-report-review', sender,
        function beforeReport() {
          btn.button();
        },
        function reportComplete() {
          btn.button('reset');
          btn.closest('.review__actioncontainer').find('button').not(btn).remove();
          btn.text('Report Filed').addClass('disabled').prop('disabled', true);
        },
        function reportFailed() {
          btn.button('reset');
        },
        function reportAlways() {

        });
    }
    return e.preventDefault();
  })
  // Click even: Lesson with reviews is being opened.
  .on('click', '.js-lesson-review', function (e) {
    const t = $(this);
    const isOpened = t.attr('data-opened') === 'false' ? false : true;

    if (!isOpened) {
      // The data has not been ajaxed. Collect it now.
      const btn = $('span', t);
      sender.lessonId = t.attr('data-lesson-id');
      ajax('get-course-lesson-reviews', sender,
        function beforeLessonReview() {
          btn.button();
        },
        function lessonReviewsComplete (data) {
          t.attr('data-opened', 'true');
          console.log(data);
          let html = '';
          const uniqueId = sender.lessonId + '-';

          for (i in data.keywords) {
            html +='<div class="lr__item">' +
                    '<div class="lr__name">' +
                      data.keywords[i].term +
                      ' (' + data.keywords[i].total + ' reviews)' +
                    '</div>' +
                    '<div class="lr__bar">' +
                      '<div class="progress">' +
                        '<div class="progress-wrapper">' +
                          '<div class="progress-bar" id="' + uniqueId + i + '">' +
                            data.keywords[i].percent + '%' +
                          '</div>' +
                        '</div>' +
                      '</div>' +
                    '</div>' +
                  '</div>';
          }

          t.after(html);

          // Animate each progress bar by changing their widths.
          setTimeout(function () {
            for (i in data.keywords) {
              $('#' + uniqueId + i).css({width: data.keywords[i].percent + '%'});
            }
          }, 200);
        },
        function lessonReviewsFailed() {
        },
        function lessonReviewsAlways() {
          btn.button('reset');
        });
      btn.button();

    }
    return e.preventDefault();
  })
  // Submit event: Edit google analytics tracking id
  .on('submit', '.js-change-google-analytics', function (e) {
    e.preventDefault();

    const form = $(this);
    const btn = $('button', form);
    const errorSelector = $('.js-error', form);

    sender.trackingId = $('[name="course_ga"]', form).val();

    ajax('set-course-google-analytics', sender,
      function beforeAjaxRequest() {
        // Remove any errors.
        error(errorSelector, 'reset');
        // Change button to "loading" state
        btn.button();
      },
      function ajaxRequestComplete(data) {
        // Button in saved state
        btn.button('saved');
        // Set the form to whatever the servers return.
        $('[name="course_ga"]', form).val(data.trackingId);
      },
      function ajaxRequestFailed() {
        btn.button('reset');
      },
      function ajaxRequestAlways() {

      });
    return false;
  })
  // Click event: a teacher is being removed
  // This event takes a different action based on the data-action attr.
  .on('click', '.js-remove-teacher', function (e) {
    const btn = $(this);
    const action = btn.attr('data-action');
    if (action === 'confirm') {
      btn.text('Are you sure?');
      // Change the action to "remove"
      btn.attr('data-action', 'remove');
    } else {
      // Remove this teacher
      sender.teacherId = btn.attr('data-teacher-id');

      ajax('set-course-remove-teacher', sender,
        function beforeAjaxRequest() {
          btn.button();
        },
        function ajaxRequestComplete() {
          btn.closest('tr').remove();
        },
        function ajaxRequestFailed() {
          btn.button('reset');
        },
        function ajaxRequestAlways() {

        });
    }
    return e.preventDefault();
  })
  // Click event: Show the new coupon form.
  .on('click', '.js-show-teacher-form', function (e) {
    $(this).hide();
    $('.js-add-teacher').slideDown(300, function () {
      $('html, body').animate({
        scrollTop: $(this).offset().top - 70,
      }, 450, function () {
        $(':input[name="teacher_email"]').focus();
      });
    });
    return e.preventDefault();
  })
  // Submit event: Add a coupon
  .on('submit', '.js-add-teacher', function (e) {
    e.preventDefault();

    const form = $(this);
    const btn = $('button', form);
    const errorSelector = $('.js-error', form);

    sender.teacher = {
      email: $('[name="teacher_email"]', form).val().toLowerCase(),
      earningPercent: Number($('[name="teacher_amount"]', form).val()),
    };

    // Minimum price validation
    if (sender.teacher.earningPercent > 90) {
      return error(errorSelector, 'Please enter a valid earning percent for this teacher.');
    }

    ajax('set-course-add-teacher', sender,
      function beforeAjaxRequest() {
        // Remove any errors.
        error(errorSelector, 'reset');
        // Change button to "loading" state
        btn.button();
      },
      function ajaxRequestComplete(data) {
        // Button in saved state
        btn.button('saved');
        // Clear the teacher form.
        $(':input', form).val('');
        // Table object
        const table = $('.js-teacher-table');
        // Add the new row to the table.
        $('tbody', table)
          .append('<tr>' +
                    '<td>' + data.name + '</td>' +
                    '<td>' + data.earningPercent + '%</td>' +
                    '<td class="text--right">' +
                      '<button class="btn btn--sm js-remove-teacher" ' +
                              'data-teacher-id="' + data.teacherId + '" data-action="confirm">' +
                                'Remove' +
                      '</button>' +
                    '</td>' +
                  '</tr>');
        table.show();
        $('html, body').animate({
          scrollTop: table.offset().top - 70,
        }, 450);
      },
      function ajaxRequestFailed() {
        btn.button('reset');
      },
      function ajaxRequestAlways() {

      });
    return false;
  })
  // Click event: a teacher assistant is being removed
  // This event takes a different action based on the data-action attr.
  .on('click', '.js-remove-teacher-assistant', function (e) {
    const btn = $(this);
    const action = btn.attr('data-action');
    if (action === 'confirm') {
      btn.text('Are you sure?');
      // Change the action to "remove"
      btn.attr('data-action', 'remove');
    } else {
      // Remove the TA
      sender.teacherAssistantId = btn.attr('data-teacher-assistant-id');

      ajax('set-course-remove-teacher-assistant', sender,
        function beforeAjaxRequest() {
          btn.button();
        },
        function ajaxRequestComplete() {
          btn.closest('tr').remove();
        },
        function ajaxRequestFailed() {
          btn.button('reset');
        },
        function ajaxRequestAlways() {

        });
    }
    return e.preventDefault();
  })
  // Submit event: Add a coupon
  .on('submit', '.js-add-teacher-assistant', function (e) {
    e.preventDefault();

    const form = $(this);
    const btn = $('button', form);
    const errorSelector = $('.js-error', form);

    sender.teacherAssitantEmail = $('[name="ta_email"]', form).val().toLowerCase();

    ajax('set-course-add-teacher-assistant', sender,
      function beforeAjaxRequest() {
        // Remove any errors.
        error(errorSelector, 'reset');
        // Change button to "loading" state
        btn.button();
      },
      function ajaxRequestComplete(data) {
        // Button in saved state
        btn.button('saved');
        // Clear the teacher form.
        $(':input', form).val('');
        // Table object
        const table = $('.js-teacher-table');
        // Add the new row to the table.
        $('tbody', table)
          .append('<tr>' +
                    '<td>' + data.name + '</td>' +
                    '<td class="text--right">' +
                      '<button class="btn btn--sm js-remove-teacher-assistant" ' +
                              'data-teacher-assistant-id="' + data.studentId + '" data-action="confirm">' +
                                'Remove' +
                      '</button>' +
                    '</td>' +
                  '</tr>');
        table.show();
        $('html, body').animate({
          scrollTop: table.offset().top - 70,
        }, 450);
      },
      function ajaxRequestFailed() {
        btn.button('reset');
      },
      function ajaxRequestAlways() {

      });
    return false;
  })
  // Click event: A teacher wants to know more about a student
  .on('click', '.js-student-details', function (e) {
    // The row
    const t = $(this);
    // Has been opened or not.
    const isOpened = t.attr('data-opened') === 'false' ? false : true;

    // If this row was not opened yet, request data.
    if (!isOpened) {
      sender.studentId = t.data('student-id');
      // State this row was opened. Revert back if ajax fails.
      t.attr('data-opened', 'true');

      ajax('get-course-student-details', sender,
        function beforeSend() {

        },
        function requestComplete(data) {
          t.after('<tr class="no-hover">' +
                    '<td colspan="3">' +
                      '<div class="student__details">' +
                        '<label>Name:</label> ' + data.name +
                      '</div>' +
                      '<div class="student__details">' +
                        '<label>Email:</label> ' + data.email +
                      '</div>' +
                      '<div class="student__details">' +
                        '<label>Questions Asked:</label> ' + data.totalQuestionsAsked +
                      '</div>' +
                      '<div class="student__details">' +
                        '<label>Comments Added:</label> ' + data.totalCommentsProvided +
                      '</div>' +
                    '</td>' +
                  '</tr>');
        },
        function requestFailed() {
          // Ajax request failed, let the user send another request.
          t.attr('data-opened', 'false');
        },
        function requestAlways() {

        });
    }
    return e.preventDefault();
  })
  // Submit event: A new announcement was written and is being submitted
  .on('submit', '.js-create-announcement', function (e) {
    e.preventDefault();

    const form = $(this);
    const btn = $('button[type="submit"]', form);
    const errorSelector = $('.js-error', form);

    sender.announcement = {
      title: $.trim($('[name="announcement_title"]', form).val()),
      body: $.trim( $('.announcement-body').trumbowyg('html') ),
    };

    if (!sender.announcement.title.length) {
      return error(errorSelector, 'Your announcement needs a title.');
    } else if (!sender.announcement.body.length) {
      return error(errorSelector, 'Your announcement needs some content.');
    }

    ajax('set-course-announcement', sender,
      function beforeAjaxRequest() {
        // Remove any errors.
        error(errorSelector, 'reset');
        // Change button to "loading" state
        btn.button();
      },
      function ajaxRequestComplete(data) {
        // Move the teacher to their new announcement.
        console.log(data);
        window.location = data.announcement.url;
      },
      function ajaxRequestFailed() {
        btn.button('reset');
      },
      function ajaxRequestAlways() {

      });
    return false;
  })











  //
  // Auto-loading actions
  //

  // Look for, and animate, any progress bars.
  $('.progress-bar[data-percent]').each(function(i, elem) {
    $(this).css({
      width: $(this).data('percent') + '%',
    })
  })
})
