class DarkModeSwitch {
  constructor() {
    this.checkboxElem = document.querySelector("#dark-mode-switch > input[type=\"checkbox\"]");

    if (this.isEnabled()) {
      // turning the switch off == dark mode
      this.checkboxElem.checked = false;

      document.body.classList.add("dark-mode");
    }

    this.checkboxElem.addEventListener("change", this.toggle.bind(this));
  }

  isEnabled() { return localStorage.getItem("dark-mode") != null; }
  disable() { localStorage.removeItem("dark-mode"); }
  enable() { return localStorage.setItem("dark-mode",true); }

  toggle(setting) {
    if (this.isEnabled()) { this.disable(); }
    else                  { this.enable();  }

    document.body.classList.toggle("dark-mode");
  }
}

class Digits {
  static chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  static random() {
    return Digits.chars[Math.floor(Math.random() * Digits.chars.length)];
  }
}

class HeaderTitle {
  constructor() {
    this.textElem = document.querySelector("header svg text > tspan");
    this.originalValue = this.textElem.textContent;
    this.intervalID = null;

    this.textElem.addEventListener("mouseenter", this.startRandomizer.bind(this));
    this.textElem.addEventListener("mouseleave", this.stopRandomizer.bind(this));
  }

  set(newTitle) { this.textElem.textContent = newTitle; }

  startRandomizer() {
    if (this.intervalID == null) {
      this.intervalID = setInterval(this.randomize.bind(this), 60);
    }
  }

  randomize() {
    this.set(
      `P ${Digits.random()}  S T M ${Digits.random()}  D ${Digits.random()} R N`
    );
  }

  stopRandomizer() {
    if (this.intervalID != null) {
      clearInterval(this.intervalID);
      this.intervalID = null;

      this.reset();
    }
  }

  reset() { this.set("P O S T M O D E R N"); }
}

const ready = (callback) => {
  if (document.readyState != "loading") callback();
  else document.addEventListener("DOMContentLoaded", callback);
}

ready(() => {
  const title = new HeaderTitle();
  const darkMode = new DarkModeSwitch();
});
