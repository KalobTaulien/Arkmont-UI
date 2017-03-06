# Changelog
This is to keep track of changes in a way that lets contributors *read* about what's going on, instead of looking through commits.

### Mar. 4, 2017
- Added Profile, "Teachers Area", Sign Out, My Account, My Courses to all pages (in the navs)
- Added account page where emails, paypal and passwords can be changed.
- Added "My Courses" page as `account-courses.html`. It's essentially the home page, but only one row.
- Added `data-enrolled` attribute to carousel tiles. If set to `true` the button CTA text will change to "Open Course" (from "Take This Course"). This sends a different message.
- Profile can be edited on `profile-edit.html`. We removed the "gender" option because it's really not necessary.
- Student and teacher profile pages both have a slide-down alert at the top of the page that brings the user to their `profile-edit.html` page. This should be removed and only applied when the user is on their own profile page.
- Added "Teachers Area" page. This page is a list of courses a teacher is currently teaching on Arkmont. It's a wall of tiles that you cannot interact with. If there is only one course, the site will auto-redirect the teacher to manage their course, and they will not even see this page.
- Started working on the course management areas.

### Mar. 3, 2017
- Quizzes! We have functioning quizzes now.
- Quizzes come with keyboard support. Keys 1-9 answer (check) answers, left arrow moves back a question, right arrow moves forward a question.
- Upon quiz completion, a grade will be provided and if there's a lesson afterwards a timer will be presented that will move the student to the next lesson in about 10 seconds.
- The quiz page has basic CSS animations. And unlike the prior skin, this one maintains the nav bar.
- Quizzes currently do not show which answers were wrong. That's definitely something we want to address soon.

### Mar. 2, 2017
- Individual lesson rating feature added.
- Only 3 lesson rating descriptors can be selected and submitted.
- Documents have visible timers (in the form of a slider) on them now. This is added so students know when the lesson is over, as opposed to guessing like they used to. It looks like a video slider, but cannot be rewound or fast forward
- We were going to add support for viewing pdf's, but even with `pdf.js` the support isn't great enough to justify spending dev time on it. Not yet, at least. We'd like to support on page .pdf's, but realistically people will just download it anyway.
- Reading lesson (pdf) page created. Very basic.
- Started work on the quiz pages.

### Feb. 26, 2017
- Document lesson page added.
- Same notes are supported for the document lesson page, but the display is very different.
- Moved a lot of jQuery event listeners. There are now listeners for `video` pages and `document` pages, plus "global" events which are, as of right now, events that can happen on any page, including the "inner" pages (syllabus, announements, reviews, etc.).
- The `.video__infobar` and `.video__interactions` blocks in the Document lesson page are used, those are just names and should be renamed in the future to something a bit more ambiguous to better suite it's dual purposes.

### Feb. 25, 2017
- Video speeds can be changed.
- Video quality can be changed.
- Fullscreen accepted.
- Discussions can be added.
- Discussion comments can be added.
- When a discussion is being viewed, the video will automatically pause so the student doesn't miss anything.
- PlaybackRate, Volume and Video Quality settings are saved as cookies and used when a lesson video is loaded.
- Saved notes during a video will display over (beside, if possible) the video for a better student video learning customization experience. Similar to how a student would take notes in a book but applied to a video.
- Notes and in-video questions are loaded with the video-lesson object via Ajax.
- Notes automatically log the time in the video.
- Resources can be downloadable files or external links. If they are downloadable files, a request to the server will be sent to get the download url. This helps prevent scrapers (if applicable) and allows Arkmont to use signed urls without needing to estimate the expiry time.
- In-video questions are added as modals, but we'd like to move those to a VideoJS Overlay instead -- for video experience consistency.
- Video page is mobile friendly.
- It is assumed that all ajax requests will return a useful JSON data, even if the returned data is the same as the submitted data.
- **Note:** There are probably a couple fairly minor bugs on this page. We did some minor testing, but not enough as we'd like before moving on. If you find any bugs, please let us know and we'll fix it.
- **Note:** This section took a lot longer than expected due to the complexity of video streaming and the features Arkmont currently supports.
- This branch has lived longer than it was intended to. We're ending development on this one and opening a new one.

