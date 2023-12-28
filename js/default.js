// ===== progress bar =====
const progressBarElement = document.createElement("div");
progressBarElement.classList.add("progress-bar");
document.querySelector("body").appendChild(progressBarElement);
const progBarShowOnPx = 10; // amount of pixels before bar is shown

// ===== baco to top button =====
const backToTopBtn = document.createElement("div");
backToTopBtn.classList.add("backToTopBtn", "hidden");
backToTopBtn.setAttribute("title", "Scroll to top"); // tooltip
backToTopBtn.innerHTML = `<svg
aria-hidden="true"
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 448 512">
    <path fill="black"
    d="M240.971 130.524l194.343 194.343
    c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667
    c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516
    c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667
    c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525
    c9.372-9.373 24.568-9.373 33.941-.001z">
    </path>
</svg>
<h6>UP</h6>`;
document.querySelector("body").appendChild(backToTopBtn);

const bttBtnShowOnPx = 100; // amount of pixels before button is shown

// ===== background paralax =====
const backgroundElement = document.createElement("div");
backgroundElement.classList.add("background-image");
document.querySelector("body").appendChild(backgroundElement);

const scrollContainer = () => {
  return document.documentElement || document.body;
};

backToTopBtn.addEventListener("click", () => {
  document.body.scrollIntoView();
});

// ===== nav =====
const nav = document.querySelector("nav");
const navToggle = document.querySelector(".nav__mobile-menu-btn");
const menuHamburgerSvg = document.querySelector(".nav__hamburger-svg");
const menuCloseSvg = document.querySelector(".nav__close-svg");

const navLinks = document.querySelectorAll(".nav__links > li > a");

function toggleNav() {
  const navExpanded = nav.getAttribute("data-expanded");
  if (navExpanded === "false") {
    nav.setAttribute("data-expanded", "true");

    menuHamburgerSvg.classList.add("hidden");
    menuCloseSvg.classList.remove("hidden");
  } else {
    nav.setAttribute("data-expanded", "false");

    menuCloseSvg.classList.add("hidden");
    menuHamburgerSvg.classList.remove("hidden");
  }
}

// close nav when clicked on close (X)
navToggle.addEventListener("click", () => {
  toggleNav();
});

// close nav when clicked on link (for links that go to sections)
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    toggleNav();
  });
});

// close nav when clicked outside nav
window.addEventListener("click", function (e) {
  const navExpanded = nav.getAttribute("data-expanded");

  if (
    navExpanded === "true" &&
    !nav.contains(e.target) &&
    !navToggle.contains(e.target)
  ) {
    toggleNav();
  }
});

document.addEventListener("scroll", () => {
  const scrolledPercentage =
    (scrollContainer().scrollTop /
      (scrollContainer().scrollHeight - scrollContainer().clientHeight)) *
    100;

  progressBarElement.style.width = scrolledPercentage + "%";

  if (scrollContainer().scrollTop > progBarShowOnPx)
    progressBarElement.classList.remove("hidden");
  else progressBarElement.classList.add("hidden");

  if (scrollContainer().scrollTop > bttBtnShowOnPx)
    backToTopBtn.classList.remove("hidden");
  else backToTopBtn.classList.add("hidden");

  backgroundElement.style.top = -scrolledPercentage / 4 + "%";
  backgroundElement.style.left = -scrolledPercentage / 2 + "%";

  nav.setAttribute("data-scrolled", "true");
});

// sections intersection observers
const navIntersectionListItems = document.querySelectorAll(".nav__links > li");
let currentListItem = null;

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // console.log(entry.target);

        let currentSection = entry.target.getAttribute("id");

        // go through all nav items
        navIntersectionListItems.forEach((listItem) => {
          if (
            listItem.firstChild.getAttribute("href") ===
            "#" + currentSection
          ) {
            // remove current-site attribute from last current nav item
            if (currentListItem)
              currentListItem.removeAttribute("data-current-site");

            // add current-site attribute to current nav item
            listItem.setAttribute("data-current-site", "");
            currentListItem = listItem;
          }
        });
      }
    });
  },
  { threshold: 0.75 }
);

document.querySelectorAll("section").forEach((section) => {
  sectionObserver.observe(section);
});

// ===== footer copyright year =====
const footerYearEl = document.querySelector(".footer__year");
footerYearEl.textContent = new Date().getFullYear();
