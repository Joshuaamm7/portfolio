import { fetchJSON, renderProjects } from './global.js';

// Fetch all projects
const projects = await fetchJSON('./lib/projects.json');

// Get first 3 projects
const latestProjects = projects.slice(0, 3);

// Select container on homepage
const projectsContainer = document.querySelector('.projects');

// Render them
renderProjects(latestProjects, projectsContainer, 'h2');