var ready = (callback) => {
  if (document.readyState != "loading") callback();
  else document.addEventListener("DOMContentLoaded", callback);
}

ready(() => {
  const body = document.body;
  const darkModeSwitch = document.getElementById("dark-mode-checkbox");

  if (localStorage.getItem("dark-mode")) {
    darkModeSwitch.checked = false; // turning the switch off == dark mode
    body.classList.add("dark-mode");
  }

  darkModeSwitch.addEventListener("change", (event) => {
    if (localStorage.getItem("dark-mode")) {
      localStorage.removeItem("dark-mode");
    }
    else {
      localStorage.setItem("dark-mode",true);
    }

    body.classList.toggle("dark-mode");
  });

  const headerTitle = document.querySelector("header svg text > tspan");
  var headerTitleIntervalID = null;

  function startHeaderTitleMutator() {
    if (headerTitleIntervalID == null) {
      headerTitleIntervalID = setInterval(nextHeaderTitle, 60);
    }
  }

  function stopHeaderTitleMutator() {
    if (headerTitleIntervalID) {
      clearInterval(headerTitleIntervalID);
      headerTitleIntervalID = null;
      setHeaderTitle("P O S T M O D E R N");
    }
  }

  function randomDigit() { return Math.floor(Math.random() * 10).toString(); }
  function setHeaderTitle(newTitle) { headerTitle.textContent = newTitle; }

  function nextHeaderTitle() {
    setHeaderTitle(
      "P " + randomDigit() + " S T M " + randomDigit() + " D " + randomDigit() + " R N"
    );
  }

  headerTitle.addEventListener("mouseenter", () => {
    startHeaderTitleMutator();
  });

  headerTitle.addEventListener("mouseleave", () => {
    stopHeaderTitleMutator();
  });
});
