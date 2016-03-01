window.DEBUG = true;

window.app = {
  models: {},
  collections: {},
  views: {},
  routers: {},
  initialize: function(){

    // Debug
    DEBUG && console.log("Project", PROJECT);
    PubSub.subscribe('auth.validation.success', function(ev, user) {
      DEBUG && console.log('User', user);
    });

    // load the main router
    var mainRouter = new app.routers.DefaultRouter();

    // Enable pushState for compatible browsers
    var enablePushState = true;
    var pushState = !!(enablePushState && window.history && window.history.pushState);

    // Start backbone history
    Backbone.history = Backbone.history || new Backbone.History({});
    Backbone.history.start({
      pushState:pushState
    });

    Backbone.history.start();
  }
};

// Init backbone app
$(function(){
  app.initialize();
});
