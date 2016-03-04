app.views.Speech2Music = Backbone.View.extend({

  el: '#main',

  initialize: function(data){
    this.loadMic2Notes();
  },

  loadMic2Notes: function(){
    var _this = this;

    var m2n = new mic2Notes({
      notes: NOTES,
      onNoteEnd: function(note, time, duration){
        // console.log('End note', note.key, time, duration);
        // $('#note').text(note.key);
      },
      onNoteStart: function(note, time){
        // console.log('Start note', note.key, time);
        _this.$('#note').text(note.key);
      },
      onNoteUpdate: function(note, time, duration){
        // console.log('End note', note.key, time, duration);
        _this.$('#note').text(note.key);
      }
    });
  },

  render: function() {
    return this;
  }

});
