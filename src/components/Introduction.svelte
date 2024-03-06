<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
  
    let isVisible = false;
  
    onMount(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          // Only consider the first entry, which is the current element
          const entry = entries[0];
          isVisible = entry.isIntersecting;
        },
        {
          rootMargin: '0px',
          threshold: 0.1 // Adjust threshold to when you consider the section "visible"
        }
      );
  
      // Observe the current component
      observer.observe(document.querySelector('.introduction'));
  
      return () => {
        // Disconnect the observer on component destruction
        observer.disconnect();
      };
    });
  </script>
  
  <div class="introduction" in:fade={{ duration: 3000 }} class:visible={isVisible}>
    <h1>Exploring the Impact of Wage Disparities</h1>
    <p>Wage disparities represent a significant challenge that intersects with economic equity, social justice, and policy development. These disparities not only reflect but also contribute to the inequalities within our societies, impacting millions of lives by influencing access to resources, opportunities, and wellbeing.</p>
    <p>Understanding the causes and consequences of wage disparities is crucial for crafting effective solutions. As we delve into this data, we encourage you to consider:</p>
    <ul>
        <li>What are the primary factors driving wage disparities?</li>
        <li>How significant are these disparities across different sectors and demographics?</li>
        <li>What are some less obvious influences that contribute to wage disparities?</li>
        <li>Why is addressing wage disparities important for economic, social, and policy-making contexts?</li> 
    </ul>
    <p>By examining these questions, we aim to prime your curiosity and provide a framework for a deeper understanding of the issue at hand. Join us in exploring the multifaceted impacts of wage disparities and the steps we can take towards a more equitable future.</p>
  </div>

  
  <style>
    .introduction {
      padding: 20px;
      background-color: #f3f3f3;
      border-radius: 8px;
      margin-bottom: 20px;
      font-family: Arial, sans-serif;
      color: #333;
      line-height: 1.6;
    }
    
    .visible {
        transition: opacity 1s ease;
        opacity: 1;
    }

    /* Initially, the component is not visible */
    .introduction:not(.visible) {
        opacity: 0;
    }
  </style>
  