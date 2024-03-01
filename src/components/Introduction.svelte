<script>
    import { fade } from 'svelte/transition';
    export let show = false; // This prop determines if the introduction should be visible
</script>

<div class="introduction" in:fade={{ duration: 1000 }} out:fade={{ duration: 1000 }} class:visible={show}>
    <h1>Understanding Wage Disparities</h1>
    <h1 in:fade={{ duration: 3000 }}>Understanding Wage Disparities</h1>
    <p>Wage disparity is a critical issue that affects economic equity and social justice worldwide. Through our visualizations, we aim to explore the various dimensions of wage gaps, understand their implications, and discuss potential solutions.</p>
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
    }
    h1 {
      color: #333;
    }
    p {
      color: #666;
      line-height: 1.6;
    }
    .introduction {
    transition: opacity 1s ease;
    opacity: 0;
    }
    .introduction.visible {
        opacity: 1;
    }
  </style>
 
 
 