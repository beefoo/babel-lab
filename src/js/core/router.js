app.routers.DefaultRouter = Backbone.Router.extend({

  routes: {
    "":                     "index",
    "speech2music":         "speech2music"
  },

  index: function() {
    var routeData = this._getRouteData();
    console.log('Route', routeData);
  },

  speech2music: function(){
    var routeData = this._getRouteData();
    console.log('Route', routeData);

    var m2n = new mic2Notes({
      onNoteEnd: function(note, time, duration){
        console.log('End note', note.note, time, duration);
        $('#note').append(
          $('<span>'+note.note+', </span>')
        );
      },
      onNoteStart: function(note, time){
        console.log('Start note', note.note, time);
      }
    });
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
