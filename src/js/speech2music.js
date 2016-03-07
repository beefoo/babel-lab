//=include vendor/jquery-1.12.1.min.js
//=include vendor/underscore-min.js
//=include vendor/ba-tiny-pubsub.min.js
//=include utilities.js
//=include templates.js
//=include components/stream2notes.js
//=include components/stream2notes/mic2notes.js
//=include views/layout/header.js
//=include views/stream2notes/_settings.js
//=include views/speech2music.js

$(function(){
  var header = new HeaderView();
  var main = new Speech2MusicView();
});
