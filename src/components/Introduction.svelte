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
    <h1>Understanding Wage Disparities</h1>
          <p>Wage disparity is a critical issue that affects economic equity and social justice worldwide.</p>
          <p>Consider the following questions as you navigate the data:</p>
          <ul>
              <li>What patterns emerge in wage disparities across different industries?</li>
              <li>How do wage differences impact socioeconomic status?</li>
              <li>What policy measures could address these disparities effectively?</li>
          </ul>
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
  