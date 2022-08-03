const body = document.querySelector("body");
const darkMode = document.getElementById("darkMode");
const initialTheme = "light";

const storageTheme = "DARKMODE_MODE";

function setTheme(theme) {
  localStorage.setItem(storageTheme, theme);
  body.setAttribute("data-theme", theme);
}

function toggleTheme() {
  const activeTheme = localStorage.getItem(storageTheme);
  if (activeTheme === "light") {
    setTheme("dark");
    darkMode.ariaChecked = true;
    darkMode.classList.add("dark");
  } else {
    setTheme("light");
    darkMode.ariaChecked = false;
    darkMode.classList.remove("dark");
  }
}

function setThemeOnInit() {
  const savedTheme = localStorage.getItem(storageTheme);

  if (savedTheme) {
    body.setAttribute("data-theme", savedTheme);
  } else {
    setTheme(initialTheme);
  }
}
setThemeOnInit();

// Session Storage Toggle
const activeMode = "active";
const unActiveMode = "unactive";
const DEFAULT_MODE = "unactive";
const accordionBtn = document.getElementById("accordionBtn");
const formInput = document.getElementById("formInput");
init();

function init() {
  let storedMode = sessionStorage.getItem("mode");

  if (!storedMode) {
    storedMode = DEFAULT_MODE;
    sessionStorage.setItem("mode", storedMode);
  }
  setMode(storedMode);
}

function setMode(mode = DEFAULT_MODE) {
  if (mode == activeMode) {
    accordionBtn.classList.add(activeMode);
    formInput.classList.add(activeMode);
  } else if (mode == unActiveMode) {
    accordionBtn.classList.remove(activeMode);
    formInput.classList.remove(activeMode);
  }
}

accordionBtn.addEventListener("click", function () {
  let mode = sessionStorage.getItem("mode");
  if (mode) {
    let newMode = mode == unActiveMode ? activeMode : unActiveMode;
    setMode(newMode);
    sessionStorage.setItem("mode", newMode);
  }
});
