<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
  
    export let index;
    let loavesCount = 2500;
    let svg;
  
    onMount(() => {
      if (index === 2) {
        const width = 960; // SVG width, adjust as needed
        const height = 1100; // SVG height, adjust as needed
        const container = d3.select(svg)
          .attr('width', width)
          .attr('height', height);
  
        // Assuming a grid layout for bread icons, adjust as needed
        const iconWidth = 20;
        const iconHeight = 20;
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
          .duration(10) // Adjust duration for faster animation
          .attr('opacity', 1); // Fade in each icon
  
        // Display the total after all animations
      setTimeout(() => {
        // Calculate text width and height approximation
        const textWidth = 700; // Approximate width of text, adjust as needed
        const textHeight = 70; // Approximate height of text, adjust as needed
        const rectPadding = 50; // Padding around the rectangle

        // Append a semi-transparent rectangle behind the text
        container.append('rect')
          .attr('x', (width / 2) - (textWidth / 2) - rectPadding)
          .attr('y', (height / 2) - (textHeight / 2) - rectPadding)
          .attr('width', textWidth + (rectPadding * 2))
          .attr('height', textHeight + (rectPadding * 2))
          .attr('fill', 'white')
          .attr('opacity', 0.7); // Adjust opacity as needed for readability

        // Append text element for "Total Bread:"
        container.append('text')
          .attr('x', width / 2)
          .attr('y', (height / 2) - 20) // Position above the number
          .attr('text-anchor', 'middle')
          .style('font-size', '24px')
          .style('font-weight', 'bold')
          .text('To put this into perspective, that amount could buy nearly');

        // Append text element for the number "2500"
        container.append('text')
          .attr('x', width / 2)
          .attr('y', height / 2 + 50)
          .attr('text-anchor', 'middle')
          .style('font-size', '72px')
          .style('font-weight', 'bold')
          .text(`${loavesCount} loaves of bread!`);
      }, loavesData.length * 2 + 50);
    }
  });
  </script>
  
  <svg bind:this={svg}></svg>
  
  