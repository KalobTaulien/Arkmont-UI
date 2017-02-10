# Changelog
This is to keep track of changes in a way that lets contributors *read* about what's going on, instead of looking through commits. 

### Feb. 9, 2017
- `main.js` has eslinting applied to it. Don't take this as our standard, we'll go through rapid development, ignore eslint, and come back to clean it up. But we'll do our best to keep it clean. 
- Window resizing works. Max 7 tiles per page; Min 2 tiles per page. 
- Started moving css into .scss files for easier styling maintenance
- Added node http-server.
- Added `sass-watcher` to auto-compile our sass to CSS.
- Added a sample plugin to VideoJS. We'll work with this more in the future.

### Feb. 5, 2017
- Video.js was implemented. Styling added.
- When a tile is clicked, a video will show up before an image.
- Added call to action section of the preview area (`.row__outer`)
- Certificate of Completion line added to preview list area.
- Carousel has it's own .log() method that be disabled. 
- Video resolutions are easily added through the `get-tile-preview.html` json object.

### Feb. 4, 2017
- Adding video.js files for showing videos. 

### Feb. 3, 2017
- Caching was not showing the `row__outer`, it does now. 
- Cleaned up some of the css. 
- Tiles don't scale when the next or prev arrows are clicked 
- `.row__outer` title doesn't flow off the screen in mobile screens. 
- `.row__outer` has a smaller padding in mobile devices.
- Several carousel fixes including styling, and planning for the next iteration already. 

### Jan. 31, 2017
- Renamed `setup` to `carousel`. 
- Compartmentalized the functionality to a single auto-invoking function
- Moved `setScrollButtons()` out of `setup.settings{}` and into `carousel{}`
- Support for 3-7 tiles was added in the last update, but was not tested. (Removed later the same day)
- Window resizing works better. It still resets the row to the very left (shows first tile). It's still vey flawed.
- Started adding ES Linting. AirBnB style.
- Basic caching of ajax requests added for each tile. This reduces users "browsing" and accessing the api endpoint too often.
- Removed option to `setTilesPerPage`. This is now auto completed.

### Jan. 30, 2017
- Decided to revert back to using JavaScript. It was a fun experiment, but CSS simply cannot handle animations the way we need it to. We'll try again in a couple years. 
- Removed the option to set number of tiles per page. This might come back, but if it doesn't then we'll add auto-adjusting for smaller screens.
- Added `mouseover` and `mouseout` jQuery events. This will be better for mobile users who don't have a mouse.
- Changed tile padding (margin, technically) from 10px to 5px (2.5px on either side). It looks cleaner with less spacing between tiles.
- There are no callbacks anymore. It's all even listeners. 
- Removed window resizing function. We'll re-add that later when we work on the `tilesPerPage` option. 
- Changed the way the `next` and `prev` tiles show their chevron arrows. There's now a child element called `.tile__hasnext` and `.tile__hasprev` that sits inside `.tile` to lay on top of the media and content elements. This solved the problem of each row always adjusting 1px after the images load.
- `.gitignore` ignores a couple ESLinting files. We'll add linting in the near future.

#### Problems:
- Using jQuery to animate the tiles with CSS is causing tiles that have scaled to have slightly blurry text. It's not terrible, but definitely annoying. 

### Jan. 29, 2017
- Changed the way the outer row (drop down section) slides down. It uses CSS3 Transition with the `max-height` attribute instead of the `height` attribute. 
- `.tile__title` was changing sizes in different hover areas; it's now consistent. 
- All tiles have a unique `id` that can be changed in the `[data-id]` attribute of each `.tile`
- Added tile callback arg acceptance for `setup.settings.tileClickCallback` 
- Added jQuery ajax request function; used as `ajax(*page*, *object*, *before_callback*, *done_callback*, *failed_callback*, *always_callback*)`
- Added sample .html page with JSON dummy data for testing purpoes. 
- When the dropdown section (outer row) is visible and a different tile is being selected, all text areas and the course image will change to an animated gradient until the next tile is done loading.
- Added mobile meta tags. 
- `.init()` checks for localStorage support for future caching (if that's of interest).
- The use of localStorage can be disabled.
- When the window resizes; the rows reset.
- On smaller screens, a maximum of 2 or 3 tiles will display. CSS Support to come for that later.

__Notes:__ We're leaning towards removing the customized tilesPerPage setting and going with what's best for each viewport size.