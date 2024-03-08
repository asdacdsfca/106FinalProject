<script>
    import { onMount } from 'svelte';
    export let animate = false;
    
    // Define the number of bread loaves
    let loavesCount = 2500; // Replace with your actual calculation
    let loaves = Array(loavesCount).fill(0);
  </script>
  
  <style>
    .bread-container {
        max-width: 1000px;
        margin: auto;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
    }
    
    .bread {
      width: 30px;
      height: 50px;
      background-image: url('./bread_1.png');
      background-size: cover;
      margin: 2px;
      transform: translateY(100%);
      opacity: 0;
    }
  
    /* Keyframes for rising animation */
    @keyframes rise {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  
    /* Apply the animation to each bread loaf with a slight staggered delay */
    .bread {
      animation: rise 1s forwards;
      opacity: 0; /* start invisible */
        transform: translateY(20px); /* start translated down */
        transition: opacity 0.5s, transform 0.5s;
    }

    .bread.animate {
        opacity: 1; /* end at full opacity */
        transform: translateY(0); /* end at original position */
    }
  </style>
  
  <div class="bread-container">
    {#each loaves as _, index (index)}
        <div class={`bread ${animate ? 'animate' : ''}`} style="animation-delay: {index * 0.02}s;"></div>
    {/each}
  </div>
  