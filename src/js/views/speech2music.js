var Speech2MusicView = (function() {
  function Speech2MusicView(options) {
    var defaults = {
      el: '#main',
      template: _.template(TEMPLATES['sheetmusic.ejs'])
    };
    this.opt = _.extend(defaults, options);
    this.init();
  }

  Speech2MusicView.prototype.init = function(){
    this.$el = $(this.opt.el);
    this.template = this.opt.template;
    this.loadMic2Notes();
    this.settingsView = new Stream2NotesSettingsView({
      streamSettings: this.m2n.getOptions()
    });
    this.render();
    this.loadListeners();
  };

  Speech2MusicView.prototype.loadListeners = function(){
    var _this = this;

    // listen for settings to change
    $.subscribe('settings.change', function(e, name, value){
      _this.m2n && _this.m2n.setOption(name, value);
    });
  };

  Speech2MusicView.prototype.loadMic2Notes = function(){
    var _this = this;

    this.m2n = new mic2Notes({
      onNoteEnd: function(note, time, duration){ _this.onNoteEnd(note, time, duration); },
      onNoteStart: function(note, time){ _this.onNoteStart(note, time); },
      onNoteUpdate: function(note, time, duration){ _this.onNoteUpdate(note, time, duration); }
    });
  };

  Speech2MusicView.prototype.onNoteEnd = function(note, time, duration){

  };

  Speech2MusicView.prototype.onNoteStart = function(note, time){
    this.$el.find('#note').text(note);
  };

  Speech2MusicView.prototype.onNoteUpdate = function(note, time, duration){

  };

  Speech2MusicView.prototype.render = function(){
    this.$el.html(this.template(this.opt));
    this.settingsView.render();
  };

  return Speech2MusicView;

})();
