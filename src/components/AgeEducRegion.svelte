<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import * as d3 from 'd3';
    import { scaleBand, scaleLinear } from 'd3-scale';
    import { max } from 'd3-array';
    import { base } from '$app/paths';
  
    let outjsonData = writable([]);
    let ageLevel = writable();
    let educationLevel = writable(); 
    let selectedRegion;
    let intercept = -16.3064;
    let coef_educ = 3.6208;
    let coef_race_black = -0.0658;
    let coef_educ_race_black = -0.3102;
    let coef_age = 0.3027;
    let coef_age_educ = 0.0121;

    let predictedWageWhite, predictedWageBlack;
  
    // Updated function to calculate predicted hourly wage, considering fixed education level
    function predictWageWhite(age, education, region) {
      return intercept + coef_educ * education + coef_age * age + coef_age_educ * age * education;
    }
  
    function predictWageBlack(age, education, region) {
      return intercept + coef_educ * education + coef_race_black + coef_educ_race_black * education + coef_age * age + coef_age_educ * age * education;
    }

    $: predictedWageWhite = predictWageWhite($ageLevel, $educationLevel, $selectedRegion);
    $: predictedWageBlack = predictWageBlack($ageLevel, $educationLevel, $selectedRegion);
  
    // Adjusted for new parameters and fixed education level
    function updateWagesAndDrawChart() {
            drawChart();
    }
  
    // Updated renderLatex to include age and fixed education level in the equation
    function renderLatex() {
      const options = { throwOnError: false };
        katex.render(`\\text{Predicted Wage for White Individuals: } Wage = ${intercept.toFixed(2)} + 
        (${coef_educ.toFixed(2)} \\times Education) + (${coef_age.toFixed(2)} \\times Age) + 
        (${coef_age_educ.toFixed(2)} \\times Education \\times Age)`, document.getElementById('wageWhiteEq_AER'), options);
        katex.render(`\\text{Predicted Wage for Black Individuals: } Wage = ${intercept.toFixed(2)} + 
        (${coef_educ.toFixed(2)} \\times Education)  + (${-0.376.toFixed(2)} \\times Black) + 
        (${coef_age.toFixed(2)} \\times Age) + (${coef_age_educ.toFixed(2)} \\times Education \\times Age)`, document.getElementById('wageBlackEq_AER'), options);
    }

    onMount(async () => {
      const response = await fetch(`${base}/output.json`);
      outjsonData.set(await response.json());
      renderLatex();

      drawChart();
    });


    function drawChart() {
        d3.select("#chart_AER").selectAll("*").remove();

    const data = [
      { label: "White", value: predictWageWhite($ageLevel, $educationLevel, $selectedRegion) },
      { label: "Black", value: predictWageBlack($ageLevel, $educationLevel, $selectedRegion) }
    ];
    // SVG setup
  const svgWidth = 500;
  const svgHeight = 450;
  const margin = {top: 40, right: 30, bottom: 70, left: 60};
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

    const x = scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.label))
      .padding(0.1);
      
    const y = scaleLinear()
        .domain([0, max(data, (d) => d.value)])
        .range([height, 0]);
      
      const svg = d3.select("#chart_AER")
                .attr("width", svgWidth)
                .attr("height", svgHeight)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

     // Add x-axis
    svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(x));

    // Add y-axis
    svg.append("g")
       .call(d3.axisLeft(y));

       svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x",0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Predicted Wage");
    
    svg.selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.label))
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => height - y(d.value))
      .attr("fill", (d) => d.label === "White" ? "steelblue" : "red");
      
    svg.selectAll(".label")
      .data(data)
      .join("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.label) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 5)
      .attr("text-anchor", "middle")
      .text((d) => d.value.toFixed(2));
  }
  $: {
      if ($ageLevel !== undefined && $educationLevel !== undefined && $selectedRegion !== undefined) {
        updateWagesAndDrawChart();
      }
    }
  
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
  <div>
    <label for="region-select">Choose a Region:</label>
    <select bind:value={selectedRegion} id="region-select">
        <option value="">--Please choose an option--</option>
        <option value="Northeast">Northeast</option>
        <option value="Midwest">Midwest</option>
        <option value="South">South</option>
        <option value="West">West</option>
    </select>
</div>
  <br>
  <div id="wageWhiteEq_AER"></div>
  <br>
  <div id="wageBlackEq_AER"></div>
  <p>For a White individual with {$educationLevel} years of education, age {$ageLevel}, and located in {$selectedRegion} region: ${predictedWageWhite.toFixed(2)}</p >
  <p>For a Black individual with {$educationLevel} years of education, age {$ageLevel}, and located in {$selectedRegion} region: ${predictedWageBlack.toFixed(2)}</p >
  <div class="svg-container_AER">
    <svg id="chart_AER"></svg>
  </div>
  <style>
    input, label {
      font-family: Arial, sans-serif;
      margin: 5px 0;
      font-size: 24px;;
    }
    #chart_AER {
      display: block;
      margin: auto;
    }
  </style>