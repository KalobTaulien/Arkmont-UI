/* eslint linebreak-style: ["error", "windows"] */
(function () {
  'use strict'
  // Required. This relies on jQuery and cannot exist without it. 
  $(document).ready(function () {

    // The carousel object.
    const carousel = {
      // Holds the VideoJS player object 
      player: false,
      // A cache object, used for whatever you want. 
      cache: {},
      // Holds all the settings from the carousel.
      settings: {
        // How many tiles should "slide" when "next" or "prev" is clicked in a row
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
      log: function(message) {
        if(this.settings.carouselLogEnabled) {
          console.log(message);
        }
      },
      // _row is the row selector (jquery object)
      // currentPage is the current page number.
      setScrollButtons: function (_row, currentPage) {
        // This timer (set to 450ms) matches the css transition scroll time. 
        // This allows the scroll to happen without a blank space between the tiles.
        setTimeout(function () {
          // Figure out which tile to trigger a click on. 
          var nextTile = currentPage * carousel.settings.tilesPerPage;
          var prevOverlayTile = nextTile - 1;
          var nextOverlayTile = ((currentPage + 1) * carousel.settings.tilesPerPage);
          // If there is a previous "page" we need to apply the .tile--has-prev 
          // class to the last tile of that page. 
          _row.find('.tile:eq(' + prevOverlayTile + ')').addClass('tile--has-prev').prepend("<div class='tile__hasprev'></div>");
          _row.find('.tile:eq(' + (nextOverlayTile) + ')').addClass("tile--has-next").prepend("<div class='tile__hasnext'></div>");

          // If this row is "active" we need to make sure the page that the user 
          // is sliding to will also have an active tile.
          if (_row.hasClass('row__inner--active')) {
            // Find the next tile and activate it. 
            _row.find('.tile:eq(' + nextTile + ')').trigger('click');
          }
        }, 450);
      },
      // Row selectors so we don't need to select these more than once.
      // The containers and inner rows won't change since we don't dynamically
      // add tiles to a page. 
      _rows: {
        containers: $(".row__container"),
        inner: $(".row__inner"),
      },
      // Init the carousel
      init: function () {
       
        // Loads the tiles. Wrapped in a function so we can use this for window resizing.
        var loader = () => {
          // How much padding should be in each row on each side. 
          // Assume there are 2 sides and you need to write rowPadding twice. 
          var rowPadding = 42.5;
          // Set the tiles per page for the user based on the windowWidth
          var _windowWidth = $(window).outerWidth(true);
          if( _windowWidth >= 1366 ) {
            this.settings.tilesPerPage = 6;
            this.settings.tileHoverState = true;
          } else if( _windowWidth >= 1024 ) {
            this.settings.tilesPerPage = 5;
            this.settings.tileHoverState = true;
          } else if( _windowWidth >= 768 ) {
            this.settings.tilesPerPage = 4;
            this.settings.tileHoverState = false;
          } else if( _windowWidth >= 425 ) {
            this.settings.tilesPerPage = 3;
            this.settings.tileHoverState = false;
          } else {
            this.settings.tilesPerPage = 2;
            this.settings.tileHoverState = false;
          }
          // Remove the 2 paddings on the left and right.
          var width = $(window).outerWidth(true) - rowPadding - rowPadding;
          // 5px (2.5px on each side) per tile. 
          var totalTilePadding = this.settings.tilesPerPage * 5;
          // Remove the tile padding. Now we're dealing with JUST tile sizes; no padding
          width = width - totalTilePadding;
          // Screen width, divided by number of tiles, gives us tile width (without padding)
          var tileWidth = (width / this.settings.tilesPerPage);
          // 16:9 the images
          var tileHeight = tileWidth * 0.5625;

          // Change the tile and tile__img sizes.
          // Change the transition times and delay to 0s so they scale quickly.
          $('.tile, .tile__img').css({
            width: tileWidth,
            height: tileHeight,
            // Remove the transition tile. Re apply it after. 
            '-webkit-transition': '0s',
            'transition': '0s',
            'transition-delay': '0s'
          })

          // Re-apply the transition times and delay.
          // 450ms is the "magic" waiting time with this project.
          setTimeout(function () {
            $('.tile, .tile__img').css({
              '-webkit-transition': '',
              'transition': '',
              'transition-delay': ''
            })
          }, 450);

          // Set the tile width
          this.settings.tileWidth = tileWidth;
          this._rows.inner.attr('data-tiles', this.settings.tilesPerPage);

          // Remove all arrow styling. 
          // These classes may never be removed at this point, but this is to ensure
          // the consistency of the tiles.
          $(".tile--has-next, .tile--has-prev")
            .removeClass("tile--has-next tile--has-prev")
          $(".tile__hasnext, .tile__hasprev")
            .remove();

          // Loop through each container and add [data-tiles], [data-max-pages] and
          // add [data-current-page]
          this._rows.containers.each(function (i, elem) {
            let $tiles = $(this).find('.tile');
            let tiles = +$tiles.length;
            // Add a unique data attributes to the DOM
            $(elem).attr('data-tiles', tiles)
              .attr('data-max-pages', Math.floor(tiles / carousel.settings.tilesPerPage))
              .attr('data-current-page', 0);

            $(elem).find(".row__inner").css("right", 0)

            var counter = 1;
            $tiles.each(function (i, elem) {
              if (counter > carousel.settings.tilesPerPage) {
                counter = 1;
              }

              if (counter == 1) {
                $(this).addClass("tile--scale-right");
              } else if (counter == carousel.settings.tilesPerPage) {
                $(this).addClass("tile--scale-left")
                  .next()
                  .addClass("tile--has-next")
                  .prepend("<div class='tile__hasnext'></div>");
              } else {
                $(this).addClass("tile--scale-center");
              }

              if (i > carousel.settings.tilesPerPage) {
                $(this).hide();
              }

              counter++;
            }) // End $tiles.each()
          }) // End this._rows.containers.each()
        }; // End loader()

        // Resize tiles when the viewport changes
        window.onresize = () => {
          // Change the visible tiles. That's all. 
          loader();

          // Deactivate all tiles. 
          $(".tile--active").trigger('click');
        };

        // Load the carousel.
        loader();

        // Chainable method anybody?
        return this;
      }
    }

    // A wrapper for the jquery ajax request. 
    const ajax = function (page, object, before_callback, done_callback, failed_callback, always_callback) {
      $.ajax({
          type: "GET",
          url: 'ajax/' + page + '.html',
          data: object,
          dataType: 'json',
          async: true,
          beforeSend: function (xhr, options) {
            // Before we send anything. 
            if (before_callback !== undefined && before_callback != '') {
              before_callback(xhr);
            }

            // How to abort this request. 
            // xhr.abort();
            // return false;
          },
          headers: {
            api_key: '' // Your custom API key, if needed.
          },
          statusCode: {
            '500': function () {
              alert("500: This is a serious error.\rPlease report this.");
              return false;
            },
            '404': function (e) {
              alert("Missing ajax page");
              console.log(e);
              return false;
            }
          }
        })
        .done(function (data) {
          // What to do when a response is sent back.
          if (done_callback !== undefined && done_callback != '') {
            done_callback(data);
          }

          return true;
        })
        .fail(function (e) {
          // What to do when the request fails.
          if (failed_callback !== undefined && failed_callback != '') {
            failed_callback();
          }
          // Do not display any 404 errors from the error section
          if (e.status == '404') {
            // The ajax request returned a 404 status. 
            alert(404);
          } else {
            // Some other status was returned.
          }
          return false;
        })
        .always(function (data) {
          // Regardless of the outcome, always run this code.
          if (always_callback !== undefined && always_callback != '') {
            always_callback();
          }
          return true;
        });
    };

    /**
     * Format the star rating. Turns a float into stars. 
     * Only gives full and half stars. 
     * Returns html for Font Awesome's stars.
     */
    const formStarsFromRating = function (rating) {
      var rating = parseFloat(rating);
      // Full stars 
      var full = Math.floor(rating);
      // If there is a half star or not (anything over a full int)
      var half = (full < rating ? true : false);

      var html = '';
      for (var i = 1; i <= full; i++) {
        html += "<i class='fa fa-star'></i> ";
      }

      // Add the half star, if needed.
      if (half) {
        html += "<i class='fa fa-star-half'></i>"
      }

      return html;
    };


    $(document)
      // Scale a center tile.
      // Event 
      .on("mouseover", ".row__inner:not(.row__inner--active):not(.row__inner--images-loading) .tile:not(.tile--active):not(.tile--has-next):not(.tile--has-prev):not(.tile--sliding)", function (e) {
        if( carousel.settings.tileHoverState ) {
          carousel.log("Tile hovered");
          var _t = $(this);

          var tileWidth = _t.outerWidth(true);
          var scaledWidth = _t.outerWidth(true) * 2;

          if (_t.hasClass('tile--scale-center')) {
            // Center tile. 
            var left = -(scaledWidth / 2 / 2);
            var moveTilesRight = (left / -1);
            var moveTilesLeft = left
            var scaleTileLeft = (left / 2)
          } else if (_t.hasClass('tile--scale-right')) {
            // Left tile 
            var left = -(scaledWidth / 2 / 2);
            var moveTilesRight = scaledWidth / 2;
            var moveTilesLeft = 0;
            var scaleTileLeft = 0;
          } else if (_t.hasClass('tile--scale-left')) {
            // Right tile.
            var left = -(scaledWidth / 2 / 2);
            var moveTilesRight = (scaledWidth / 2);
            var moveTilesLeft = -(scaledWidth / 2);
            var scaleTileLeft = left;
          }

          $(this).addClass('tile--hovered').css({
            transform: "translateZ(0) scale(2) translate3d(" + scaleTileLeft + "px, 0px, 0px) ",
            // When scale()ing, add a tiny zoom to add clarity to text
            zoom: "101%",
          })

          _t.prevAll().addClass('tile--hovered-prev').css({
            transform: "translate3d(" + moveTilesLeft + "px, 0, 0)"
          });
          _t.nextAll().addClass('tile--hovered-next').css({
            transform: "translate3d(" + moveTilesRight + "px, 0, 0)"
          });
        } // End if carousel.settings.tileHoverState

        return e.preventDefault();
      })
      // Event 
      .on("mouseout", ".tile--hovered", function () {
        carousel.log("Stop tile hover");
        var _t = $(this);

        $(this).removeClass('tile--hovered').css({
          transform: "",
        })
        _t.prevAll().addClass('tile--hovered-prev').css({
          transform: ""
        });
        _t.nextAll().addClass('tile--hovered-next').css({
          transform: ""
        });
      })
      // Make a tile "active";
      // But only if it isn't already active, and isn't being covered be a "next" or "prev" block
      // Event
      .on("click", ".tile:not(.tile--active):not(.tile--has-prev):not(.tile--has-next)", function (e) {
        carousel.log("Tile clicked");

        var _t = $(this);
        _t.trigger("mouseout");
        var _id = _t.attr('data-id')
        var _row = _t.closest(".row__inner");
        var _container = _t.closest(".row__container");
        var _preview = _container.find('.preview__container');
        // The default timeout amount. 
        // We keep this at zero, unless the user is switching from one tile to a different tile in the same row.
        // Then we add a short timeout to make the transition feel nicer. 
        var timeoutAmount = 0;

        // Preview is changing
        _preview.addClass('preview__container--changing');

        // If a different active tile was clicked while one is already active.
        if (_row.hasClass("row__inner--active")) {
          _row.find('.tile--active').removeClass('tile--active');
          timeoutAmount = 450;
        } else if( $(".tile--active").length ) {
          // Look for any other .tile--active and close it now. 
          // We don't want 2 preview windows open at the same time.
          // Remember, too much information on one page at any given time 
          // significantly reduces the users experience. 
          $(".tile--active").each(function(i, elem) {
            $(this).removeClass('tile--active').closest('.row__inner--active').removeClass('row__inner--active');
          });
          timeoutAmount = 500;
        }

        // Make this tile active.
        _t.addClass("tile--active");

        // Set the row__outer contents 
        var setOuterRowContents = function(data_obj) {
            
            // Make the .row__inner "active" as well 
            _row.addClass("row__inner--active");
            
            // Replace areas inside the _preview element. 
            _preview.find(".preview__title").text(data_obj.name).attr('href', data_obj.url);
            _preview.find(".preview__rating").html(formStarsFromRating(data_obj.rating)).attr('data-rating', data_obj.rating);
            _preview.find(".preview__description").html(data_obj.description);
            _preview.find(".course__img").attr('src', data_obj.image);
            _preview.find(".preview__take-course").attr('href', data_obj.url);

            // Create new list HTML and overwrite the .preview__lists element 
            var html = '';
            // Loop through each list object. It only accepts "teachers" and "about" right now. 
            for (var i in data_obj.lists) {
              // i would give us "teachers" from the sample json file
              if (i == 'teachers') {

                // Build the teachers list. 
                html += `<div class="preview__teachers">` +
                          `<p class="inline">${data_obj.lists[i]['displayName']}: </p>` + // Trailing space required
                          `<ul class="preview__list">`;

                for (var i2 in data_obj.lists[i]['points']) {
                  html += `<li class="preview__item">` +
                              (data_obj.lists[i]['points'][i2]['profile'] !== undefined 
                              ? `<a href='${data_obj.lists[i]['points'][i2]['profile']}' class="preview__url">${data_obj.lists[i]['points'][i2]['name']}</a></li>` 
                              : `${data_obj.lists[i]['points'][i2]['name']}`) +
                            `</li>`;
                }
                html += `</ul></div>`;

              } else if (i == 'about') {
                // Build the about list. 
                html += `<div class="preview__about">` +
                          `<p class="inline">${data_obj.lists[i]['displayName']}: </p>` + // Trailing space required
                          `<ul class="preview__list">`;

                for (var i2 in data_obj.lists[i]['points']) {
                  html += `<li class="preview__item">${data_obj.lists[i]['points'][i2]}</li>`;
                }
                html += `</ul></div>`;
              }
            }

            // If this course offers a certificate or not. 
            if(data_obj.certificate) {
              html += '<div class="preview__certificate"><p class="inline">Certificate of Completion Offered <i class="fa fa-certificate" style="color:#8c8c15"></i></p></div>';
            }
            // Set the lists area. 
            _preview.find(".preview__lists").html(html);

            // Whether or not there's a video for this tile, we still need to 
            // dispose of the current video. 
            if( carousel.player ) {
              carousel.player.dispose();
              carousel.player = false;
            }

            if( data_obj.videos.hasVideo ) {
              _preview.find('.preview__video').show();
              _preview.find('.preview__img').hide();

              // We MUST create a new DOM section in order to load new videos 
              $(".preview__video", _preview)
                .html('<div class="embed-responsive embed-responsive-16by9">'+
                        '<video class="embed-responsive-item video-player video-js vjs-default-skin" poster="'+data_obj.image+'">' +
                          '<p class="vjs-no-js">' +
                            'To view this video please enable JavaScript, and consider upgrading to a web browser that' +
                            '<a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>' +
                          '</p>' +
                        '</video>' + 
                      '</div>');
              var _video_area = $(".video-player", _preview);
              // New video area id. Renew every time the  play button is pressed. 
              var video_id = 'video_'+data_obj.id;
              // Add the new id to the video area div 
              _video_area.attr('id', video_id);
              carousel.player = videojs( video_id, {
                controls: true,
                preload: "auto",
                //poster: data_obj.preview.thumb_lg,
                playbackRates: [0.5, 1, 1.25, 1.5, 2],
                autoplay: false, 
                plugins: {
                  videoJsResolutionSwitcher: {
                    default: 720,
                    dynamicLabel: false
                  }
                }
              }, function() {
                // If need the videojs playerr id we can use this method: 
                // var id = carousel.player.id();

                // Update the video sources. 
                carousel.player.updateSrc(data_obj.videos.sources)
                
                function resizeVideoJS(){
                  var id = carousel.player.id();
                  var width = document.getElementById(id).parentElement.offsetWidth;
                  carousel.player.width(width).height( width * 0.5625 );
                }

                // Initialize resizeVideoJS()
                resizeVideoJS();
                // Then on resize call resizeVideoJS()
                window.onresize = resizeVideoJS; 

              });	

            } // end hasVideo 
            else {
              // Does not have a video, just an image. 
              _preview.find('.preview__video').hide();
              _preview.find('.preview__img').attr('src', data_obj.image).show();
            }

            // Wait (maybe) for the preview area to change. 
            setTimeout(function () {
              _preview.removeClass('preview__container--changing');
              // Scrol to the content 
              $('html, body').animate({
                  scrollTop: _container.offset().top
              }, 450);
            }, timeoutAmount)
        };

        // Set global var "aTileIsActive" to true 
        carousel.settings.aTileIsActive = true;

        // If this tile has not been cached yet, make the ajax request and cache it. 
        if( carousel.cache[ _id ] === undefined ) {
          // Get the new tile information
          ajax('get-tile-preview', {id: _id},
            function (start) {
              // Do something when starting 
            },
            function (data) {
              // Set the data. 
              setOuterRowContents( data );
              // Cache this object so we don't need to call for it again later.
              carousel.cache[ _t.attr('data-id') ] = data;
           },
            function (failed) {
              // Ajax failed
              // Make this tile inactive.
              _t.removeClass("tile--active");
           });
        } else {
          // Tile ajax request was cached; re-use whatever was collected from earlier.
          setOuterRowContents( carousel.cache[ _id ] );
        }

        return e.preventDefault();
      }) // End on click event 
      // Make the currently "active" tile "inactive", and make the row hide details. 
      // Event 
      .on("click", ".tile--active", function (e) {
        carousel.log("Active tile clicked");

        // Remove the active state
        $(this).removeClass('tile--active');
        // Remove the active state on the row 
        $(this).closest(".row__inner").removeClass("row__inner--active");
        // Destroy the player
        if( carousel.player ) {
          carousel.player.dispose();
          carousel.player = false;
        }
      })

      // Scroll the row left 
      // Event 
      .on("click", ".tile--has-next, .tile--has-prev", function (e) {
        carousel.log("Next|Prev clicked");

        var _t = $(this);
        e.preventDefault();
        e.stopImmediatePropagation();

        // Row container selector 
        var _container = _t.closest('.row__container');
        // Inner row container 
        var _row = _container.find('.row__inner');

        _row.find(".tile").show();
        // How far to move the row. 
        var move = (carousel.settings.tileWidth * carousel.settings.tilesPerPage) + (carousel.settings.tilesPerPage * 6.5);
        // Which direction to move the row
        var direction = _t.hasClass('tile--has-next') ? "+=" : "-=";
        // Row data. 
        var maxPages = +_container.attr('data-max-pages');
        var currentPage = +_container.attr('data-current-page');
        currentPage = currentPage + (_t.hasClass('tile--has-next') ? 1 : -1)

        // Remove the arrows
        _row.find(".tile__hasnext, .tile__hasprev").remove();
        // Remove overlaying elements and the classes that allow sliding actions
        _row.find('.tile--has-prev, .tile--has-next').removeClass('tile--has-prev tile--has-next');
        // Update the [data-current-page] attribute 
        _container.attr('data-current-page', currentPage);
        // All tiles need to be "sliding" 
        _row.find(".tile").addClass('tile--sliding');
        // Animate the styling.
        _row.css({
          right: direction + move,
        });

        // Removing the tile--sliding class
        setTimeout(function() {
          // Remove tile--sliding 
          $(".tile--sliding").removeClass("tile--sliding");
        }, 500)
        // Set the new scroll arrows (called buttons)
        carousel.setScrollButtons(_row, currentPage);
      })

      // Close all tiles when there are any active tiles, and the `esc` key is pressed.
      .on("keyup", document, function (e) {
        if (e.keyCode == 27 && carousel.settings.aTileIsActive) {
          carousel.log("Esc pressed; closing all tiles.");
          // Deactivate all tiles. 
          $(".tile--active").trigger('click');
        } else if (e.keyCode == 39 && carousel.settings.aTileIsActive) {
          // There's at least one active tile somewhere and the right arrow was pressed.
          // This will only work with ONE tile at a time. 
          carousel.log('Right arrow pressed');
          if ($(".tile--active").length == 1) {
            $(".tile--active:first").next().trigger("click")
          }
        } else if (e.keyCode == 37 && carousel.settings.aTileIsActive) {
          // There's at least one active tile somewhere and the left arrow was pressed.
          // This will only work with ONE tile at a time. 
          carousel.log('Left arrow pressed');
          if ($(".tile--active").length == 1) {
            $(".tile--active:first").prev().trigger("click")
          }
        }

      }) 
      
      // When an inactive tile is clicked, trigger a hover effect. 
      // This can be used when another tile is active and tile scaling isn't 
      // available. 
      .on("click", ".tile:not(.tile--active):not(.tile--hovered)", function(e) {
        carousel.log("Switching tiles");
        return e.preventDefault();
      }) // End jQ event listeners

    // Start the carousel BEFORE the window is done loading all the images 
    carousel.init();

    // When the page is done gathering all its assets, we can display the images. 
    $(window).on("load", function () {
      carousel.log('All assets are loaded');
      setTimeout(function () {
        // All .row__inner--images-loading 
        const _rowImagesLoading = $('.row__inner--images-loading');
        // All images-loading classes need to fade out using CSS.
        _rowImagesLoading.addClass('row__inner--images-loading-fadeout');
        // Wait for 500ms (the time of the CSS transition to fade out, plus 50ms buffer) before removing these classes.
        setTimeout(function () {
          _rowImagesLoading.removeClass('row__inner--images-loading row__inner--images-loading-fadeout');
        }, 450);
      }, 1000)
    })

  }); // End document.ready

})();
