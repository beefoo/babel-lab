app.routers.DefaultRouter = Backbone.Router.extend({

  routes: {
    "":                     "index",
    "speech2music":         "speech2music"
  },

  index: function() {

  },

  speech2music: function(){

    var main = new app.views.Speech2Music();
  },

  _getRouteData: function(){
    var Router = this,
        fragment = Backbone.history.fragment,
        routes = _.pairs(Router.routes),
        route = null, action = null, params = null, matched, path;

    matched = _.find(routes, function(handler) {
      action = _.isRegExp(handler[0]) ? handler[0] : Router._routeToRegExp(handler[0]);
      return action.test(fragment);
    });

    if (matched) {
      params = Router._extractParameters(action, fragment);
      route = matched[0];
      action = matched[1];
    }

    path = fragment ? '/' + fragment : '/';

    return {
      route: route,
      action: action,
      fragment : fragment,
      path: path,
      params : params
    };
  }

});
