/*
 Stream To Music Notes
   Listens to frequency data from audio stream and emits music notes
   Heavily inspired by: https://github.com/borismus/spectrogram
   and: https://github.com/cwilso/PitchDetect
*/
var stream2Notes = (function() {
  function stream2Notes(options) {
    var defaults = {
      correlationMin: 0.9,
      fftsize: 2048,
      // fundamental frequency of speech can vary from 40 Hz for low-pitched male voices
      // to 600 Hz for children or high-pitched female voices
      // https://en.wikipedia.org/wiki/Pitch_detection_algorithm#Fundamental_frequency_of_speech
      frequencyMin: 40,
      frequencyMax: 600,
      minRms: 0.01, // min signal
      noteDurationMin: 10, // in milliseconds
      notes: ["C", "Cs", "D", "Ds", "E", "F", "Fs", "G", "Gs", "A", "As", "B"],
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
  };

  // Autocorrelation algorithm snagged from: https://github.com/cwilso/PitchDetect
  stream2Notes.prototype.autoCorrelate = function(buf){
    var bufLen = buf.length,
        periods = this.periods,
        periodLen = periods.length,
        maxSamples = this.maxSamples,
        sampleRate = this.sampleRate,
        minCorrelation = this.opt.correlationMin;

    // check to see if enough signal
    var rms = this._rootMeanSquare(buf);
    if (rms < this.opt.minRms) return -1;

    var pitch = -1;
    var best_offset = -1;
    var best_correlation = 0;
    var foundGoodCorrelation = false;
    var correlations = new Array(maxSamples);

    var lastCorrelation=1;

    for (i=0; i<periodLen; i++) {
      var offset = periods[i];
      var correlation = 0;
      for (var j=0; j<maxSamples; j++) {
        correlation += Math.abs((buf[j])-(buf[j+offset]));
      }
      correlation = 1 - (correlation/maxSamples);
      correlations[offset] = correlation;
      if ((correlation > minCorrelation) && (correlation > lastCorrelation)) {
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
    if (best_correlation > 0.01) {
      // console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
      pitch = sampleRate/best_offset;
    }

    return pitch;
  };

  stream2Notes.prototype.getOption = function(name){
    return this.opt[name];
  };

  stream2Notes.prototype.getOptions = function(){
    var opt = {};
    for (var key in this.opt) {
      if (typeof this.opt[key] !== "function")
        opt[key] = this.opt[key];
    }
    return opt;
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

    // put frequency data into buffer
    var buffer = new Float32Array(this.bufferLen);
    this.analyzer.getFloatTimeDomainData(buffer);

    // retrieve pitch via autocorrelation
    var pitch = this.autoCorrelate(buffer);
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
    this.bufferLen = this.analyzer.frequencyBinCount; // should be 1/2 fftSize
    this.maxSamples = Math.floor(this.bufferLen/2);
    this.updatePeriods();

    // init pitch buffer
    this.pitch_buffer = [];

    // And listen
    this.listenOn();
  };

  stream2Notes.prototype.onStreamError = function(e){
    console.log(e);
    alert('Error: '+e.name+' (code '+e.code+')');
  };

  stream2Notes.prototype.setOption = function(name, value){
    this.opt[name] = value;

    // if property is frequency, update periods
    if (name.lastIndexOf('frequency', 0) === 0) {
      this.updatePeriods();
    }
  };

  stream2Notes.prototype.updatePeriods = function(){
    // Determine min/max period
    var minPeriod = this.opt.minPeriod || 2;
    var maxPeriod = this.opt.maxPeriod || this.maxSamples;
    if(this.opt.frequencyMin) maxPeriod = Math.floor(this.sampleRate / this.opt.frequencyMin);
    if(this.opt.frequencyMax) minPeriod = Math.ceil(this.sampleRate / this.opt.frequencyMax);
    maxPeriod = Math.min(maxPeriod, this.maxSamples);
    minPeriod = Math.max(2, minPeriod);

    // init periods
    this.periods = [];
    for(var i = minPeriod; i <= maxPeriod; i++) {
      this.periods.push(i);
    }
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

  stream2Notes.prototype._rootMeanSquare = function(arr) {
    var rms = 0,
        arrLen = arr.length;

    for (var i=0; i<arrLen; i++) {
      var val = arr[i];
      rms += val * val;
    }

    return Math.sqrt(rms/arrLen);
  };

  return stream2Notes;

})();
