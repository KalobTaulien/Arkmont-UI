function samplePlugin(options) { // eslint-disable
  const player = this;

  // this.played tracks if the video has been played at least once.
  if (this.played === undefined) {
    this.played = false;
  }

  const analyticsVideoAction = function videoAnalytics(options) { // eslint-disable
    // Analytics logging available.
  };

  player.on('ratechange', () => {
    // New playback rate.
    const playbackRate = player.playbackRate();
    console.log(playbackRate);
  })
  .on('resolutionchange', () => {
    // New resolution size
    const resolution = player.currentResolution();
    console.log(resolution);
  })
  .on('volumechange', () => {
    // New volume set
    const volume = player.volume();
    console.log(volume);
  });
}

// Register the plugin
videojs.plugin('samplePlugin', samplePlugin);