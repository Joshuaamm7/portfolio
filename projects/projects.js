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

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

let data = [1, 2];

let sliceGenerator = d3.pie();
let arcData = sliceGenerator(data);
let arcs = arcData.map((d) => arcGenerator(d));

let colors = ['gold', 'purple'];

arcs.forEach((arc, idx) => {
  d3.select('#projects-pie-plot')
    .append('path')
    .attr('d', arc)
    .attr('fill', colors[idx]);
});