const sideMenu = document.querySelector("#sideMenu");
const navBar = document.querySelector("nav");
const navLinks = document.querySelector("nav ul");

function openMenu() {
  sideMenu.style.transform = "translateX(-16rem)";
}

function closeMenu() {
  sideMenu.style.transform = "translateX(16rem)";
}

window.addEventListener("scroll", () => {
  if (scrollY > 50) {
    navBar.classList.add(
      "bg-white",
      "bg-opacity-50",
      "backdrop-blur-lg",
      "shadow-sm",
      "dark:bg-darkTheme",
      "dark:shadow-white/20"
    );
    navLinks.classList.remove(
      "bg-white",
      "shadow-sm",
      "bg-opacity-50",
      "dark:border",
      "dark:border-white/50",
      "dark:bg-transparent"
    );
  } else {
    navBar.classList.remove(
      "bg-white",
      "bg-opacity-50",
      "backdrop-blur-lg",
      "shadow-sm",
      "dark:bg-darkTheme",
      "dark:shadow-white/20"
    );
    navLinks.classList.add(
      "bg-white",
      "shadow-sm",
      "bg-opacity-50",
      "dark:border",
      "dark:border-white/50",
      "dark:bg-transparent"
    );
  }
});

//-----------------------------lightmode and darkmode---------------------------->

if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

// Update all images that declare data-light / data-dark attributes
function updateThemeLogos() {
  const imgs = document.querySelectorAll("img[data-light][data-dark]");
  imgs.forEach((img) => {
    const darkSrc = img.getAttribute("data-dark");
    const lightSrc = img.getAttribute("data-light");
    if (document.documentElement.classList.contains("dark")) {
      if (darkSrc) img.src = darkSrc;
    } else {
      if (lightSrc) img.src = lightSrc;
    }
  });
}

// ensure correct src on initial load
updateThemeLogos();

function toggleTheme() {
  document.documentElement.classList.toggle("dark");
  if (document.documentElement.classList.contains("dark")) {
    localStorage.theme = "dark";
  } else {
    localStorage.theme = "light";
  }
  // swap all theme-aware logos when theme toggles
  updateThemeLogos();
}

// Ensure hero (#top) sits directly below the fixed nav by measuring nav height
function syncHeroOffset() {
  const hero = document.querySelector("#top");
  if (!hero || !navBar) return;
  // measure nav bar's computed height
  const navRect = navBar.getBoundingClientRect();
  const navHeight = Math.ceil(navRect.height);
  // apply as inline style so it overrides static classes
  hero.style.marginTop = navHeight + "px";
  // reduce hero height by 5vh (5% of viewport height) to decrease top area
  // compute 5vh in pixels relative to current viewport height
  const fiveVhPx = Math.round(window.innerHeight * 0.06);
  hero.style.height = `calc(100vh - ${navHeight}px - ${fiveVhPx}px)`;
}

// Run on load and when the window resizes (and after fonts load)
window.addEventListener("load", syncHeroOffset);
window.addEventListener("resize", syncHeroOffset);
// Also run shortly after fonts/images may have changed layout
setTimeout(syncHeroOffset, 500);

// Ensure Home links jump instantly to the very top of the page
function bindHomeLinks() {
  const homeLinks = document.querySelectorAll('a[href="#top"]');
  homeLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      // close side menu if it's open
      if (sideMenu) {
        // attempt to move it off-screen
        sideMenu.style.transform = "translateX(16rem)";
      }
      // jump instantly to the top (no smooth behavior)
      window.scrollTo({ top: 0, behavior: "auto" });
      // update the URL hash without causing another scroll
      if (history.replaceState) {
        history.replaceState(null, "", "#top");
      } else {
        location.hash = "#top";
      }
      // re-sync hero offset in case layout changed
      syncHeroOffset();
    });
  });
}

// bind on load
window.addEventListener("load", bindHomeLinks);
