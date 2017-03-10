(function () {
  $(document).ready(function () {
    // Ajax data to hold.
    const sender = {};

    const error = function(errSelector, message) {
      if (message !== undefined && message !== 'reset') {
        errSelector.html(message).addClass('account__error--visible');
      } else {
        errSelector.removeClass('account__error--visible');
      }

      return false;
    };

    $(document)
    // Submit event: Change email address
    .on('submit', '.js-change-email', function (e) {
      e.preventDefault();

      const form = $(this);
      const btn = $('button', form);
      const errorSelector = $('.js-error', form);

      const email = {
        current: $.trim($('[name="current_email"]', form).val()),
        new: $.trim($('[name="new_email"]', form).val()),
        retyped: $.trim($('[name="retyped_email"]', form).val()),
      };

      // Validate the email data.
      if (email.new !== email.retyped) {
        // If the new email and the retyped email do not match.
        return error(errorSelector, 'Your new and retyped email are not the same.');
      } else if (email.new === email.current) {
        // If the new email and the current email are the same, don't allow a change.
        return error(errorSelector, 'Please enter a different <em>New Email Address.</em>');
      } else if (email.new.length < 6) {
        // If the new email address is too short, disallow form submission.
        return error(errorSelector, 'Your email address is too short.');
      }

      // Add the data to the sender object.
      sender.email = email;

      ajax('set-email-address', sender,
        function beforeAjaxRequest() {
          // Remove any errors.
          error(errorSelector, 'reset');
          // Change button to "loading" state
          btn.button();
        },
        function ajaxRequestComplete(data) {
          // Button in saved state
          btn.button('saved');
          // Reset the form data.
          $('input', form).val('');
        },
        function ajaxRequestFailed() {
          btn.button('reset');
        },
        function ajaxRequestAlways() {

        });
      return false;
    })
    // Submit event: Change password
    .on('submit', '.js-change-password', function (e) {
      e.preventDefault();

      const form = $(this);
      const btn = $('button', form);
      const errorSelector = $('.js-error', form);

      const password = {
        current: $.trim($('[name="current_password"]', form).val()),
        new: $.trim($('[name="new_password"]', form).val()),
        retyped: $.trim($('[name="retyped_password"]', form).val()),
      };

      // Validate the password data.
      if (password.new !== password.retyped) {
        // If the new email and the retyped email do not match.
        return error(errorSelector, 'Your new and retyped passwords are not the same.');
      } else if (password.new === password.current) {
        // If the new email and the current email are the same, don't allow a change.
        return error(errorSelector, 'Please enter a different password.');
      } else if (password.new.length < 8) {
        // If the new email address is too short, disallow form submission.
        return error(errorSelector, 'Your password is too short. It should be at least 8 characters. Longer passwords are always preferred.');
      }

      // Add the data to the sender object.
      sender.password = password;

      ajax('set-password', sender,
        function beforeAjaxRequest() {
          // Remove any errors.
          error(errorSelector, 'reset');
          // Change button to "loading" state
          btn.button();
        },
        function ajaxRequestComplete(data) {
          // Button in saved state
          btn.button('saved');
          // Reset the form data.
          $('input', form).val('');
        },
        function ajaxRequestFailed() {
          btn.button('reset');
        },
        function ajaxRequestAlways() {

        });
      return false;
    })
    // Submit event: Change paypal address
    .on('submit', '.js-change-paypal', function (e) {
      e.preventDefault();

      const form = $(this);
      const btn = $('button', form);
      const errorSelector = $('.js-error', form);

      sender.paypal = $.trim($('[name="current_paypal"]', form).val());

      ajax('set-paypal', sender,
        function beforeAjaxRequest() {
          // Remove any errors.
          error(errorSelector, 'reset');
          // Change button to "loading" state
          btn.button();
        },
        function ajaxRequestComplete(data) {
          // Button in saved state
          btn.button('saved');
          // Reset the form data.
          $('input', form).val('');
        },
        function ajaxRequestFailed() {
          btn.button('reset');
        },
        function ajaxRequestAlways() {

        });
      return false;
    })
    // Submit event: Change teacher status and description
    .on('submit', '.js-change-teacher-status', function (e) {
      e.preventDefault();

      const form = $(this);
      const btn = $('button', form);
      const errorSelector = $('.js-error', form);

      sender.teacher = {
        status: $.trim($('[name="teacher_status"]', form).val()),
        description: $.trim($('[name="teacher_description"]', form).val()),
      };

      ajax('set-teacher-description', sender,
        function beforeAjaxRequest() {
          // Remove any errors.
          error(errorSelector, 'reset');
          // Change button to "loading" state
          btn.button();
        },
        function ajaxRequestComplete(data) {
          // Button in saved state
          btn.button('saved');
          // Set the input fields as the returned data (as a form of validation from the user)
          $('[name="teacher_status"]', form).val(data.status);
          $('[name="teacher_description"]', form).val(data.description);
        },
        function ajaxRequestFailed() {
          btn.button('reset');
        },
        function ajaxRequestAlways() {

        });
      return false;
    })
    // Submit event: Change user address
    .on('submit', '.js-change-address', function (e) {
      e.preventDefault();

      const form = $(this);
      const btn = $('button', form);
      const errorSelector = $('.js-error', form);

      sender.address = {
        city: $.trim($('[name="address_city"]', form).val()),
        state: $.trim($('[name="address_state"]', form).val()),
        country: $.trim($('[name="address_country"]', form).val()),
      };

      ajax('set-address', sender,
        function beforeAjaxRequest() {
          // Remove any errors.
          error(errorSelector, 'reset');
          // Change button to "loading" state
          btn.button();
        },
        function ajaxRequestComplete(data) {
          // Button in saved state
          btn.button('saved');
          // Set the input fields as the returned data (as a form of validation from the user)
          $('[name="address_city"]', form).val(data.city);
          $('[name="address_state"]', form).val(data.state);
          $('[name="address_country"]', form).val(data.country);
        },
        function ajaxRequestFailed() {
          btn.button('reset');
        },
        function ajaxRequestAlways() {

        });
      return false;
    })
    // Submit event: Change user address
    .on('submit', '.js-change-links', function (e) {
      e.preventDefault();

      const form = $(this);
      const btn = $('button', form);
      const errorSelector = $('.js-error', form);

      sender.links = {
        website: $.trim($('[name="links_website"]', form).val()),
        facebook: $.trim($('[name="links_facebook"]', form).val()),
        twitter: $.trim($('[name="links_twitter"]', form).val()),
        linkedin: $.trim($('[name="links_linkedin"]', form).val()),
      };

      ajax('set-links', sender,
        function beforeAjaxRequest() {
          // Remove any errors.
          error(errorSelector, 'reset');
          // Change button to "loading" state
          btn.button();
        },
        function ajaxRequestComplete(data) {
          // Button in saved state
          btn.button('saved');
          // Set the input fields as the returned data (as a form of validation from the user)
          $('[name="links_website"]', form).val(data.website);
          $('[name="links_facebook"]', form).val(data.facebook);
          $('[name="links_twitter"]', form).val(data.twitter);
          $('[name="links_linkedin"]', form).val(data.linkedin);
        },
        function ajaxRequestFailed() {
          btn.button('reset');
        },
        function ajaxRequestAlways() {

        });
      return false;
    })
    // Submit event: Change user address
    .on('submit', '.js-change-about', function (e) {
      e.preventDefault();

      const form = $(this);
      const btn = $('button[type="submit"]', form);
      const errorSelector = $('.js-error', form);

      sender.about = $.trim($('.about-editor', form).trumbowyg('html'));

      ajax('set-about', sender,
        function beforeAjaxRequest() {
          // Remove any errors.
          error(errorSelector, 'reset');
          // Change button to "loading" state
          btn.button();
        },
        function ajaxRequestComplete(data) {
          // Button in saved state
          btn.button('saved');
          // Set the input fields as the returned data (as a form of validation from the user)
          $('[name="about"]', form).val(data.about);
        },
        function ajaxRequestFailed() {
          btn.button('reset');
        },
        function ajaxRequestAlways() {

        });
      return false;
    })
  });
})();
