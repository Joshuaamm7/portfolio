import { fetchJSON, renderProjects } from '../global.js';

// Fetch data
const projects = await fetchJSON('../lib/projects.json');



// Select elements
const projectsContainer = document.querySelector('.projects');
const titleElement = document.querySelector('.projects-title');

// Render projects
renderProjects(projects, projectsContainer, 'h2');

// Update project count
titleElement.textContent = `Projects (${projects.length})`;