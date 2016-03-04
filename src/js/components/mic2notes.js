/*
 Microphone To Music Notes
   Listens to frequency data from microphone and emits music notes
   Heavily inspired by: https://github.com/borismus/spectrogram
   and: https://github.com/cwilso/PitchDetect
*/
var mic2Notes = (function() {
  function mic2Notes(options) {
    var defaults = {
      fftsize: 2048,
      freqMin: 60,
      freqMax: 1200,
      noteDiffTolerance: 2,
      sampleSize: 30,
      sampleThreshold: 0.6,
      onNoteEnd: function(note, time, duration){
        console.log('End note', note.note, time, duration);
      },
      onNoteStart: function(note, time){
        console.log('Start note', note.note, time);
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

    // retrieve note frequencies
    this.note_frequences = _.filter(NOTE_FREQUENCIES, function(note){ return note.hz >= options.freqMin && note.hz <= options.freqMax }) || [];

    // retrieve frequency index
    this.frequencyIndex = this._getFrequencyIndex();

    if (this.note_frequences.length) this.listenForMicrophone();
  };

  mic2Notes.prototype.getNoteFromFrequencies = function(freq){
    // var freqLen = freq.length; // should be 1024
    // initialize note to empty
    var _this = this,
        freqMin = this.opt.freqMin,
        freqMax = this.opt.freqMax,
        sampleThreshold = this.opt.sampleThreshold,
        sampleSize = this.opt.sampleSize,
        note = this._emptyNote();

    // Map to triples to preserve index [index, value, freq]
    freq = _.map(freq, function(f, i){ return [i, f/255.0, _this.frequencyIndex[i]]; });

    // Filter out values too low or out of range
    freq = _.filter(freq, function(f){ return f[1] > sampleThreshold && f[2] >= freqMin && f[2] <= freqMax; });

    if (freq.length >= sampleSize) {

      // Sort by values
      freq = _.sortBy(freq, function(f){ return -f[1]; });

      // Sample
      freq = freq.slice(0, sampleSize-1);

      // Map to notes
      var notes = _.map(freq, function(f){
        return _this.getNoteFromFrequency(_this._indexToFreq(f[0]));
      });

      // Group the notes
      var noteGroups = _.groupBy(notes, function(note){ return note.note; });

      // Choose the biggest group
      var bestNoteGroup = _.max(noteGroups, function(noteGroup){ return noteGroup.length; });
      if (bestNoteGroup.length) {
        note = bestNoteGroup[0];
      }
    }

    return note;
  };

  mic2Notes.prototype.getNoteFromFrequency = function(freq){
    var notes = this.note_frequences,
        noteCount = notes.length,
        note = this._emptyNote();

    // assumes notes are sorted
    for (var i=0; i<noteCount; i++) {
      var n = notes[i];
      if (freq < n.hz && i > 0) {
        var n0 = notes[i-1];
        note = n;
        // find the closest frequency
        if ((freq-n0.hz) < (n.hz-freq)) {
          note = n0;
        }
        break;
      }
    }

    return note;
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
    if (!this.lastNote || this.lastNote.note != note.note) {
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

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    navigator.getUserMedia({audio: true},
      this.onStream.bind(this),
      this.onStreamError.bind(this));
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

  mic2Notes.prototype._emptyNote = function(){
    return _.clone({note: "--",hz: -1,midi: -1});
  };

  mic2Notes.prototype._getFFTBinCount = function(){
    return this.opt.fftsize / 2;
  };

  mic2Notes.prototype._getFrequencyIndex = function(){
    var FFTBinCount = this._getFFTBinCount();
    var index = [];

    for (var i=0; i<FFTBinCount; i++) {
      index.push(this._indexToFreq(i));
    }

    return index;
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
