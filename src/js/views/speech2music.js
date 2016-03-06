app.views.Speech2Music = Backbone.View.extend({

  el: '#main',

  initialize: function(data){
    this.loadMic2Notes();
  },

  loadMic2Notes: function(){
    var _this = this;

    var m2n = new mic2Notes({
      onNoteEnd: function(note, time, duration){
        // console.log('End note', note, time, duration);
        // $('#note').text(note);
      },
      onNoteStart: function(note, time){
        // console.log('Start note', note, time);
        _this.$('#note').text(note);
      },
      onNoteUpdate: function(note, time, duration){
        // console.log('End note', note, time, duration);
        // _this.$('#note').text(note);
      }
    });
  },

  render: function() {
    return this;
  }

});
