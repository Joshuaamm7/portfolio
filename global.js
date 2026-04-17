console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let navLinks = $$("nav a");

let currentLink = navLinks.find((a) => {
  let linkPath = a.pathname.replace(/index\.html$/, "");
  let pagePath = location.pathname.replace(/index\.html$/, "");
  return a.host === location.host && linkPath === pagePath;
});

if (currentLink) {
  currentLink.classList.add("current");
}