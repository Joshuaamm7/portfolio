console.log("IT’S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const BASE_PATH =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "/"
    : "/portfolio/";

let pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "contact/", title: "Contact" },
  { url: "resume/", title: "Resume" },
  { url: "https://github.com/joshuaamm7", title: "GitHub" },
];
document.body.insertAdjacentHTML(
  "afterbegin",
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
`
);

let select = document.querySelector(".color-scheme select");

function setColorScheme(colorScheme) {
  document.documentElement.style.setProperty("color-scheme", colorScheme);
  select.value = colorScheme;
}


select.addEventListener("input", function (event) {
  let value = event.target.value;

  setColorScheme(value);

  localStorage.colorScheme = value;
});


if ("colorScheme" in localStorage) {
  setColorScheme(localStorage.colorScheme);
}

let nav = document.createElement("nav");
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  url = !url.startsWith("http") ? BASE_PATH + url : url;

  let a = document.createElement("a");
  a.href = url;
  a.textContent = title;

  let linkPath = a.pathname.replace(/index\.html$/, "");
  let pagePath = location.pathname.replace(/index\.html$/, "");

  if (a.host === location.host && linkPath === pagePath) {
    a.classList.add("current");
  }

  if (a.host !== location.host) {
    a.target = "_blank";
  }

  nav.append(a);
}

export async function fetchJSON(url) {
  try {
    // Step 1: fetch the file
    const response = await fetch(url);
    console.log(response); // optional: debug

    // Step 2: check if request worked
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    // Step 3: parse JSON
    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  // Check if container exists
  if (!containerElement) {
    console.error('Invalid container element');
    return;
  }

  // Validate heading level
  const validHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  if (!validHeadings.includes(headingLevel)) {
    headingLevel = 'h2';
  }

  // Clear old content
  containerElement.innerHTML = '';

  // Handle empty or invalid project data
  if (!projects || projects.length === 0) {
    containerElement.innerHTML = '<p>No projects available.</p>';
    return;
  }

  // Create one article for each project
  for (const project of projects) {
    const article = document.createElement('article');

    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
    `;

    containerElement.appendChild(article);
  }
}