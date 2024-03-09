<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import * as d3 from 'd3';
    import { base } from '$app/paths';
  
    let outjsonData = writable([]);
    let ageLevel = writable(25); // Use writable store for age
    let educationLevel = writable(16); // Add writable store for education level
    let intercept = -16.3064;
    let coef_educ = 3.6208;
    let coef_race_black = -0.0658;
    let coef_educ_race_black = -0.3102;
    let coef_age = 0.3027;
    let coef_age_educ = 0.0121;
  
    // Updated function to calculate predicted hourly wage, considering fixed education level
    function predictWageWhite(age, education) {
      return intercept + coef_educ * education + coef_age * age + coef_age_educ * age * education;
    }
  
    function predictWageBlack(age, education) {
      return intercept + coef_educ * education + coef_race_black + coef_educ_race_black * education + coef_age * age + coef_age_educ * age * education;
    }
  
    // Adjusted for new parameters and fixed education level
    $: predictedWageWhite = predictWageWhite($ageLevel, $educationLevel);
    $: predictedWageBlack = predictWageBlack($ageLevel, $educationLevel)
  
    // Updated renderLatex to include age and fixed education level in the equation
    function renderLatex() {
      const options = { throwOnError: false };
  katex.render(`\\text{Predicted Wage for White Individuals: } Wage = ${intercept.toFixed(2)} + (${coef_educ.toFixed(2)} \\times Education) + (${coef_age.toFixed(2)} \\times Age) + (${coef_age_educ.toFixed(2)} \\times Education \\times Age)`, document.getElementById('wageWhiteEq'), options);
  katex.render(`\\text{Predicted Wage for Black Individuals: } Wage = ${intercept.toFixed(2)} + (${coef_educ.toFixed(2)} \\times Education)  + (${-0.376.toFixed(2)} \\times Black) + (${coef_age.toFixed(2)} \\times Age) + (${coef_age_educ.toFixed(2)} \\times Education \\times Age)`, document.getElementById('wageBlackEq'), options);
  
    }
  
    function drawCombinedGraph() {
    d3.select("#chart").selectAll("*").remove();
    const svgWidth = 500;
    const svgHeight = 450;
    const margin = { top: 40, right: 30, bottom: 70, left: 60 },
          width = svgWidth - margin.left - margin.right,
          height = svgHeight - margin.top - margin.bottom;
  
    const svg = d3.select("#chart").append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
  
  
    // Data for bars
    let data = [
        {group: "White Individuals", value: predictWageWhite($ageLevel, $educationLevel)},
        {group: "Black Individuals", value: predictWageBlack($ageLevel, $educationLevel)}
      ];
  
    // Add X axis
    const x = d3.scaleBand()
                .range([0, width])
                .domain(data.map(d => d.group))
                .padding(0.2);
    svg.append("g")
       .attr("transform", `translate(0, ${height})`)
       .call(d3.axisBottom(x))
       .selectAll("text")
       .attr("transform", "translate(-10,0)rotate(-45)")
       .style("text-anchor", "end");
  
    // Add Y axis
    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.value)])
                .range([height, 0]);
    svg.append("g")
       .call(d3.axisLeft(y));
  
    // Bars
    svg.selectAll("mybar")
       .data(data)
       .enter()
       .append("rect")
       .attr("x", d => x(d.group))
       .attr("y", d => y(d.value))
       .attr("width", x.bandwidth())
       .attr("height", d => height - y(d.value))
       .attr("fill", (d, i) => i === 0 ? "steelblue" : "red");
  }
  $: if ($ageLevel || $educationLevel) {
      drawCombinedGraph();
  }
  
    onMount(async () => {
      const response = await fetch(`${base}/output.json`);
      outjsonData.set(await response.json());
      renderLatex();
      drawCombinedGraph();
    });
  
  </script>
  
  <h2>Predicted Hourly Wage Based on Age and Education</h2>
  <div>
    <label for="ageLevel">Age:</label>
    <input type="number" bind:value={$ageLevel} min="18" id="ageLevel" placeholder="Enter age here" />
  </div>
  <div>
    <label for="educationLevel">Years of Education:</label>
    <input type="number" bind:value={$educationLevel} min="0" id="educationLevel" placeholder="Enter education years here" />
  </div>
  <div id="wageWhiteEq"></div>
  <div id="wageBlackEq"></div>
  <p>For a White individual with {$educationLevel} years of education and age {$ageLevel}: ${predictedWageWhite.toFixed(2)}</p >
  <p>For a Black individual with {$educationLevel} years of education and age {$ageLevel}: ${predictedWageBlack.toFixed(2)}</p >
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