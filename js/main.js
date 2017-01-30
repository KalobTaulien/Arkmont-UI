"use strict"
/* eslint linebreak-style: ["error", "windows"] */
$(document).ready(function () {
  // The setup object.
  const setup = {
    // Holds all the settings from the setup.
    settings: {
      // How many tiles should "slide" when "next" or "prev" is clicked in a row
      // 5 is the default
      tilesPerPage: 5,
      // Default tile width with it's margin
      tileWidth: 243,
      // Global variable for active tiles.
      aTileIsActive: false,
      tileClickCallback: function () {}, // Function to run when a tile becomes "active"
      tileDeactivatedCallback: function () {}, // Function to run when an active tile is no longer active
      // Allow (when possible) localStorage caching instead of object based caching 
      useLocalStorage: true,
      // Check if the user can use localStoragae or not.
      checkForLocalStorage: function() {
        // We the user has the ability to use localStorage, AND the developer has this setting enabled. 
        if(typeof Storage !== "undefined" && setup.settings.useLocalStorage) {
          setup.settings.useLocalStorage = true;
        } else {
          // No localStorage support. Disable this option.
          setup.settings.useLocalStorage = false;
        }
      },
      // _row is the row selector (jquery object)
      // currentPage is the current page number.
      setScrollButtons: function (_row, currentPage) {
        // This timer (set to 450ms) matches the css transition scroll time. 
        // This allows the scroll to happen without a blank space between the tiles.
        setTimeout(function () {
          // Figure out which tile to trigger a click on. 
          var nextTile = currentPage * setup.settings.tilesPerPage;
          var prevOverlayTile = nextTile - 1;
          var nextOverlayTile = ((currentPage + 1) * setup.settings.tilesPerPage);
          // If there is a previous "page" we need to apply the .tile--has-prev 
          // class to the last tile of that page. 
          _row.find('.tile:eq(' + prevOverlayTile + ')').addClass('tile--has-prev');
          _row.find('.tile:eq(' + (nextOverlayTile) + ')').addClass('tile--has-next')

          // If this row is "active" we need to make sure the page that the user 
          // is sliding to will also have an active tile.
          if (_row.hasClass('row__inner--active')) {
            // Find the next tile and activate it. 
            _row.find('.tile:eq(' + nextTile + ')').trigger('click');
          }
        }, 450);
      },
    },
    // Row selectors
    _rows: {
      containers: $(".row__container"),
      inner: $(".row__inner"),
    },

    // Init the carousel
    init: function (args) {

      // Force tilesPerPage with smaller devices
      if( $(window).outerWidth(true) <= 450 ) {
        // 2 tiles per page on smaller devices. 
        this.settings.tilesPerPage = 2;
      } else if( $(window).outerWidth(true) <= 768 ) {
        // If the screen is tiny, make the tiles bigger (use less; max 3) 
        this.settings.tilesPerPage = 3;
      } else if (args.tilesPerPage !== undefined) {
        // Set the tiles per page now.
        // alert('set the tiles per page');
        this.settings.tilesPerPage = args.tilesPerPage;
      } else {
        this.settings.tilesPerPage = this.settings.tilesPerPage; // default value
      }

      // If an argument is provided for the tileClickCallback, set it. 
      if (args.tileClickCallback !== undefined) {
        this.settings.tileClickCallback = args.tileClickCallback;
      }

      // If an argument is provided for the tileClickCallback, set it. 
      if (args.tileDeactivatedCallback !== undefined) {
        this.settings.tileDeactivatedCallback = args.tileDeactivatedCallback;
      }

      // If the useLocalStorage setting was given (as a boolean)
      if( typeof(args.useLocalStorage) === "boolean" ) {
        this.settings.useLocalStorage = args.useLocalStorage;
      }

      // Resize tiles when the viewport changes
      window.onresize = function (event) {
          // Window resizing is a major problem. 
          setup.init( setup.settings )
      }

      // Set the localStorage setting. 
      this.settings.checkForLocalStorage();

      // The reason we do this is to give us accurate padding on both the left and right of
      // each "page" so the prev and next buttons can exist

      // Remove the 2 paddings on the left and right.
      var width = $(window).outerWidth(true) - 40 - 40;
      // 10px per tile. 
      var totalTilePadding = this.settings.tilesPerPage * 10;
      // Remove the tile padding. Now we're dealing with JUST tile sizes; no padding
      width = width - totalTilePadding;
      // Screen width, divided by number of tiles, gives us tile width (without padding)
      var tileWidth = (width / this.settings.tilesPerPage);
      // 16:9 the images
      var tileHeight = tileWidth * 0.5625;

      // Change the tile and tile__img sizes.
      $('.tile, .tile__img').css({
        width: tileWidth,
        height: tileHeight,
      });

      // Set the tile width
      this.settings.tileWidth = tileWidth;
      this._rows.inner.attr('data-tiles', this.settings.tilesPerPage);

      // Remove all arrow styling. 
      // These classes may never be removed at this point, but this is to ensure
      // the consistency of the tiles.
      $(".tile--has-next, .tile--has-prev")
        .removeClass("tile--remove-next-prev tile--remove-next-next");

      // Loop through each container and add [data-tiles], [data-max-pages] and
      // add [data-current-page]
      this._rows.containers.each(function (i, elem) {
        let tiles = +$(this).find('.tile').length;
        // Add a unique data attributes to the DOM
        $(elem).attr('data-tiles', tiles)
          .attr('data-max-pages', Math.floor(tiles / setup.settings.tilesPerPage))
          .attr('data-current-page', 0);

        $(elem).find(".row__inner").css("right", 0)

        // While we're looping through this, we might as well 
        // add the tile--has-next classes to the proper tiles. 
        // We do it in this loop so we dont need to run the same loop twice
        if (setup.settings.tilesPerPage < tiles) {
          $(this).find('.tile:eq(' + (setup.settings.tilesPerPage) + ')')
            .addClass('tile--has-next');
        }

        // Set the "scale-left" tiles. These are tiles that, when scaling up,
        // they push the tiles before it to the left (instead of pushing the 
        // preceding tiles right.)
        for (i = i; i <= tiles; i++) {
          if (i % setup.settings.tilesPerPage == 0) {
            $(this).find('.tile:eq(' + (i - 1) + ')')
              .addClass('tile--scale-left')
          }
        }
      })

      // Chainable method
      return this;
    }
  }

  // Add a window resize method that re-inits setup.init() after mobile tiles are put together.
  setup.init({
    tilesPerPage: 5,
    useLocalStorage: true,
    // $tile is the jQ selector for the currently active .tile. 
    tileClickCallback:  function( $tile )  {
      var tileId = $tile.attr('data-id');
      console.log('Tile activated');

    },
    tileDeactivatedCallback: function () {
      console.log('Tile deactivated');
    },
  });

// A wrapper for the jquery ajax request. 
const ajax = function(page, object, before_callback, done_callback, failed_callback, always_callback) {
  $.ajax({
    type:	"GET",
    url:	'ajax/' + page + '.html', 
    data:	object,
    dataType: 'json',
    async: true,
    beforeSend: function( xhr, options ) {
      // Before we send anything. 
      if( before_callback !== undefined && before_callback != '' ) {
        before_callback();
      }

      // How to abort this request. 
      // xhr.abort();
      // return false;
    },
    headers: {
      api_key: '' // Your custom API key, if needed.
    },
    statusCode: {
      '500': function() {
          alert("500: This is a serious error.\rPlease report this.");
          return false;
        },
      '404': function(e) {
          alert("Missing ajax page");
          console.log(e);
          return false;
        }
    }
  })
  .done(function(data) {
    
    // What to do when a response is sent back.
    if(done_callback !== undefined && done_callback != '') {
      done_callback(data);
    }

    return true;
  })
  .fail(function(e) {
    // What to do when the request fails.
    if(failed_callback !== undefined && failed_callback != '') {
      failed_callback();
    }
    // Do not display any 404 errors from the error section
    if(e.status == '404') {
      // The ajax request returned a 404 status. 
    } else {
      // Some other status was returned.
    }
    return false;
  })
  .always(function(data) {
    // Regardless of the outcome, always run this code.
    if(always_callback !== undefined && always_callback != '') {
      always_callback();
    }
    return true;
  });
};

const formStarsFromRating = function(rating) {
  var rating = parseFloat( rating );
  // Full stars 
  var full = Math.floor(rating);
  // If there is a half star or not (anything over a full int)
  var half = (full < rating ? true : false);

  var html = '';
  for(var i = 1; i<=full; i++) {
    html += "<i class='fa fa-star'></i> ";
  }

  // Add the half star, if needed.
  if(half) {
    html += "<i class='fa fa-star-half'></i>"
  }

  return html;
    
}


  $(document)
    // Make a tile "active";
    // But only if it isn't already active, and isn't being covered be a "next" or "prev" block
    .on("click", ".tile:not(.tile--active, .tile--has-prev, .tile--has-next)", function (e) {

      var _t = $(this);
      var _row = _t.closest(".row__inner");
      var _container = _t.closest(".row__container");
      var _preview = _container.find('.preview__container');
      // The default timeout amount. 
      // We keep this at zero, unless the user is switching from one tile to a different tile in the same row.
      // Then we add a short timeout to make the transition feel nicer. 
      var timeoutAmount = 0;  

      _preview.addClass('preview__container--changing');

      // If the row has a row__inner--tile-last-hovered class, remove it, and remove the left margin from the first tile. 
      _row.removeClass('row__inner--tile-last-hovered').find('.tile:first').css('margin-left', 0);

      // If a different active tile was clicked while one is already active.
      if (_row.hasClass("row__inner--active")) {
        console.log('Moved active tile');
        _row.find('.tile--active').removeClass('tile--active');
        timeoutAmount = 450;
      }

      // Set global var "aTileIsActive" to true 
      setup.settings.aTileIsActive = true;

      // Get the new tile information
      ajax('get-tile-preview', {id: _t.attr('data-id')}, 
      function(start) {
        // Make this tile active.
        _t.addClass("tile--active");
        // Make the .row__inner "active" as well 
        _row.addClass("row__inner--active");
      }, 
      function(data) {
        console.log(data);
        _preview.find(".preview__title").text( data.name ).attr('href', data.url );
        _preview.find(".preview__rating").html( formStarsFromRating( data.rating ) ).attr('data-rating', data.rating);
        _preview.find(".preview__description").html( data.description )
        _preview.find(".course__img").attr( 'src', data.image )

        // Create new list HTML and overwrite the .preview__lists element 
        var html = '';
        for(var i in data.lists) {
          // i would give us "teachers" from the sample json file
          console.log(data.lists[i]);
          if(i == 'teachers') {
            // Build the teachers list. 
            html += `<div class="preview__teachers"> \
                <p class="inline">${data.lists[i]['displayName']}:</p> \
                <ul class="preview__list">`
            
            for(var i2 in data.lists[i]['points']) {
              html += `<li class="preview__item">` + 
                        (data.lists[i]['points'][i2]['profile'] !== undefined 
                          ? `<a href='${data.lists[i]['points'][i2]['profile']}' class="preview__url">${data.lists[i]['points'][i2]['name']}</a></li>` 
                          : `${data.lists[i]['points'][i2]['name']}`) +
                        `</li>`;
            }

            html += `</ul> \
                </div>`;
          } else if(i == 'about') {
            // Build the teachers list. 
            html += `<div class="preview__about"> \
                <p class="inline">${data.lists[i]['displayName']}:</p> \
                <ul class="preview__list">`
            
            for(var i2 in data.lists[i]['points']) {
              html += `<li class="preview__item">${data.lists[i]['points'][i2]}</li>`;
            }

            html += `</ul> \
                </div>`;
          }

        }
         _preview.find(".preview__lists").html( html );
         console.log(html);


        setTimeout(function() {
          _preview.removeClass('preview__container--changing');
        }, timeoutAmount)
      },
      function(failed) {
        // Ajax failed
      });

      return e.preventDefault(); 
    })

    // Make the currently "active" tile "inactive", and make the row hide details. 
    .on("click", ".tile.tile--active", function (e) {
      // Remove the active state
      $(this).removeClass('tile--active');
      // Remove the active state on the row 
      $(this).closest(".row__inner").removeClass("row__inner--active");

      setup.settings.tileDeactivatedCallback();
    })

    // Scroll the row left 
    .on("click", ".next, .tile--has-next", function (e) {
      // Row container selector 
      var _container = $(this).closest('.row__container');
      // Inner row container 
      var _row = _container.find('.row__inner');

      // Get the row data from the container 
      var _data = {
        tiles: +_container.attr('data-tiles'),
        maxPages: +_container.attr('data-max-pages'),
        currentPage: +_container.attr('data-current-page')
      };

      // If there are enough "pages" we can show the next page
      if (_data.currentPage < _data.maxPages) {
        // Check how many tiles are in the view port right now.. 
        _row.animate({
          // tileWidth x tilesPerPage; plus 10px per tile for padding
          right: '+=' + (setup.settings.tileWidth * setup.settings.tilesPerPage + (setup.settings.tilesPerPage * 10)),
        }, {
          duration: 50,
          easing: 'swing',
          start: function removePrevAndNextOverlays() {
            // Add the fact that this row was slid at least once,
            _row.addClass('row__inner--slid');
            // Don't let the tiles scale up until the sliding is finished.
            // We'll add these back if we need them later.
            _row.find('.tile--has-prev, .tile--has-next').removeClass('tile--has-prev tile--has-next');
            console.log('Slide forward started');
          },
          done: function updateCurrentPage() {
            // Update the [data-current-page] attribute 
            _data.currentPage = _data.currentPage + 1
            _container.attr('data-current-page', _data.currentPage);

            // Set the new scroll arrows (called buttons)
            setup.settings.setScrollButtons(_row, _data.currentPage);

            console.log('Slide forward done');

          },
          complete: function () {
            console.log('Slide forward complete')
          }
        })
        console.log('Slide forward');
      }
      return e.preventDefault();
    })

    // Scroll the row right
    .on("click", ".prev, .tile--has-prev", function (e) {
      // Row container selector 
      var _container = $(this).closest('.row__container');
      // Inner row container 
      var _row = _container.find('.row__inner');

      // Get the row data from the container 
      var _data = {
        tiles: +_container.attr('data-tiles'),
        maxPages: +_container.attr('data-max-pages'),
        currentPage: +_container.attr('data-current-page')
      };

      // If there are enough "pages" we can show the next page
      if (_data.currentPage > 0) {
        // Check how many tiles are in the view port right now.. 
        _row.animate({
          right: '-=' + (setup.settings.tileWidth * setup.settings.tilesPerPage + (setup.settings.tilesPerPage * 10)) // tileWidth x tilesPerPage; plus 10px per tile for padding
        }, {
          duration: 50,
          easing: 'swing',
          start: function removePrevAndNextOverlays() {
            _row.addClass('row__inner--slid');
            // We'll add these back if we need them later.
            _row.find('.tile--has-prev, .tile--has-next').removeClass('tile--has-prev tile--has-next');
            console.log('Slide back started');
          },
          done: function updateCurrentPage() {
            // Update the [data-current-page] attribute 
            _data.currentPage = _data.currentPage - 1
            _container.attr('data-current-page', _data.currentPage);

            // Set the new scroll arrows (called buttons)
            setup.settings.setScrollButtons(_row, _data.currentPage);

            console.log('Slide back done');

          },
          complete: function () {
            console.log('Slide back complete')
          }
        })
        console.log('Slide back');
      }
      return e.preventDefault();
    })

    // When the user hovers over the last tile on a page 
    .on("mouseover", ".tile.tile--scale-left:not(.tile--has-prev)", function () {
      // Get the tile before it. 
      $(this).closest('.row__inner:not(.row__inner--active)').addClass('row__inner--tile-last-hovered').find('.tile:first').css('margin-left', -$(this).outerWidth());
    })
    // When the user moves off the last tile, fix the styling 
    .on("mouseout mouseleave", ".tile.tile--scale-left", function () {
      $(this).closest('.row__inner').removeClass('row__inner--tile-last-hovered').find('.tile:first').css('margin-left', 0);
    })

    // Close all tiles when there are any active tiles, and the `esc` key is pressed.
    .on("keyup", document, function (e) {
      if (e.keyCode == 27 && setup.settings.aTileIsActive) {
        // Deactivate all tiles. 
        $(".tile--active").trigger('click');
      } else if (e.keyCode == 39 && setup.settings.aTileIsActive) {
        // There's at least one active tile somewhere and the right arrow was pressed.
        // This will only work with ONE tile at a time. 
        console.log('Right arrow pressed');
        if ($(".tile--active").length == 1) {
          $(".tile--active:first").next().trigger("click")
        }
      } else if (e.keyCode == 37 && setup.settings.aTileIsActive) {
        // There's at least one active tile somewhere and the left arrow was pressed.
        // This will only work with ONE tile at a time. 
        console.log('Left arrow pressed');
        if ($(".tile--active").length == 1) {
          $(".tile--active:first").prev().trigger("click")
        }
      }

    }) // End jQ event listeners


  // When the page is done gathering all its assets, we can display the images. 
  $(window).on("load", function () {
    console.log('All assets are loaded');
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
