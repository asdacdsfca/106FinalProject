<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import * as d3 from 'd3';
  import { base } from '$app/paths';

  let outjsonData = writable([]);
  let filteredData = [];
  let ageSelected = writable(25); // Default value
  let educSelected = writable(10); // Default value
  function renderLatex() {
  const options = {
    throwOnError: false
    };
    katex.render(`\\text{Predicted Wage for White Individuals: } Wage = ${intercept} + (${coef_educ} \\times Education)`, document.getElementById('wageWhiteEq'), options);
    katex.render(`\\text{Predicted Wage for Black Individuals: } Wage = ${intercept} + (${coef_educ} \\times Education) + ${coef_race_black} + (${coef_educ_race_black} \\times Education)`, document.getElementById('wageBlackEq'), options);
  }
  onMount(async () => {
    const response = await fetch(`${base}/output.json`);
    outjsonData.set(await response.json());
    renderLatex();

    drawCombinedGraph();
  });
  ///////
  let intercept = -16.3064; // placeholder for intercept from the model
  let coef_educ = 3.6208; // placeholder for education coefficient from the model
  let coef_race_black = -0.0658; // placeholder for race (Black) coefficient from the model
  let coef_educ_race_black = -0.3298;
  let educationLevel = writable();

  // Function to calculate predicted hourly wage for White individuals
  function predictWageWhite(education) {
    return intercept + coef_educ * education;
  }

  // Function to calculate predicted hourly wage for Black individuals
  function predictWageBlack(education) {
    return intercept + coef_educ * education + coef_race_black + coef_educ_race_black * education;
  }
  function drawCombinedGraph() {
  // Clear existing graph
  d3.select("#chart").selectAll("*").remove();

  const svgWidth = 500;
  const svgHeight = 450;
  const margin = {top: 40, right: 30, bottom: 70, left: 60},
        width = svgWidth - margin.left - margin.right,
        height = svgHeight - margin.top - margin.bottom;

  const svg = d3.select("#chart")
                .attr("width", svgWidth)
                .attr("height", svgHeight)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

  // Data generation for both lines
  let data = d3.range(0, 21).map(function(d) {
    return {education: d, wageWhite: intercept + coef_educ * d, wageBlack: intercept + coef_educ * d + coef_race_black + coef_educ_race_black * d};
  });

  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, 20])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .append("text")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("fill", "black")
    .style("text-anchor", "middle")
    .text("Years of Education");

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([-20, d3.max(data, d => Math.max(d.wageWhite, d.wageBlack))])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -height / 2)
    .attr("dy", "1em")
    .attr("fill", "black")
    .style("text-anchor", "middle")
    .text("Predicted Wage");

  // Line generators
  const lineWhite = d3.line()
    .x(d => x(d.education))
    .y(d => y(d.wageWhite));

  const lineBlack = d3.line()
    .x(d => x(d.education))
    .y(d => y(d.wageBlack));

  // Draw lines
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", lineWhite);

  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr("d", lineBlack);

  // Legend
  svg.append("circle").attr("cx",200).attr("cy",0).attr("r", 6).style("fill", "steelblue")
  svg.append("circle").attr("cx",200).attr("cy",20).attr("r", 6).style("fill", "red")
  svg.append("text").attr("x", 220).attr("y", 0).text("White Individuals").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 220).attr("y", 20).text("Black Individuals").style("font-size", "15px").attr("alignment-baseline","middle")
}

// These are computed values based on `educationLevel`, recalculated whenever `educationLevel` changes
  $: predictedWageWhite = $educationLevel * coef_educ + intercept;
  $: predictedWageBlack = ($educationLevel * coef_educ + intercept) + coef_race_black + ($educationLevel * coef_educ_race_black);

</script>
<h2 style="color: red; font-weight: bold;font-style: italic;">**Feel Free to Play Around and See how Education Affects Wage Differently for Blacks and Whites!**</h2>
<div>
  <h2>Education Level Input</h2>
  <label for="educationLevel">Years of Education:</label>
  <input type="number" bind:value={$educationLevel} min="0" id="educationLevel" placeholder="Change the years of education here" />
</div>
<h2>Predicted Hourly Wage</h2>
<div id="wageWhiteEq"></div>
<div id="wageBlackEq"></div>
<p>For a White individual with {$educationLevel} years of education: ${predictedWageWhite.toFixed(2)}</p>
<p>For a Black individual with {$educationLevel} years of education: ${predictedWageBlack.toFixed(2)}</p>
<div class="svg-container">
  <svg id="chart"></svg>
</div>
<style>
  input, label {
    font-family: Arial, sans-serif;
    margin: 5px 0;
  }
  #chart {
  display: block;
  margin: auto;
}
</style>

<div>
  <input type="range" bind:value={$educSelected} min="0" max="20" step="1">
  <span>Education Years: {$educSelected}</span>
</div>



<div>
  <svg id="chart"></svg>
</div>