### Feb. 21, 2017
- Modal's have basic sizes and are allowed to scroll when they take over too much of the browser.
- Modal fixes. Check commit diff in `js/main.js` to see. TL;DR: Fixed closing issues.
- Profile pages created. Nice and simple.
- Teacher profile pages created. Shows off courses they course. Also nice and simple.
- Upgrade to Font Awesome 4.7
- Course Syllabus Page, Course Discussions Page, Course Announcements Page, Course Reviews Page (student views) created.
- Added `.button()` jQuery plugin. Shows neat little animation. Docs on how to use that plugin are in `main.js`.
- Added form functionality for leaving a review. Remember, at Arkmont a student must be done at least 30% of a course before they can submit a review.
- Reviews require a star rating *and* a written review with at least 5 words. Empty reviews are not allowed at all.
- Added [VideoJS overlay plugin](https://github.com/brightcove/videojs-overlay) by brightcove.
- Video lesson page has a nice gradient overlay.
- Video lesson page is going to have a custom control bar -- this is to give the viewer a better video experience by giving them more viewing space, a cleaner and consistant control bar, and larger menu options.
- Added volume slider to custom video player on course-video-page.html
- We're in the middle of this update so we'll clean up the SCSS and JS on the next push.

### Feb. 18, 2017
- Added footer
- UI has support for Edge, Chrome, Opera, and Safari.
- Painfully took a step back to support IE11. Although IE doesn't support the CSS animations we're employing. We'll probably *not* support any other version of IE. Even this amount of support for IE11 was going too far because the IE experience is still terrible due to lack of CSS3 animation support. ¯\_(ツ)_/¯
- Removed some ESLint rules -- ignoring things that are either annoying and technically useless, or unsupported by IE11.
- Unnested some SASS. Nesting was starting to get bad.
- Reorganized the sass file and folder structure.
- Added more "official" breakpoints.
- Added style normalization for other browsers.
- `Modal()` fix from the IE11 support change. (Moving from arrow callbacks to anonymous functions disallowed `this` keywords inside events).
- Added a footer.
- Added notifications to `index.html` as sample notifications.
- Added `gulp-cssmin` to minify the css we use in the page.

### Feb. 13, 2017
- Course landing page has CTA buttons.
- Reviews box is hidden by default and shown if there are any `.review` children inside `.js-review-box`. The flexbox beside it auto expands or contracts.
- Added customizable `Modal()` (it's a modal, if that wasn't clear). Inspired by the awesome work over at [http://bootboxjs.com/](http://bootboxjs.com/).
- Modal needs more styling (ie. form inputs)

### Feb. 12, 2017 (course-landing-page branch)
- Course landing page has been started. Has video support.
- Mobile ready design.
- Moved `ajax()` and `formStarsFromRating` out of the containing function in `main.js` so we can use those in other files.
- Mobile nav fixes.
- Still has lots of work to be done, but this is a solid start for a single days work.

### Feb. 12, 2017
- Moved to BrowserSync with Gulp instead of us using nodemon and http-server. To run the site, `cd` to your directory and run `gulp` from your command line. (You may need to install gulp-cli `npm install gulp-cli`). New site url is `localhost:3000`.
- Any changes to .js, .css or .scss files will inject the new files into your page. Much faster than manually refreshing.
- Closing the `javascript` branch since it's done it's job: added JavaScript to the primary Course Browsing UI.
- Cleanup of the JS and SCSS files will come later.
- The demo of this branch can be found here: [http://kalobtaulien.com/examples/arkmont-ui/v2/index.html](http://kalobtaulien.com/examples/arkmont-ui/v2/index.html)

### Feb. 10, 2017
- Navigation bar added
- Navigation bar dropdown menu support added
- When a navigation dropdown menu is opened and certain events are triggered, all menus will instantly close.
- Navigation dropdown menus support right floats.
- Nav search added.
- Nav notification dropdown added.
- Mobile navigation menu added.
- JavaScript support for menus added.
- Mobile navigation menu can have dropdown menus and has a custom scrollbar.

### Feb. 9, 2017
- `main.js` has eslinting applied to it. Don't take this as our standard, we'll go through rapid development, ignore eslint, and come back to clean it up. But we'll do our best to keep it clean.
- Window resizing works. Max 7 tiles per page; Min 2 tiles per page.
- Started moving css into .scss files for easier styling maintenance
- Added node `http-server`.
- Added `sass-watcher` to auto-compile our sass to CSS.
- Added a sample plugin to VideoJS. We'll work with this more in the future.
- Added new dev command `npm run dev` to watch your `scss` and run your `http-server -c-1` at the same time.

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
