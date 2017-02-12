/* eslint linebreak-style: ["error", "unix"] */
(function() {

  // Set any "global" vars.
  // Navigation jq object
  const $nav = $('.nav:first');
  const $mobileNav = $nav.find('.mobile__nav:first');

  // Required. This relies on jQuery and cannot exist without it.
  $(document).ready(() => {
    // The carousel object.
    const carousel = {
      // Holds the VideoJS player object
      player: false,
      // A cache object, used for whatever you want.
      cache: {},
      // Holds all the settings from the carousel.
      settings: {
        // How many tiles should 'slide' when 'next' or 'prev' is clicked in a row
        // 5 is the default
        tilesPerPage: 5,
        // Default tile width with it's margin
        tileWidth: 253,
        // Global variable for active tiles.
        aTileIsActive: false,
        // Is the tile hover state available or not.
        // For mobile devices you'll want to disable this.
        tileHoverState: true,
        // During development, we'll add an event trigger that spits out a
        // console.log(..) message.  This will be removed later.
        carouselLogEnabled: true,
      },
      // During development, we'll add an event trigger that spits out a
      // console.log(..) message. This will be removed later.
      log(message) {
        if (this.settings.carouselLogEnabled) {
          console.log(message); // eslint-disable-line no-console
        }
      },
      // _row is the row selector (jquery object)
      // currentPage is the current page number.
      setScrollButtons(_row, currentPage) {
        // This timer (set to 450ms) matches the css transition scroll time.
        // This allows the scroll to happen without a blank space between the tiles.
        setTimeout(() => {
          // Figure out which tile to trigger a click on.
          const nextTile = currentPage * carousel.settings.tilesPerPage;
          const prevOverlayTile = nextTile - 1;
          const nextOverlayTile = ((currentPage + 1) * carousel.settings.tilesPerPage);
          // If there is a previous 'page' we need to apply the .tile--has-prev
          // class to the last tile of that page.
          _row.find(`.tile:eq(${prevOverlayTile})`).addClass('tile--has-prev').prepend('<div class="tile__hasprev"></div>');
          _row.find(`.tile:eq(${nextOverlayTile})`).addClass('tile--has-next').prepend('<div class="tile__hasnext"></div>');
          // If this row is 'active' we need to make sure the page that the user
          // is sliding to will also have an active tile.
          if (_row.hasClass('row__inner--active')) {
            // Find the next tile and activate it.
            _row.find(`.tile:eq(${nextTile})`).trigger('click');
          }
        }, 450);
      },
      // Row selectors so we don't need to select these more than once.
      // The containers and inner rows won't change since we don't dynamically
      // add tiles to a page.
      rows: {
        containers: $('.row__container'),
        inner: $('.row__inner'),
      },
      // Init the carousel
      init() {
        // Loads the tiles. Wrapped in a function so we can use this for window resizing.
        const loader = () => {
          // How much padding should be in each row on each side.
          // Assume there are 2 sides and you need to write rowPadding twice.
          const rowPadding = 40;
          // Set the tiles per page for the user based on the windowWidth
          const windowWidth = $(window).outerWidth(true);
          if (windowWidth >= 1366) {
            this.settings.tilesPerPage = 6;
            this.settings.tileHoverState = true;
          } else if (windowWidth >= 1024) {
            this.settings.tilesPerPage = 5;
            this.settings.tileHoverState = true;
          } else if (windowWidth >= 768) {
            this.settings.tilesPerPage = 4;
            this.settings.tileHoverState = false;
          } else if (windowWidth >= 425) {
            this.settings.tilesPerPage = 3;
            this.settings.tileHoverState = false;
          } else {
            this.settings.tilesPerPage = 2;
            this.settings.tileHoverState = false;
          }

          // Remove ALL scaling classes.
          $('.tile--scale-left, tile--scale-right').removeClass('tile--scale-left tile--scale-right');
          $('.tile__hasprev, .tile__hasnext').remove();

          // Remove the 2 paddings on the left and right.
          let width = $(window).outerWidth(true) - rowPadding - rowPadding;
          // 5px (2.5px on each side) per tile.
          let totalTilePadding = this.settings.tilesPerPage * 5; // eslint-disable-line prefer-const
          // Remove the tile padding. Now we're dealing with JUST tile sizes; no padding
          width -= totalTilePadding;
          // Screen width, divided by number of tiles, gives us tile width (without padding)
          let tileWidth = (width / this.settings.tilesPerPage); // eslint-disable-line prefer-const
          // 16:9 the images
          let tileHeight = tileWidth * 0.5625; // eslint-disable-line prefer-const
          // Change the tile and tile__img sizes.
          // Change the transition times and delay to 0s so they scale quickly.
          $('.tile, .tile__img').css({
            width: tileWidth,
            height: tileHeight,
            // Remove the transition tile. Re apply it after.
            '-webkit-transition': '0s',
            transition: '0s',
            'transition-delay': '0s',
          });
          // Re-apply the transition times and delay.
          // 450ms is the 'magic' waiting time with this project.
          setTimeout(() => {
            $('.tile, .tile__img').css({
              '-webkit-transition': '',
              transition: '',
              'transition-delay': '',
            });
          }, 450);
          // Set the tile width
          this.settings.tileWidth = tileWidth;
          this.rows.inner.attr('data-tiles', this.settings.tilesPerPage);
          // Remove all arrow styling.
          // These classes may never be removed at this point, but this is to ensure
          // the consistency of the tiles.
          $('.tile--has-next, .tile--has-prev')
            .removeClass('tile--has-next tile--has-prev');
          $('.tile__hasnext, .tile__hasprev')
            .remove();
          // Loop through each container and add [data-tiles], [data-max-pages] and
          // add [data-current-page]
          this.rows.containers.each(function addDataTilesAttr(i, elem) {
            let $tiles = $(this).find('.tile'); // eslint-disable-line prefer-const
            let tiles = +$tiles.length; // eslint-disable-line prefer-const
            // Add a unique data attributes to the DOM
            $(elem).attr('data-tiles', tiles)
              .attr('data-max-pages', Math.floor(tiles / carousel.settings.tilesPerPage))
              .attr('data-current-page', 0);
            $(elem).find('.row__inner').css('right', 0);
            let counter = 1;
            $tiles.each(function setTileScaleRules(i, elem) { // eslint-disable-line no-unused-vars, no-shadow, max-len
              if (counter > carousel.settings.tilesPerPage) {
                counter = 1;
              }
              if (counter === 1) {
                $(this).addClass('tile--scale-right');
              } else if (counter === carousel.settings.tilesPerPage) {
                $(this).addClass('tile--scale-left')
                  .next()
                  .addClass('tile--has-next')
                  .prepend('<div class="tile__hasnext"></div>');
              } else {
                $(this).addClass('tile--scale-center');
              }
              if (i > carousel.settings.tilesPerPage) {
                // $(this).hide();
              }
              counter += 1;
            }); // End $tiles.each()
          }); // End this.rows.containers.each()
        }; // End loader()
        // Resize tiles when the viewport changes
        window.onresize = () => {
          // Change the visible tiles. That's all.
            loader();
          // Deactivate all tiles.
          $('.tile--active').trigger('click');
        };
        // Load the carousel.
        loader();

        // Chainable method anybody?
        return this;
      },
    };

    // A wrapper for the jquery ajax request.
    const ajax = function performAjax(
      page,
      object,
      beforeCallback,
      doneCallback,
      failedCallback,
      alwaysCallback) {
      $.ajax({
        type: 'GET',
        url: `ajax/${page}.html`,
        data: object,
        dataType: 'json',
        async: true,
        beforeSend(xhr, options) { // eslint-disable-line no-unused-vars
          // Before we send anything.
          if (beforeCallback !== undefined && beforeCallback !== '') {
            beforeCallback(xhr);
          }
          // How to abort this request.
          // xhr.abort();
          // return false;
        },
        headers: {
          api_key: '', // Your custom API key, if needed.
        },
        statusCode: {
          500() {
            alert('500: This is a serious error.\rPlease report this.'); // eslint-disable-line no-alert
            return false;
          },
          404(e) {
            alert('Missing ajax page'); // eslint-disable-line no-alert
            console.log(e); // eslint-disable-line no-console
            return false;
          },
        },
      })
      .done((data) => {
        // What to do when a response is sent back.
        if (doneCallback !== undefined && doneCallback !== '') {
          doneCallback(data);
        }
        return true;
      })
      .fail((e) => {
        // What to do when the request fails.
        if (failedCallback !== undefined && failedCallback !== '') {
          failedCallback();
        }
        // Do not display any 404 errors from the error section
        if (e.status === 404) {
          // The ajax request returned a 404 status.
          alert(404); // eslint-disable-line no-alert
        } else {
          // Some other status was returned.
        }
        return false;
      })
      .always((data) => {
        // Regardless of the outcome, always run this code.
        if (alwaysCallback !== undefined && alwaysCallback !== '') {
          alwaysCallback(data);
        }
        return true;
      });
    };

    // Close any opened menus.
    const closeOpenedMenus = () => {
      if ($('.js-menu-opened').length) {
        console.log('CLOSING MENU');
        $('.js-menu-opened')
          .attr('data-menu-open', 'false')
          .next()
          .slideUp(75)
          .parent()
          .find('.dropdown__trigger')
          .removeClass('js-menu-opened');
      }
    };

    /**
     * Format the star rating. Turns a float into stars.
     * Only gives full and half stars.
     * Returns html for Font Awesome's stars.
     */
    const formStarsFromRating = function fontAwesomeStarsFromNumber(ratingArg) {
      // Yes, these vars are lets, not consts, they can change each time the function runs.
      let rating = parseFloat(ratingArg); // eslint-disable-line prefer-const
      // Full stars
      let full = Math.floor(rating); // eslint-disable-line prefer-const
      // If there is a half star or not (anything over a full int)
      let half = (full < rating) ? true : false; // eslint-disable-line
      let html = '';
      for (let i = 1; i <= full; i += 1) {
        html += '<i class="fa fa-star"></i> ';
      }
      // Add the half star, if needed.
      if (half) {
        html += '<i class="fa fa-star-half"></i>';
      }

      // If a course has a 4.5 rating or higher, give them golden stars!
      if (rating >= 4.5) {
        return `<div style='color:#8c8c15;'>${html}</div>`;
      }
      return html;
    };

    $(document)
      // Mouseover event: When a row is moused over that's not active or loading, and a tile is
      // hovered that's not active or acting as a next button, set the tile scaling classes.
      .on('mouseover',
          '.row__inner:not(.row__inner--active):not(.row__inner--images-loading) .tile:not(.tile--active):not(.tile--has-next):not(.tile--has-prev):not(.tile--sliding)',
          function setTileScaling(e) {
            // Vars
            let left;
            let moveTilesRight;
            let moveTilesLeft;
            let scaleTileLeft;
            if (carousel.settings.tileHoverState) {
              carousel.log('Tile hovered');
              /* eslint-disable */
              let $t = $(this);
              let tileWidth = $t.outerWidth(true);
              let scaledWidth = $t.outerWidth(true) * 2;
              /* eslint-enable */

              if ($t.hasClass('tile--scale-center')) {
                // Center tile.
                left = -(scaledWidth / 2 / 2);
                moveTilesRight = (left / -1);
                moveTilesLeft = left;
                scaleTileLeft = (left / 2);
              } else if ($t.hasClass('tile--scale-right')) {
                // Left tile
                left = -(scaledWidth / 2 / 2);
                moveTilesRight = scaledWidth / 2;
                moveTilesLeft = 0;
                scaleTileLeft = 0;
              } else if ($t.hasClass('tile--scale-left')) {
                // Right tile.
                left = -(scaledWidth / 2 / 2);
                moveTilesRight = (scaledWidth / 2);
                moveTilesLeft = -(scaledWidth / 2);
                scaleTileLeft = left;
              }

              // Close any opened menus
              closeOpenedMenus();

              $(this).addClass('tile--hovered').css({
                transform: `translateZ(0) scale(2) translate3d(${scaleTileLeft}px, 0px, 0px) `,
                // When scale()ing, add a tiny zoom to add clarity to text
              });

              $t.prevAll().addClass('tile--hovered-prev').css({
                transform: `translate3d(${moveTilesLeft}px, 0, 0)`,
              });

              $t.nextAll().addClass('tile--hovered-next').css({
                transform: `translate3d(${moveTilesRight}px, 0, 0)`,
              });
            } // End if carousel.settings.tileHoverState
            return e.preventDefault();
          })

      // Mouseout event: When the tile is no longer hovered, remove classes
      .on('mouseout', '.tile--hovered', function tileUnhovered() {
        carousel.log('Stop tile hover');
        let $t = $(this); // eslint-disable-line prefer-const
        $(this).removeClass('tile--hovered').css({
          transform: '',
        });

        $t.prevAll().addClass('tile--hovered-prev').css({
          transform: '',
        });

        $t.nextAll().addClass('tile--hovered-next').css({
          transform: '',
        });
      })

      // Click event: When an unactivated and unused tile is clicked, ajax the course information
      // By 'unused' we mean it's not being used as a next or prev tile
      .on('click', '.tile:not(.tile--active):not(.tile--has-prev):not(.tile--has-next)', function acctivateTile(e) {
        carousel.log('Tile clicked');

        // Close any opened menus
        closeOpenedMenus();

        let $t = $(this); // eslint-disable-line prefer-const
        $t.trigger('mouseout');
        let id = $t.attr('data-id'); // eslint-disable-line prefer-const
        let $row = $t.closest('.row__inner'); // eslint-disable-line prefer-const
        let $container = $t.closest('.row__container'); // eslint-disable-line prefer-const
        let $preview = $container.find('.preview__container'); // eslint-disable-line prefer-const
        // The default timeout amount.
        // We keep this at zero, unless the user is switching from one tile to a different tile in
        // the same row. Then we add a short timeout to make the transition feel nicer.
        let timeoutAmount = 0;
        // Preview is changing
        $preview.addClass('preview__container--changing');
        // If a different active tile was clicked while one is already active.
        if ($row.hasClass('row__inner--active')) {
          $row.find('.tile--active').removeClass('tile--active');
          timeoutAmount = 450;
        } else if ($('.tile--active').length) {
          // Look for any other .tile--active and close it now.
          // We don't want 2 preview windows open at the same time.
          // Remember, too much information on one page at any given time
          // significantly reduces the users experience.
          $('.tile--active').each(function loopActiveTiles() {
            $(this).removeClass('tile--active').closest('.row__inner--active').removeClass('row__inner--active');
          });
          timeoutAmount = 1500;
        }
        // Make this tile active.
        $t.addClass('tile--active');
        // Set the row__outer contents
        const setOuterRowContents = function setPreviewContent(dataObj) {
          // Make the .row__inner 'active' as well
          $row.addClass('row__inner--active');

          // Replace areas inside the $preview element.
          $preview.find('.preview__title').text(dataObj.name).attr('href', dataObj.url);
          $preview.find('.preview__rating').html(formStarsFromRating(dataObj.rating)).attr('data-rating', dataObj.rating);
          $preview.find('.preview__description').html(dataObj.description);
          $preview.find('.course__img').attr('src', dataObj.image);
          $preview.find('.preview__take-course').attr('href', dataObj.url);

          // Create new list HTML and overwrite the .preview__lists element
          let html = '';

          // Add the teachers list.
          if (dataObj.lists.teachers !== undefined) {
            // Build the teachers list.
            html += '<div class="preview__teachers">' +
                      `<p class='inline'>${dataObj.lists.teachers.displayName}: </p>` + // Trailing space required
                      '<ul class="preview__list">';

            // Use `for` loops because Object.keys() is IE9+
            for (let i in dataObj.lists.teachers.points) { // eslint-disable-line no-restricted-syntax, max-len, prefer-const
              if (dataObj.lists.teachers.points[i].profile !== undefined) {
                // There IS a profile url
                html += `<li class="preview__item"><a href='${dataObj.lists.teachers.points[i].profile}' class='preview__url'>${dataObj.lists.teachers.points[i].name}</a></li></li>`;
              } else {
                // There is not a profile url
                html += `<li class="preview__item">${dataObj.lists.teachers.points[i].name}</li>`;
              }
            }

            html += '</ul></div>';
          }

          // Add the about list.
          if (dataObj.lists.about !== undefined) {
            // Build the about list.
            html += `<div class="preview__about"><p class='inline'>${dataObj.lists.about.displayName}: </p><ul class="preview__list">`;

            // Use `for` loops because Object.keys() is IE9+
            for (let i in dataObj.lists.about.points) { // eslint-disable-line
              // Build the about list.
              html += `<li class='preview__item'>${dataObj.lists.about.points[i]}</li>`;
            }

            html += '</ul></div>';
          }

          // If this course offers a certificate or not.
          if (dataObj.certificate) {
            html += '<div class="preview__certificate"><p class="inline">Certificate of Completion Offered <i class="fa fa-certificate" style="color:#8c8c15"></i></p></div>';
          }

          // Set the lists area.
          $preview.find('.preview__lists').html(html);
          // Whether or not there's a video for this tile, we still need to
          // dispose of the current video.
          if (carousel.player) {
            carousel.player.dispose();
            carousel.player = false;
          }

          if (dataObj.videos.hasVideo) {
            $preview.find('.preview__video').show();
            $preview.find('.preview__img').hide();
            // We MUST create a new DOM section in order to load new videos
            $('.preview__video', $preview)
              .html('<div class="embed-responsive embed-responsive-16by9">' +
                      `<video class="embed-responsive-item video-player video-js vjs-default-skin" poster="${dataObj.image}">` +
                        '<p class="vjs-no-js">' +
                          'To view this video please enable JavaScript, and consider upgrading to a web browser that' +
                          '<a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>' +
                        '</p>' +
                      '</video>' +
                    '</div>');
            // The preview section of the .row__outer
            const videoArea = $('.video-player', $preview);
            // New video area id. Renew every time the  play button is pressed.
            const videoId = `video_${dataObj.id}`;
            // Add the new id to the video area div
            videoArea.attr('id', videoId);
            carousel.player = videojs(videoId, { // eslint-disable-line no-undef
              controls: true,
              preload: 'auto',
              // poster: dataObj.preview.thumb_lg,
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
              // var id = carousel.player.id();
              // Update the video sources.
              carousel.player.updateSrc(dataObj.videos.sources);

              // Resize the player
              function resizeVideoJS() {
                if (carousel.player) {
                  const playerId = carousel.player.id(); // eslint-disable-line prefer-const
                  const playerWidth = document.getElementById(playerId).parentElement.offsetWidth;
                  carousel.player.width(playerWidth).height(playerWidth * 0.5625);
                }
              }
              // Initialize resizeVideoJS()
              resizeVideoJS();
              // Then on resize call resizeVideoJS()
              window.onresize = resizeVideoJS;
            });
          } else { // end hasVideo
            // Does not have a video, just an image.
            $preview.find('.preview__video').hide();
            $preview.find('.preview__img').attr('src', dataObj.image).show();
          }
          // Wait (maybe) for the preview area to change.
          setTimeout(() => {
            $preview.removeClass('preview__container--changing');
            // Scrol to the content
            $('html, body').animate({
              scrollTop: $container.offset().top - $nav.outerHeight(true),
            }, 450);
          }, timeoutAmount);
        };
        // Set global var 'aTileIsActive' to true
        carousel.settings.aTileIsActive = true;
        // If this tile has not been cached yet, make the ajax request and cache it.
        if (carousel.cache[id] === undefined) {
          // Get the new tile information
          ajax('get-tile-preview', { id: id },
            function ajaxStart(start) { // eslint-disable-line
              // Do something when starting
            },
            function ajaxSuccess(data) { // eslint-disable-line
              // Set the data.
              setOuterRowContents(data);
              // Cache this object so we don't need to call for it again later.
              carousel.cache[$t.attr('data-id')] = data;
            },
            function ajaxFailed(failed) { // eslint-disable-line
              // Ajax failed
              // Make this tile inactive.
              $t.removeClass('tile--active');
            });
        } else {
          // Tile ajax request was cached; re-use whatever was collected from earlier.
          setOuterRowContents(carousel.cache[id]);
        }
        return e.preventDefault();
      }) // End on click event

      // Click event: When an active tile is clicked, take this action.
      .on('click', '.tile--active', function deactivateTile(e) {
        carousel.log('Active tile clicked');

        // Close any opened menus
        closeOpenedMenus();

        // Remove the active state
        // Remove the active state on the row
        $(this).removeClass('tile--active').closest('.row__inner').removeClass('row__inner--active');
        // Destroy the player
        if (carousel.player) {
          carousel.player.dispose();
          carousel.player = false;
        }

        return e.preventDefault();
      })

      // Click event: The next or previous tiles are being clicked.
      .on('click', '.tile--has-next, .tile--has-prev', function scrollTiles(e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        // Close any opened menus
        closeOpenedMenus();

        carousel.log('Next|Prev clicked');
        // The tile that's being clicked
        const $t = $(this);
        // Row container selector
        const $container = $t.closest('.row__container');
        // Inner row container
        const $row = $container.find('.row__inner');
        $row.find('.tile').show();
        // How far to move the row.
        const move = (carousel.settings.tileWidth * carousel.settings.tilesPerPage)
                   + (carousel.settings.tilesPerPage * 5.5);
        // Which direction to move the row
        const direction = $t.hasClass('tile--has-next') ? '+=' : '-=';
        // Row data.
        let currentPage = +$container.attr('data-current-page');
        currentPage += ($t.hasClass('tile--has-next') ? 1 : -1);
        // Remove the arrows
        $row.find('.tile__hasnext, .tile__hasprev').remove();
        // Remove overlaying elements and the classes that allow sliding actions
        $row.find('.tile--has-prev, .tile--has-next').removeClass('tile--has-prev tile--has-next');
        // Update the [data-current-page] attribute
        $container.attr('data-current-page', currentPage);
        // All tiles need to be 'sliding'
        $row.find('.tile').addClass('tile--sliding');
        // Animate the styling.
        $row.css({
          right: direction + move,
        });
        // Removing the tile--sliding class
        setTimeout(() => {
          // Remove tile--sliding
          $('.tile--sliding').removeClass('tile--sliding');
        }, 500);
        // Set the new scroll arrows (called buttons)
        carousel.setScrollButtons($row, currentPage);
      })

      // Keyup event: When esc is pressed, close all tiles.
      //              When left arrow is pressed with an open tile, move the active tile left
      //              When rightarrow is pressed with an open tile, move the active tile right
      .on('keyup', document, function keyboardController(e) {
        if (e.keyCode === 27 && carousel.settings.aTileIsActive) {
          carousel.log('Esc pressed; closing all tiles.');
          // Deactivate all tiles.
          $('.tile--active').trigger('click');
        } else if (e.keyCode === 39 && carousel.settings.aTileIsActive) {
          // There's at least one active tile somewhere and the right arrow was pressed.
          // This will only work with ONE tile at a time.
          carousel.log('Right arrow pressed');
          if ($('.tile--active').length === 1) {
            $('.tile--active:first').next().trigger('click');
          }
        } else if (e.keyCode === 37 && carousel.settings.aTileIsActive) {
          // There's at least one active tile somewhere and the left arrow was pressed.
          // This will only work with ONE tile at a time.
          carousel.log('Left arrow pressed');
          if ($('.tile--active').length === 1) {
            $('.tile--active:first').prev().trigger('click');
          }
        }

        return e.preventDefault();
      })

      // Click event: When a non-active and non-hovered tile is clicked, switch active tiles.
      // Currently this goes unused, but may be used in the future.
      .on('click', '.tile:not(.tile--active):not(.tile--hovered)', function switchActiveTile(e) {
        // Close any opened menus
        closeOpenedMenus();

        carousel.log('Switching tiles');
        return e.preventDefault();
      })

      // Click event: When a navigation dropdown menu is clicked; open or close it.
      .on('click', '.dropdown__trigger', function toggleNavDropdowns(e) {
        const $t = $(this);
        let isMenuOpen = $t.attr('data-menu-open') === 'true' ? true : false;

        if (!isMenuOpen) {
          // This menu is not open. Open it.
          $t.next().slideDown(75, () => {
            $t.addClass('js-menu-opened')
              .attr('data-menu-open', 'true');
            isMenuOpen = true;
          });
        } else {
          // This menu is open. Close it.
          $t.next().slideUp(75, () => {
            $t.removeClass('js-menu-opened')
              .attr('data-menu-open', 'false');
            isMenuOpen = false;
          });
        }
        return e.preventDefault();
      })

      // Submit event: When the search form is submitted, check if there is anything to serach for.
      // If there isn't any text in the search field, prevent default.
      .on('submit', '#search', function checkForEmptyField(e) {
        const inputField = $(this).find('input:first');
        const val = $.trim(inputField.val());

        if (!val.length) {
          inputField.focus();
          return e.preventDefault();
        }

        return true;
      })

      // Blur event: When the search form input is blurred, check if it has a value.
      // Toggle .nav__input--active as needed.
      .on('blur', '#search .nav__input', function checkForEmptyVal() {
        const $t = $(this);
        const val = $.trim($t.val());

        if (val.length) {
          // Make active
          $t.addClass('nav__input--active');
        } else {
          // Remove active class
          $t.removeClass('nav__input--active');
        }
      })

      // Click event: When the the mobile menu trigger is clicked, toggle the menu.
      .on('click', '.mobile__trigger', function toggleMobileMenu(e) {
        $mobileNav.toggleClass('mobile__nav--opened');

        if ($mobileNav.hasClass('mobile__nav--opened')) {
          // The nav is being opened
          // Cover the page with a clickable but clear div that autocloses the menu.
          $nav.after('<div class="nav__overlay js-close-mobile-menu"></div>');
        } else {
          // The nav is being closed.
          $('.nav__overlay').remove();
        }

        return e.preventDefault();
      })

      // Click event: When a mobile nav dropdown menu is being clicked.
      // Toggle the dropdown menu under it.
      .on('click', '.js-open-mobile-submenu', function toggleMobileSubMenu(e) {
        $(this).next().slideToggle(175);

        return e.preventDefault();
      })

      // Click event: When the .js-close-mobile-menu class is clicked, close the
      // mobile menu (force close)
      .on('click', '.js-close-mobile-menu', (e) => {
        $('.nav__overlay').remove();
        $mobileNav.removeClass('mobile__nav--opened');
        return e.preventDefault();
      });
      // End jQ event listeners

    // Start the carousel before the images are done loading.
    carousel.init();

    // When the page is done gathering all its assets, we can display the images.
    $(window).on('load', () => {
      carousel.log('All assets are loaded');
      // All .row__inner--images-loading
      const $rowImagesLoading = $('.row__inner--images-loading');
      // All images-loading classes need to fade out using CSS.
      $rowImagesLoading.addClass('row__inner--images-loading-fadeout');
      // Wait for 450ms (the time of the CSS transition to fade out, plus 50ms buffer)
      // before removing these classes.
      setTimeout(() => {
        $rowImagesLoading.removeClass('row__inner--images-loading row__inner--images-loading-fadeout');
      }, 450);
    });
  }); // End document.ready
})();

