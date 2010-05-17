var meditation = {
  mode: false,

  enter: function() {
    $("#page").fadeOut("slow");

    // lazy hack to popup the somafm.com DroneZone stream
    window.location = 'http://somafm.com/startstream=dronezone.pls';

    meditation.mode = true;
  },

  exit: function() {
    $("#page").fadeIn("slow");

    meditation.mode = false;
  }
};

var defaultLayout = {
  setupMoon: function() {
    // hooks the click events for the moon
    // to enter/exit "meditation" mode
    $("#moon").toggle(meditation.enter,meditation.exit);
  }
};

$(document).ready(function() {
  defaultLayout.setupMoon();
});
