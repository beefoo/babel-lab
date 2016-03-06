/*
 Microphone To Music Notes
   Listens to frequency data from microphone and emits music notes
*/
var mic2Notes = (function() {
  function mic2Notes(options) {
    stream2Notes.call(this, options);

    this.listenForMicrophone();
  }

  // inherit from stream2Notes
  mic2Notes.prototype = Object.create(stream2Notes.prototype);
  mic2Notes.prototype.constructor = mic2Notes;

  // Get input from the microphone
  mic2Notes.prototype.listenForMicrophone = function(){

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    navigator.getUserMedia({audio: true},
      this.onStream.bind(this),
      this.onStreamError.bind(this));
  };

  return mic2Notes;

})();
