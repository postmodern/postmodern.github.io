var defaultLayout = {
  setupMoon: function() {
    // hooks the click events for the moon
    // to enter/exit "meditation" mode
    $("#moon").toggle(
      function() {
        $("#page").fadeOut("slow");
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
