<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import * as d3 from 'd3';
    import { base } from '$app/paths';
  
    let outjsonData = writable([]);
    let ageSelected = writable(25); // Default age selection
    const fixedEducationLevel = 16; // Education level fixed at 16
    let intercept = -16.3064; // Placeholder for intercept from the model
    let coef_educ = 3.6208; // Placeholder for education coefficient from the model
    let coef_race_black = -0.0658; // Placeholder for race (Black) coefficient from the model
    let coef_educ_race_black = -0.3102 ; // Placeholder for interaction term
    let coef_age = 0.3027; // Placeholder for age coefficient from the model
    let coef_age_educ = 0.0121; // Placeholder for age and education interaction coefficient from the model
    let ageLevel = writable(25); // Initializing with a default value
  
    // Updated function to calculate predicted hourly wage, considering fixed education level
    function predictWageWhite(age) {
      return intercept + coef_educ * fixedEducationLevel + coef_age * age + coef_age_educ * age * fixedEducationLevel;
    }
  
    function predictWageBlack(age) {
      return intercept + coef_educ * fixedEducationLevel + coef_race_black + coef_educ_race_black * fixedEducationLevel + coef_age * age + coef_age_educ * age * fixedEducationLevel;
    }
  
    // Adjusted for new parameters and fixed education level
    $: predictedWageWhite = predictWageWhite($ageLevel);
    $: predictedWageBlack = predictWageBlack($ageLevel);
  
    // Updated renderLatex to include age and fixed education level in the equation
    function renderLatex() {
      const options = { throwOnError: false };
  katex.render(`\\text{Predicted Wage for White Individuals: } Wage = ${intercept.toFixed(2)} + (${coef_educ.toFixed(2)} \\times Education) + (${coef_age.toFixed(2)} \\times Age) + (${coef_age_educ.toFixed(2)} \\times Education \\times Age)`, document.getElementById('wageWhiteEq_AE'), options);
  katex.render(`\\text{Predicted Wage for Black Individuals: } Wage = ${intercept.toFixed(2)} + (${coef_educ.toFixed(2)} \\times Education)  + (${-0.376.toFixed(2)} \\times Black) + (${coef_age.toFixed(2)} \\times Age) + (${coef_age_educ.toFixed(2)} \\times Education \\times Age)`, document.getElementById('wageBlackEq_AE'), options);
  
    }
  
    onMount(async () => {
      const response = await fetch(`${base}/output.json`);
      outjsonData.set(await response.json());
      renderLatex();
  
      drawCombinedGraph();
    });
  
    function drawCombinedGraph() {
      d3.select("#chart_AE").selectAll("*").remove();
      const svgWidth = 500;
      const svgHeight = 450;
      const margin = { top: 40, right: 30, bottom: 70, left: 60 },
            width = svgWidth - margin.left - margin.right,
            height = svgHeight - margin.top - margin.bottom;
  
      const svg = d3.select("#chart_AE")
                    .attr("width", svgWidth)
                    .attr("height", svgHeight)
                    .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);
  
      // Data generation for lines, considering a range of ages from 18 to 65
      let data = d3.range(18, 66).map(age => ({
        age: age,
        wageWhite: predictWageWhite(age),
        wageBlack: predictWageBlack(age)
      }));
  
      // Add X axis
      const x = d3.scaleLinear()
                  .domain([18, 65])
                  .range([0, width]);
      svg.append("g")
         .attr("transform", `translate(0, ${height})`)
         .call(d3.axisBottom(x))
         .append("text")
         .attr("x", width / 2)
         .attr("y", 40)
         .attr("fill", "black")
         .style("text-anchor", "middle")
         .text("Age");
  
      // Add Y axis
      const y = d3.scaleLinear()
                  .domain([0, d3.max(data, d => Math.max(d.wageWhite, d.wageBlack))])
                  .range([height, 0]);
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
                          .x(d => x(d.age))
                          .y(d => y(d.wageWhite));
      const lineBlack = d3.line()
                          .x(d => x(d.age))
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
      svg.append("circle").attr("cx", 400).attr("cy", 0).attr("r", 6).style("fill", "steelblue")
      svg.append("circle").attr("cx", 400).attr("cy", 20).attr("r", 6).style("fill", "red")
      svg.append("text").attr("x", 420).attr("y", 0).text("White Individuals").style("font-size", "15px").attr("alignment-baseline", "middle")
      svg.append("text").attr("x", 420).attr("y", 20).text("Black Individuals").style("font-size", "15px").attr("alignment-baseline", "middle")
    }
  </script>
  
  <h2>Predicted Hourly Wage for 16 Years of Education</h2>
  <h3>We are going to assume that the term "Black" also includes all its correspoding interaction terms with other covarites</h3>

  <div>
    <label for="ageLevel">Age:</label>
    <input type="number" bind:value={$ageLevel} min="18" id="ageLevel" placeholder="Change the age here" />
  </div>

  <h2>Predicted Hourly Wage</h2>
  <div id="wageWhiteEq_AE"></div>
  <br>
  <div id="wageBlackEq_AE"></div>
  <p>For a White individual with 16 years of education and age {$ageLevel}: ${predictedWageWhite.toFixed(2)}</p >
  <p>For a Black individual with 16 years of education and age {$ageLevel}: ${predictedWageBlack.toFixed(2)}</p >

  <div class="svg-container_AE">
    <svg id="chart_AE"></svg>
  </div>

  <style>
    input, label {
      font-family: Arial, sans-serif;
      margin: 5px 0;
      font-size: 24px;
    }
    #chart_AE {
      display: block;
      margin: auto;
    }
  </style>