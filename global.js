console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let navLinks = $$("nav a");

let currentLink = navLinks.find((a) => {
  return location.pathname.endsWith(a.getAttribute("href"));
});

if (currentLink) {
  currentLink.classList.add("current");
}