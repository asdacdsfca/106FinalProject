<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { regressionLinear } from 'd3-regression';
  import { base } from '$app/paths';

  let coefficient = 1; // Default coefficient value
  let svg; // Will be initialized onMount
  let jsonData; // Data fetched
  let averageEducByRace = {}; // To store average education by race
  let x, y; // Scales for the graph
  let graphData;

  onMount(async () => {
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    // Initialize the SVG once here
    svg = d3.select('.graph')
      .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Initialize scales
    x = d3.scaleLinear().range([0, width]);
    y = d3.scaleLinear().range([height, 0]);

    // Append the axes as groups
    svg.append('g').attr('transform', `translate(0,${height})`).attr('class', 'x-axis');
    svg.append('g').attr('class', 'y-axis');

    // Fetch the data
    const response = await fetch(`${base}/data.json`);
    jsonData = await response.json();

    if (jsonData) {
      // Process the data as required for your graph
      // Example: Calculate the average EDUC for each RACE for the "SOUTH REGION"
      const filteredData = jsonData.filter(d => d.REGION === "SOUTH REGION");
      filteredData.forEach(item => {
        if (averageEducByRace[item.RACE]) {
          averageEducByRace[item.RACE].total += parseInt(item.EDUC);
          averageEducByRace[item.RACE].count += 1;
        } else {
          averageEducByRace[item.RACE] = { total: parseInt(item.EDUC), count: 1 };
        }
      });

      // Convert averageEducByRace to an array suitable for D3
      graphData = Object.keys(averageEducByRace).map(race => {
        const { total, count } = averageEducByRace[race];
        return { race, averageEduc: total / count };
      });
      drawGraph(graphData);
    }
  });

  function drawGraph(data) {
    // Clear the existing graph points and line (not the axes)
    svg.selectAll('.point').remove();
    svg.selectAll('.line').remove();

    // Update the scales
    x.domain(d3.extent(data, (d) => d.x));
    y.domain(d3.extent(data, (d) => d.y));

    // Update the axes
    svg.select('.x-axis').call(d3.axisBottom(x));
    svg.select('.y-axis').call(d3.axisLeft(y));

    // Calculate the regression line
    const regression = regressionLinear()
      .x((d) => d.x)
      .y((d) => d.y)(data);

    // Add the regression line to the graph
    svg.append('path')
      .datum(regression)
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', d3.line()
          .x((d) => x(d[0]))
          .y((d) => y(d[1]))
      );

    // Add the points to the graph
    svg.append('g')
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
        .attr('class', 'point')
        .attr('cx', (d) => x(d.x))
        .attr('cy', (d) => y(d.y))
        .attr('r', 5)
        .attr('fill', 'red');
  }

  function updateGraph(coefficient) {
    // This function would update the graph based on the coefficient, if applicable
    // Otherwise, it might simply redraw the graph using the fetched data
    drawGraph(data); // Assuming data is in the scope
  }
</script>

<svg bind:this={svg} class="graph"></svg>

<input type="range" min="-10" max="10" step="0.1"
       bind:value={coefficient}
       on:input={() => updateGraph(coefficient)} />

<style>
  .graph {
    width: 960px; /* Fixed width or use 100% if you want it to be responsive */
    height: 500px; /* Fixed height */
    margin: auto; /* Center the SVG */
    outline: red solid 7px;
  }
</style>
