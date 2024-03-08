<script>
    import { fly } from 'svelte/transition';
    export let index;
    let loavesCount = 2500; // Replace with your actual calculation
    let loaves = Array(loavesCount).fill(0);
    let showBread = false;
    $: if (index === 4) {
        showBread = true;
    } else {
        showBread = false;
    }
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
      animation: rise 0.1s forwards;
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
    {#if showBread}
      {#each loaves as _, i (i)}
        <div class="bread" in:fly="{{ y: 20, delay: i * 20, duration: 500 }}"></div>
      {/each}
    {/if}
  </div>
  