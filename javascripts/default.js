var defaultLayout = {
  setupMoon: function() {
    // hooks the click events for the moon
    // to enter/exit "meditation" mode
    $("#moon").toggle(
      function() {
        $("#page").fadeOut("slow");

        // lazy hack to popup the somafm.com DroneZone stream
        window.location = 'http://somafm.com/startstream=dronezone.pls';
      },
      
      function() {
        $("#page").fadeIn("slow");
      }
    );
  }
};

$(document).ready(function() {
  defaultLayout.setupMoon();
});
