const AudioModule = (function() {
  const AudioModule = {};

  const audioFilePath = '../images/mammamia.mp3';
  let audio = new Audio(audioFilePath);

  AudioModule.changeAudio = function(audioFilePath) {
    audio = new Audio(audioFilePath);
  }

  AudioModule.playSound = function() {
    audio.play();
  }

  AudioModule.muted = function(mute) {
    audio.muted = mute;
  }

  return AudioModule;
})();

export default AudioModule;