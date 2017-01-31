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
      tileWidth: 253,
      // Global variable for active tiles.
      aTileIsActive: false,
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
    },
    // Row selectors
    _rows: {
      containers: $(".row__container"),
      inner: $(".row__inner"),
    },

    // Init the carousel
    init: function (args) {

      // Default tiles per page 
      this.settings.tilesPerPage = 5;

      // Resize tiles when the viewport changes
      window.onresize = function (event) {
          // Change the visible tiles. That's all. 
      }
      
      // Remove the 2 paddings on the left and right.
      // 5px (2.5px on each side) per tile. 
      var width = $(window).outerWidth(true) - 42.5 - 42.5;
      var totalTilePadding = this.settings.tilesPerPage * 5;
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
        .removeClass("tile--remove-next-prev tile--remove-next-next")
        .find(".tile__hasnext, .tile__hasprev")
        .remove();

      // Loop through each container and add [data-tiles], [data-max-pages] and
      // add [data-current-page]
      this._rows.containers.each(function (i, elem) {
        let $tiles = $(this).find('.tile');
        let tiles = +$tiles.length;
        // Add a unique data attributes to the DOM
        $(elem).attr('data-tiles', tiles)
          .attr('data-max-pages', Math.floor(tiles / setup.settings.tilesPerPage))
          .attr('data-current-page', 0);

        $(elem).find(".row__inner").css("right", 0)

        // While we're looping through this, we might as well 
        // add the tile--has-next classes to the proper tiles. 
        // We do it in this loop so we dont need to run the same loop twice
        if (setup.settings.tilesPerPage < tiles) {
         // $(this).find('.tile:eq(' + (setup.settings.tilesPerPage) + ')')

        }

        var counter = 1;
        $tiles.each(function(i, elem) {
          if( counter > setup.settings.tilesPerPage ) {
            counter = 1;
          }
          
          $(this).attr('counter', counter)

          if( counter == 1 ) {
            $(this).addClass("tile--scale-right");
          } else if( counter == setup.settings.tilesPerPage ) {
            $(this).addClass("tile--scale-left")
              .next()
              .addClass("tile--has-next")
              .prepend("<div class='tile__hasnext'></div>");
          } else {
            $(this).addClass("tile--scale-center");
          }

          if(counter == setup.settings.tilesPerPage+1) {
            alert(1);
          }

          counter++;
        })

        
      })

      // Chainable method
      return this;
    }
  }

  // Add a window resize method that re-inits setup.init() after mobile tiles are put together.
  setup.init({
    tilesPerPage: 5
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
    // Scale a center tile.
    .on("mouseover", ".row__inner:not(.row__inner--active) .tile:not(.tile--active, .tile--has-next, .tile--has-prev)", function() {

      var _t = $(this);

      var scaledWidth = _t.outerWidth(true) * 2;

      if( _t.hasClass('tile--scale-center') ) {
        // Center tile. 
        var left = -(scaledWidth / 2 / 2);
        var moveTilesRight = (left / -1);
        var moveTilesLeft = left
        var scaleTileLeft = (left/2)
      } else if( _t.hasClass('tile--scale-right') ) {
        // Left tile 
        var left = -(scaledWidth / 2 / 2);
        var moveTilesRight = scaledWidth / 2;
        var moveTilesLeft = 0;
        var scaleTileLeft = 0;
      } else if( _t.hasClass('tile--scale-left') ) {
        // Right tile.
        var left = -(scaledWidth / 2 / 2);
        var moveTilesRight = (scaledWidth / 2);
        var moveTilesLeft = -(scaledWidth / 2);
        var scaleTileLeft = left;
      }

      $(this).addClass('tile--hovered').css({
        transform: "scale(2) translate3d("+scaleTileLeft+"px, 0, 0)",
      })
      _t.prevAll().addClass('tile--hovered-prev').css({
        transform: "translate3d("+moveTilesLeft+"px, 0, 0)"
      });
      _t.nextAll().addClass('tile--hovered-next').css({
        transform: "translate3d("+moveTilesRight+"px, 0, 0)"
      });
    })
    .on("mouseout", ".tile--hovered", function() {
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
    .on("click", ".tile:not(.tile--active, .tile--has-prev, .tile--has-next)", function (e) {

      var _t = $(this);
      _t.trigger("mouseout");
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
    .on("click", ".tile--has-next, .tile--has-prev", function (e) {

      var _t = $(this);

      // Row container selector 
      var _container = _t.closest('.row__container');
      // Inner row container 
      var _row = _container.find('.row__inner');

      // How far to move the row. 
      var move = (setup.settings.tileWidth * setup.settings.tilesPerPage + (setup.settings.tilesPerPage * 5));
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
      // Animate the styling.
      _row.css({
        right: direction + move,
      })
      // Set the new scroll arrows (called buttons)
      setup.settings.setScrollButtons(_row, currentPage);
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
