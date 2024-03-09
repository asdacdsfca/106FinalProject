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
    katex.render(`\\text{Predicted Wage for Black Individuals: } Wage = ${intercept} + (${coef_educ} \\times Education)  + (${coef_race_black} \\times Black) + (${coef_educ_race_black} \\times Black*Educ)`, document.getElementById('wageBlackEq'), options);
  }

  $: predictedWageWhite = $educationLevel * coef_educ + intercept;
  $: predictedWageBlack = ($educationLevel * coef_educ + intercept) + (coef_race_black) + ($educationLevel * coef_educ_race_black);

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
  $: $educationLevel, drawCombinedGraph();
  
  function drawCombinedGraph() {
  // Clear existing graph to prevent overlap
  d3.select("#chart").selectAll("*").remove();

  // SVG setup
  const svgWidth = 500;
  const svgHeight = 450;
  const margin = {top: 40, right: 30, bottom: 70, left: 60};
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  // Append SVG object to the body of the page
  const svg = d3.select("#chart")
                .attr("width", svgWidth)
                .attr("height", svgHeight)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

  // Prepare the data
  const data = [{
    education: "White",
    wage: predictWageWhite($educationLevel)
  }, {
    education: "Black",
    wage: predictWageBlack($educationLevel)
  }];

  // X Axis
  const x = d3.scaleBand()
    .range([0, width])
    .domain(data.map(d => d.education))
    .padding(0.1);
  
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Y Axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.wage)])
    .range([height, 0]);
  
  svg.append("g")
    .call(d3.axisLeft(y));
  
  svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x",0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Predicted Wage");

  // Bars
  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.education))
      .attr("width", x.bandwidth())
      .attr("y", d => y(d.wage))
      .attr("height", d => height - y(d.wage))
      .attr("fill", d => d.education === "White" ? "steelblue" : "red");
}

</script>
<h2 style="color: red; font-weight: bold;font-style: italic;">**Feel Free to Play Around and See how Education Affects Wage Differently for Blacks and Whites!**</h2>

<div>
  <h2>Education Level Input</h2>
  <label for="educationLevel">Years of Education:</label>
  <input type="number" bind:value={$educationLevel} min="0" id="educationLevel" placeholder="Change the years of education here" />
</div>

<h2>Predicted Hourly Wage</h2>
<div id="wageWhiteEq"></div>
<br>
<div id="wageBlackEq"></div>
<p>For a White individual with {$educationLevel} years of education: ${predictedWageWhite.toFixed(2)}</p >
<p>For a Black individual with {$educationLevel} years of education: ${predictedWageBlack.toFixed(2)}</p >

<div class="svg-container">
  <svg id="chart"></svg>
</div>

<style>
  input, label {
    font-family: Arial, sans-serif;
    margin: 5px 0;
    font-size: 24px;;
  }

  #chart {
  display: block;
  margin: auto;
}
</style>