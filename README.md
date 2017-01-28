# Arkmont-UI
A new video-based UI for Arkmont.com

## Inspiration
User interface directly affects the user experience. And while we *could* make an ugly UI with a great UX, we prefer to infuse art (design and simplicity) with technology. Ever notice the "mouseover" effect in an OSX toolbar? The icon grows. That's intuitive and helpful, and a data point that's hard to measure because we *feel* that experience. We can thank the late Steve Jobs for this inspiration. 

The UI itself was inspired by the massive research that Netflix did when they changed their UI, and we figured: why duplicate the same research just to get the same results? So we've taken a very similar approach. We're not intending on copying the Netflix UI, but it's a solid starting point for us. The reason we've chosen a modern and flexible design like this is because Arkmont, along with several other online service, face a common challenge:
> How do we provide the user with an intuitive, yet friendly, interface that has a lot of information, yet doesn't overwhelm them with information overload? 

The key to keeping users inspired and engaged lies beyond simple data points -- the service needs to *feel* intuitive and it needs to *act* friendly. Don't give people information they didn't ask for. 

## Challenges 
Too much data to display in a single viewport, too many courses to choose from, too much scrolling... these are all problems that online services face every day. 
#### Data overload
We don't want to overload the users brain with too much information. To us, that's like spamming the brain with advertisements -- nobody wants that and it turns users away. 
#### Too many choices
Arkmont has a catalog of courses, and it'll grow faster over time, so we need an interface that's growth friendly. We can't avoid the "scrolling forever" problem, but we *can* limit it but limiting the amount of data the users brain has to absorb in a single second. 
#### Small choices
When you have limited real-estate and a growing selection (of anything) the only choices you really have are:

1. Making the choices smaller and cramming more on a single page
2. Paginating the selection

Nobody wants tiny tiles to look at, and products go to page 2 to die (thanks, Google!). So naturally we need a UI that has smallish tiles, but grow when being previewed, and if what the user sees is interesting enough, they'll click it for more information. This falls in line with out belief that you should only give people information they ask for. 

## Where we got started
We *could* have started writing a tonne of JavaScript, but we figured: why not let the browser do more work. So started looking for a CSS3-animated UI. We didn't find anything useful for our purposes, __but__ we did find this [https://codepen.io/joshhunt/pen/LVQZRa](https://codepen.io/joshhunt/pen/LVQZRa) from [Josh Hunt](https://github.com/joshhunt). This is where we started our initial build. Of course this CSS3 version has it's limitations, so we patched some of the flaws and added more functionality. 

# Contibution 
### First, some notes
This UI is *not* perfect. It has flaws and this is our first draft of this UI, so it's definitely *not* coded efficiently. We have long CSS selectors, inefficient JavaScript, and ugly HTML. That's the joy of seeing our work before we're finished. But __this is where you can help!__

Also, this repo is under my name until such time it makes sense for Arkmont to have it's own public GitHub repo. Ownership might change in the future -- if it does, we'll give a heads up! 

### Your contributions 
At Arkmont we don't make very much code open source, but this is an exception where we believe other people can improve and use our work. If you want to make this better, branch off and make your improvements -- but don't forget to make pull requests -- you're work won't go unnoticed and it might end up on [Arkmont.com](https://arkmont.com), along with several other sites in the future. 
