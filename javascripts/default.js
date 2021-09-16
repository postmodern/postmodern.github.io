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
});
