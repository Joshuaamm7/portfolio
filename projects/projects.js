import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// Fetch data
const projects = await fetchJSON('../lib/projects.json');

// Select elements
const projectsContainer = document.querySelector('.projects');
const titleElement = document.querySelector('.projects-title');
const searchInput = document.querySelector('.searchBar');

// State variables
let query = '';
let selectedIndex = -1;

// Render projects on page load
renderProjects(projects, projectsContainer, 'h2');
titleElement.textContent = `Projects (${projects.length})`;

// Function to render pie chart
function renderPieChart(projectsGiven) {
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(data);
  let arcs = arcData.map((d) => arcGenerator(d));

  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  // Clear old pie chart and legend
  let svg = d3.select('#projects-pie-plot');
  svg.selectAll('path').remove();

  let legend = d3.select('.legend');
  legend.selectAll('li').remove();

  // Add new pie slices
  arcs.forEach((arc, i) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .attr('class', i === selectedIndex ? 'selected' : '')
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;

        svg
          .selectAll('path')
          .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));

        legend
          .selectAll('li')
          .attr('class', (_, idx) =>
            idx === selectedIndex ? 'legend-item selected' : 'legend-item'
          );

        if (selectedIndex === -1) {
          renderProjects(projectsGiven, projectsContainer, 'h2');
          titleElement.textContent = `Projects (${projectsGiven.length})`;
        } else {
          let selectedYear = data[selectedIndex].label;

          let filteredProjects = projectsGiven.filter((project) =>
            String(project.year) === String(selectedYear)
          );

          renderProjects(filteredProjects, projectsContainer, 'h2');
          titleElement.textContent = `Projects (${filteredProjects.length})`;
        }
      });
  });

  // Add new legend items
  data.forEach((d, idx) => {
    legend
      .append('li')
      .attr('class', idx === selectedIndex ? 'legend-item selected' : 'legend-item')
      .attr('style', `--color: ${colors(idx)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

// Render pie chart on page load
renderPieChart(projects);

// Search functionality
searchInput.addEventListener('input', (event) => {
  query = event.target.value.toLowerCase();

  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query);
  });

  renderProjects(filteredProjects, projectsContainer, 'h2');

  titleElement.textContent = `Projects (${filteredProjects.length})`;

  selectedIndex = -1;
  renderPieChart(filteredProjects);
});