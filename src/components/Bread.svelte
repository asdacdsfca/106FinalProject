<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
  
    export let index;
    let loavesCount = 2500;
    let svg;
  
    onMount(() => {
      if (index === 2) {
        const width = 960; // SVG width, adjust as needed
        const height = 500; // SVG height, adjust as needed
        const container = d3.select(svg)
          .attr('width', width)
          .attr('height', height);
  
        // Assuming a grid layout for bread icons, adjust as needed
        const iconWidth = 30;
        const iconHeight = 50;
        const iconsPerRow = Math.floor(width / iconWidth);
  
        const loavesData = Array.from({ length: loavesCount }, (_, i) => ({
          id: i,
          x: (i % iconsPerRow) * iconWidth,
          y: Math.floor(i / iconsPerRow) * iconHeight
        }));
  
        // Create and position bread icon elements
        container.selectAll('image')
          .data(loavesData)
          .enter()
          .append('image')
          .attr('xlink:href', './bread_1.png')
          .attr('width', iconWidth)
          .attr('height', iconHeight)
          .attr('x', d => d.x)
          .attr('y', d => d.y)
          .attr('opacity', 0) // Start with 0 opacity for animation
          .transition()
          .delay((_, i) => i * 2) // Adjust delay for faster animation
          .duration(50) // Adjust duration for faster animation
          .attr('opacity', 1); // Fade in each icon
  
        // Optionally, display the total after all animations
        setTimeout(() => {
          container.append('text')
            .attr('x', width / 2)
            .attr('y', height / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '24px')
            .text(`Total Bread: ${loavesCount}`);
        }, loavesData.length * 2 + 50);
      }
    });
  </script>
  
  <svg bind:this={svg}></svg>
  
  