<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import * as d3 from 'd3';
    import { base } from '$app/paths';
  
    let outjsonData = [];
    let filteredData = [];
    let ageSelected = writable(25); // Default value
    let educSelected = writable(10); // Default value
  
    onMount(async () => {
      const response = await fetch(`${base}/output.json`);
      outjsonData = await response.json();
    });

    $: console.log(ageSelected);

    $: if (outjsonData) console.log(outjsonData.AGE);
  
    $: filteredData = outjsonData.filter(d => d.EDUC === $educSelected);

    $: if (filteredData.length > 0) {console.log(filteredData.length)}
  
    $: if (filteredData.length > 0) {
      drawChart(filteredData);
    }
  
    function drawChart(data) {
      const svg = d3.select('#chart');
      svg.selectAll("*").remove(); // Clear previous SVG contents
  
      // Set the dimensions and margins of the graph
      const margin = {top: 10, right: 30, bottom: 30, left: 40},
          width = 450 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;
  
      // Add SVG canvas
      const chart = svg.append('g')
                       .attr('transform', `translate(${margin.left},${margin.top})`);
  
      // Add X axis
      const x = d3.scaleLinear()
                  .domain([0, d3.max(data, d => d.EDUC)])
                  .range([ 0, width ]);
      chart.append('g')
           .attr('transform', `translate(0, ${height})`)
           .call(d3.axisBottom(x));
  
      // Add Y axis
      const y = d3.scaleLinear()
                  .domain([0, d3.max(data, d => d.HOURWAGE)])
                  .range([ height, 0]);
      chart.append('g')
           .call(d3.axisLeft(y));
  
      // Add dots
      chart.append('g')
           .selectAll("dot")
           .data(data)
           .enter()
           .append("circle")
             .attr("cx", d => x(d.AGE))
             .attr("cy", d => y(d.HOURWAGE))
             .attr("r", 5)
             .style("fill", "#69b3a2");
  
      // Predicted Hour Wage line
      // Assuming linear relation for simplicity, you might need a more complex approach
      const line = d3.line()
                     .x(d => x(d.EDUC))
                     .y(d => y(d.PREDICTED_HOURWAGE_with_educ));
  
      chart.append("path")
           .datum(data)
           .attr("fill", "none")
           .attr("stroke", "steelblue")
           .attr("stroke-width", 1.5)
           .attr("d", line);
    }
  </script>
  
  <div>
    <input type="range" bind:value={$educSelected} min="0" max="20" step="1">
    <span>Education Years: {$educSelected}</span>
  </div>
  
  <svg id="chart" width="500" height="450"></svg>
  