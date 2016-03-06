// COMPONENTS
var COMPONENTS = (function() {
  function COMPONENTS() {
    this.init();
  }

  COMPONENTS.prototype.init = function(){
    this.toggleInit();
  };

  COMPONENTS.prototype.toggle = function(el){
    $(el).toggleClass('active');
  };

  COMPONENTS.prototype.toggleInit = function(){
    var _this = this;

    // toggle button
    $(document).on('click', '.toggle-active', function(){
      _this.toggle($(this).attr('data-target'));
    });
  };

  return COMPONENTS;

})();

// Load app on ready
$(function() {
  var components = new COMPONENTS();
});
