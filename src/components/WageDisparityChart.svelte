<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import { base } from '$app/paths';
  
    let jsonData;
    let filteredData;
    let averageEducByRace = {};
  
    onMount(async () => {
        const response = await fetch(`${base}/data.json`);
        jsonData = await response.json();
        if (jsonData) {
            filteredData = jsonData.filter(d => d.REGION === "SOUTH REGION");
  
            // Calculate the average EDUC for each RACE
            filteredData.forEach(item => {
                if (averageEducByRace[item.RACE]) {
                    averageEducByRace[item.RACE].total += parseInt(item.EDUC);
                    averageEducByRace[item.RACE].count += 1;
                } else {
                    averageEducByRace[item.RACE] = { total: parseInt(item.EDUC), count: 1 };
                }
            });
  
            for (let race in averageEducByRace) {
                averageEducByRace[race] = averageEducByRace[race].total / averageEducByRace[race].count;
            }
  
            // Create the chart after the component has been mounted and data is ready
            createChart();
        }
    });
  
    function createChart() {
        const data = Object.entries(averageEducByRace).map(([key, value]) => ({ race: key, averageEduc: value }));
  
        // Define a custom color scale
        const raceColors = {
            "White": "lightgray", // Example color for White race
            "Black or African American": "black", // Example color for Black or African American race
            // Add other races and their colors as needed
        };
  
        const svg = d3.select("#raceEducChart"),
            margin = {top: 20, right: 100, bottom: 30, left: 40},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;
  
        const x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
            y = d3.scaleLinear().rangeRound([height, 0]);
  
        const g = svg.append("g")
                     .attr("transform", `translate(${margin.left},${margin.top})`);
  
        x.domain(data.map(d => d.race));
        y.domain([0, d3.max(data, d => d.averageEduc)]);
  
        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));
  
        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(10))
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Average EDUC");
  
        g.selectAll(".bar")
          .data(data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.race))
            .attr("y", d => y(d.averageEduc))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.averageEduc))
            .attr("fill", d => raceColors[d.race] || "grey"); // Use custom color or fallback to grey
  
        // Add legend
        const legend = svg.selectAll(".legend")
          .data(Object.keys(raceColors))
          .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => "translate(0," + i * 20 + ")")
            .style("font", "10px sans-serif");
  
        legend.append("rect")
            .attr("x", width + 18)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", d => raceColors[d]);
  
        legend.append("text")
            .attr("x", width + 44)
            .attr("y", 9)
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .text(d => d);
    }
  </script>
  
  <svelte:head>
      <title>Wage Disparity Chart</title>
  </svelte:head>
  
  <div class="chart-container">
    <h2>Wage Disparity Chart</h2>
    <svg id="raceEducChart" width="960" height="500"></svg>
  </div>
  