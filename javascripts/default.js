var Meditation = {
  mode: false,

  stream: "http://somafm.com/startstream=dronezone.pls",

  enter: function() {
    // imagine an endless white sand dune
    // it is night time
    // the moon is on the horizon
    $("#page").fadeOut("slow");

    // lazy hack to popup the somafm.com DroneZone stream
    window.location = meditation.stream;

    meditation.mode = true;
  },

  exit: function() {
    // back to the noisy world
    $("#page").fadeIn("slow");

    meditation.mode = false;
  },

  playing: function() {
  }
};

var Layout = {
  setupMoon: function() {
    // hooks the click events for the moon
    // to enter/exit "meditation" mode
    $("#moon").toggle(Meditation.enter,Meditation.exit);
  }
};

var Blog = {
  setup: function() {
    $("div.warning").hide().slideDown(900);
  }
}

$(document).ready(function() {
  Layout.setupMoon();
  Blog.setup();
});
