/*
 Stream To Music Notes
   Listens to frequency data from audio stream and emits music notes
   Heavily inspired by: https://github.com/borismus/spectrogram
   and: https://github.com/cwilso/PitchDetect
*/
var stream2Notes = (function() {
  function stream2Notes(options) {
    var defaults = {
      fftsize: 2048,
      frequencyMin: 40, // https://en.wikipedia.org/wiki/Pitch_detection_algorithm#Fundamental_frequency_of_speech
      frequencyMax: 600,
      minRMS: 0.01,
      notes: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
      pitchCorrelationThreshold: 0.9,
      onNoteEnd: function(note, time, duration){},
      onNoteStart: function(note, time){},
      onNoteUpdate: function(note, time, duration){}
    };
    this.opt = this._extend(defaults, options);
    this.init();
  }

  stream2Notes.prototype.init = function(){
    // init audio context
    var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
    this.ctx = new AudioContext();
    this.sampleRate = this.ctx.sampleRate;

    // init pitch buffer
    this.pitch_buffer = [];
  };

  stream2Notes.prototype.freqToPitch = function(freq){
    var freqLen = freq.length,
        maxSamples = Math.floor(freqLen/2),
        sampleRate = this.sampleRate,
        pitchCorrelationThreshold = this.opt.pitchCorrelationThreshold;

    // check to see if enough signal
    var rms = this._rootMeanSquare(freq);
    if (rms < this.opt.minRMS) return -1;

    var pitch = -1;
    var best_offset = -1;
    var best_correlation = 0;
    var foundGoodCorrelation = false;
    var correlations = new Array(maxSamples);

    var lastCorrelation=1;
    for (var offset = 0; offset < maxSamples; offset++) {

      var correlation = 0;
      for (var i=0; i<maxSamples; i++) {
        correlation += Math.abs((freq[i])-(freq[i+offset]));
      }
      correlation = 1 - (correlation/maxSamples);
      correlations[offset] = correlation;
      if ((correlation > pitchCorrelationThreshold) && (correlation > lastCorrelation)) {
        foundGoodCorrelation = true;
        if (correlation > best_correlation) {
          best_correlation = correlation;
          best_offset = offset;
        }

      } else if (foundGoodCorrelation) {
        var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];
        pitch = sampleRate/(best_offset+(8*shift));
        break;
      }
      lastCorrelation = correlation;
    }
    if (best_correlation > this.opt.minRMS) {
      // console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
      pitch = sampleRate/best_offset;
    }

    return pitch;
  };

  stream2Notes.prototype.listen = function(){
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

    // put frequency data into buffer (1/2 of fftsize)
    var buffer = new Float32Array(this.analyzer.frequencyBinCount);
    this.analyzer.getFloatTimeDomainData(buffer);

    // retrieve pitch
    var pitch = this.freqToPitch(buffer);
    // retrieve note
    var note = this.pitchToNote(pitch);

    // note has changed
    if (!this.lastNote || this.lastNote != note) {
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

  stream2Notes.prototype.listenOn = function(){
    // reset times
    this.lastTime = false;
    this.endTime = false;

    // start listening
    this.listening = true;
    this.listen();
  };

  stream2Notes.prototype.listenOff = function(){
    this.listening = false;
  };

  stream2Notes.prototype.pitchToNote = function(pitch){
    var notes = this.opt.notes,
        noteLen = notes.length,
        note = '--';

    if (pitch > 0) {
      var noteNum = 12 * (Math.log(pitch/440)/Math.log(2));
      noteNum = Math.round(noteNum) + 69;
      note = notes[noteNum % noteLen];
    }

    return note;
  };

  // Setup analyzer after microphone stream is initialized
  stream2Notes.prototype.onStream = function(stream){
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

  stream2Notes.prototype.onStreamError = function(e){
    console.log(e);
    alert('Error: '+e.name+' (code '+e.code+')');
  };

  stream2Notes.prototype._extend = function(out) {
    out = out || {};
    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i])
        continue;
      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key))
          out[key] = arguments[i][key];
      }
    }
    return out;
  };

  stream2Notes.prototype._rootMeanSquare = function(freq) {
    var rms = 0,
        freqLen = freq.length;

    for (var i=0; i<freqLen; i++) {
      var val = freq[i];
      rms += val * val;
    }

    return Math.sqrt(rms/freqLen);
  };

  return stream2Notes;

})();
