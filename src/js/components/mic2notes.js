/*
 Microphone To Music Notes
   Listens to frequency data from microphone and emits music notes
   Heavily inspired by: https://github.com/borismus/spectrogram
*/
var mic2Notes = (function() {
  function mic2Notes(options) {
    var defaults = {
      fftsize: 2048,
      onNoteEnd: function(note, time, duration){
        console.log(note, time, duration);
      },
      onNoteStart: function(note, time){
        console.log(note, time);
      }
    };
    var options = _.extend(defaults, options);
    this.init(options);
  }

  mic2Notes.prototype.init = function(options){
    this.opt = options;

    // init audio context
    var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
    this.ctx = new AudioContext();

    this.listenForMicrophone();
  };

  mic2Notes.prototype.getNoteFromFrequencies = function(freq){
    var freqLen = freq.length; // should be 1024
    var freqGroups = [];

    // Iterate over the frequencies.
    for (var i = 0; i < freqLen; i++) {
      var logIndex = this._logScale(i, freqLen);

      // a number between 0 and 255
      var value = freq[logIndex];
      var freq = this._indexToFreq(logIndex);
    }

    return '--';
  };

  mic2Notes.prototype.listen = function(){
    // stop listening
    if (!this.listening) {
      if (this.lastTime) this.endTime = this.lastTime;
      return false;
    }

    // keep track of time
    var now = new Date();
    var timeSince = 0;
    if (this.lastTime) timeSince = now - this.lastTime;
    else this.startTime = now;
    this.lastTime = now;

    // retrieve frequence data
    var freq = new Uint8Array(this.analyzer.frequencyBinCount);
    this.analyzer.getByteFrequencyData(freq);

    // retrieve note
    var note = this.getNoteFromFrequencies(freq);

    // note has changed
    if (this.lastNote != note) {
      if (this.lastNote && this.noteStartTime) {
        var noteDuration = now - this.noteStartTime;
        this.opt.onNoteEnd(this.lastNote, now, noteDuration);
      }
      this.lastNote = note;
      this.noteStartTime = now;
      this.opt.onNoteStart(note, now);
    }

    // continue to listen
    requestAnimationFrame(this.listen.bind(this));
    // var _this = this;
    // setTimeout(function(){_this.listen();}, 2000);
  };

  // Get input from the microphone
  mic2Notes.prototype.listenForMicrophone = function(){

    // firefox
    if (navigator.mozGetUserMedia) {
      navigator.mozGetUserMedia({audio: true},
        this.onStream.bind(this),
        this.onStreamError.bind(this));

    // chrome/safari
    } else if (navigator.webkitGetUserMedia) {
      navigator.webkitGetUserMedia({audio: true},
        this.onStream.bind(this),
        this.onStreamError.bind(this));
    }
  };

  mic2Notes.prototype.listenOn = function(){
    // reset times
    this.lastTime = false;
    this.endTime = false;

    // start listening
    this.listening = true;
    this.listen();
  };

  mic2Notes.prototype.listenOff = function(){
    this.listening = false;
  };

  // Setup analyzer after microphone stream is initialized
  mic2Notes.prototype.onStream = function(stream){
    var input = this.ctx.createMediaStreamSource(stream);
    var analyzer = this.ctx.createAnalyser();

    analyzer.smoothingTimeConstant = 0;
    analyzer.fftSize = this.opt.fftsize;

    // Connect graph
    input.connect(analyzer);
    this.analyzer = analyzer;

    // And listen
    this.listenOn();
  };

  mic2Notes.prototype.onStreamError = function(e){
    alert(e);
  };

  mic2Notes.prototype._getFFTBinCount = function(){
    return this.opt.fftsize / 2;
  };

  mic2Notes.prototype._indexToFreq = function(index) {
    var nyquist = this.ctx.sampleRate/2;
    return nyquist/this._getFFTBinCount() * index;
  };

  mic2Notes.prototype._logBase = function(val, base) {
    return Math.log(val) / Math.log(base);
  };

  mic2Notes.prototype._logScale = function(index, total, opt_base) {
    var base = opt_base || 2;
    var logmax = this._logBase(total + 1, base);
    var exp = logmax * index / total;
    return Math.round(Math.pow(base, exp) - 1);
  };

  return mic2Notes;

})();
