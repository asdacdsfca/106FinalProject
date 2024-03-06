<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import { base } from '$app/paths';
    export let index;
  
    let jsonData;
    let averageIncomeByRace = {};
  
    onMount(async () => {
        const response = await fetch(`${base}/data.json`);
        jsonData = await response.json();
        if (jsonData) {
            jsonData.forEach(item => {
                if (averageIncomeByRace[item.RACE]) {
                    averageIncomeByRace[item.RACE].total += parseInt(item.HOURWAGE);
                    averageIncomeByRace[item.RACE].count += 1;
                } else {
                    averageIncomeByRace[item.RACE] = { total: parseInt(item.HOURWAGE), count: 1 };
                }
            });
  
            for (let race in averageIncomeByRace) {
                averageIncomeByRace[race] = averageIncomeByRace[race].total / averageIncomeByRace[race].count;
            }
  
            createChart();
        }
    });
  
    function createChart() {
        const data = Object.entries(averageIncomeByRace).map(([race, avg], index) => ({
            race,
            averageIncome: avg,
            color: index === 0 ? 'red' : index === 1 ? 'blue' : 'steelblue'
        }));
  
        const svg = d3.select("#raceIncomeChart"),
              margin = {top: 40, right: 20, bottom: 60, left: 60},
              width = +svg.attr("width") - margin.left - margin.right,
              height = +svg.attr("height") - margin.top - margin.bottom;
  
        const x = d3.scaleBand()
                    .range([0, width])
                    .padding(0.1);
        const y = d3.scaleLinear()
                    .range([height, 0]);
  
        svg.append("g")
           .attr("transform", `translate(${margin.left},${margin.top})`);
  
        x.domain(data.map(d => d.race));
        y.domain([0, d3.max(data, d => d.averageIncome)]);
  
        // Tooltip setup
        const tooltip = d3.select("body").append("div")
                            .attr("class", "tooltip")
                            .style("opacity", 0)
                            .style("position", "absolute")
                            .style("background", "lightgray")
                            .style("padding", "5px 10px")
                            .style("border", "1px solid #000")
                            .style("border-radius", "5px")
                            .style("pointer-events", "none")
                            .style("z-index", "10"); // Ensure tooltip is in front of other elements

        const g = svg.append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);

        // Append x-axis and its title
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .append("text")
            .attr("y", margin.bottom - 10)
            .attr("x", width / 2)
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("Race");

        // Append y-axis and its title
        g.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-3.5em")
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("Average Hourly Wage");

            g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.race))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.averageIncome))
            .attr("height", d => height - y(d.averageIncome))
            .attr("fill", d => d.color)
            .on("mouseover", function(event, d) {
                // Highlight the bar
                d3.select(this)
                .transition()
                .duration(200) // Duration in milliseconds
                .attr("fill", "gold"); // Change the fill or you can adjust the stroke, opacity, etc.

                // Show tooltip
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Race: ${d.race}<br/>Average Hourly Wage: $${d.averageIncome.toFixed(2)}`)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(event, d) {
                // Revert the highlight effect
                d3.select(this)
                .transition()
                .duration(200) // Match the duration of the mouseover transition for consistency
                .attr("fill", d => d.color); // Change the fill back to its original

                // Hide tooltip
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

            // Legend Setup
            const legend = svg.append("g")
                            .attr("font-family", "sans-serif")
                            .attr("font-size", 10)
                            .attr("text-anchor", "end")
                            .selectAll("g")
                            .data(data.slice(0, data.length)) // Use the entire 'data' array if you want a legend for each item
                            .enter().append("g")
                            .attr("transform", (d, i) => `translate(-50,${i * 20})`); // Position each legend item

            // Append color swatches to legend items
            legend.append("rect")
                .attr("x", width - 19) // Adjust according to your chart's dimensions
                .attr("width", 19)
                .attr("height", 19)
                .attr("fill", d => d.color);

            // Append text labels to legend items
            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9.5)
                .attr("dy", "0.32em")
                .text(d => d.race);
    }
    let isVisible = false;

    $: if (index === 2) {
        isVisible = true;
    } else {
        isVisible = false;
    }
  </script>
  
  <svelte:head>
      <title>Wage Disparity Chart</title>
  </svelte:head>
  
  <div class="chart-container" class:visible={isVisible}>
      <h2 class="chart-title">Wage Disparity Chart</h2>
      <svg id="raceIncomeChart" width="960" height="600"></svg>
  </div>
  
  <style>
    .chart-container{
        width: 100%;
        height: 100vh; /* check problem when setting width */
        position: absolute;
        opacity: 0;
        visibility: hidden;
        transition: opacity 2s, visibility 2s;
        /* outline: blue solid 3px; */
    }
    .chart-container.visible {
        opacity: 1;
        visibility: visible;
    }
  </style>
  
  
