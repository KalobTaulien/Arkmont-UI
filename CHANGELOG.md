# Changelog
This is to keep track of changes in a way that lets contributors *read* about what's going on, instead of looking through commits. 

### Jan. 30, 2017
- Decided to revert back to using JavaScript. It was a fun experiment, but CSS simply cannot handle animations the way we need it to. We'll try again in a couple years. 
- Removed the option to set number of tiles per page. This might come back, but if it doesn't then we'll add auto-adjusting for smaller screens.
- Added `mouseover` and `mouseout` jQuery events. This will be better for mobile users who don't have a mouse.
- Changed tile padding (margin, technically) from 10px to 5px (2.5px on either side). It looks cleaner with less spacing between tiles.
- There are no callbacks anymore. It's all even listeners. 
- Removed window resizing function. We'll re-add that later when we work on the `tilesPerPage` option. 
- Changed the way the `next` and `prev` tiles show their chevron arrows. There's now a child element called `.tile__hasnext` and `.tile__hasprev` that sits inside `.tile` to lay on top of the media and content elements. This solved the problem of each row always adjusting 1px after the images load.
- `.gitignore` ignores a couple ESLinting files. We'll add linting in the near future.

__Problems__:
- Using jQuery to animate the tiles with CSS is causing tiles that have scaled to have slightly blurry text. It's not terrible, but definitely annoying. 
- 


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