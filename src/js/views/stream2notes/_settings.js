var Stream2NotesSettingsView = (function() {
  function Stream2NotesSettingsView(options) {
    var defaults = {
      el: '#settings',
      template: _.template(TEMPLATES['stream2notes_settings.ejs'])
    };
    this.opt = _.extend(defaults, options);
    this.init();
  }

  Stream2NotesSettingsView.prototype.init = function(){
    this.$el = $(this.opt.el);
    this.template = this.opt.template;
    this.streamSettings = this.opt.streamSettings;
    this.loadListeners();
  };

  Stream2NotesSettingsView.prototype.loadListeners = function(){
    var _this = this;

    this.$el.on('change', 'input', function(e){
      _this.onChangeInput($(this));
    });
  };

  Stream2NotesSettingsView.prototype.onChangeInput = function($input){
    var type = $input.attr('type'),
        name = $input.attr('name'),
        value = $input.val();

    if (type=='number') {
      value = parseFloat(value);
    }

    $.publish('settings.change', [name, value]);

  };

  Stream2NotesSettingsView.prototype.render = function(){
    this.$el.html(this.template(this.streamSettings));
  };

  return Stream2NotesSettingsView;

})();
