var Speech2MusicView = (function() {
  function Speech2MusicView(options) {
    var defaults = {};
    this.opt = _.extend(defaults, options);
    this.init();
  }

  Speech2MusicView.prototype.init = function(){
    this.loadMic2Notes();
  };

  Speech2MusicView.prototype.loadMic2Notes = function(){
    var _this = this;

    var m2n = new mic2Notes({
      onNoteEnd: function(note, time, duration){
        // console.log('End note', note, time, duration);
        // $('#note').text(note);
      },
      onNoteStart: function(note, time){
        // console.log('Start note', note, time);
        $('#note').text(note);
      },
      onNoteUpdate: function(note, time, duration){
        // console.log('End note', note, time, duration);
        // $('#note').text(note);
      }
    });
  };

  return Speech2MusicView;

})();
