# Changelog
This is to keep track of changes in a way that lets contributors *read* about what's going on, instead of looking through commits. 

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