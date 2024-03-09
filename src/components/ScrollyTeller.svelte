<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import Scroller from "@sveltejs/svelte-scroller";
    import Introduction from "./Introduction.svelte";
    import Graph from "./Graph.svelte";
    import Income from "./Income.svelte";
    import USMap from "./USMap.svelte";
    import Educ from "./Educ.svelte";
    import BasicRegression from "./BasicRegression.svelte";
    import Bread from "./Bread.svelte";
    import AgeEduc from './AgeEduc.svelte';
    import AgeEducRegion from './AgeEducRegion.svelte';

  let count, index, offset, progress;
  let canNavigateToAgeEduc = false;
  let showIncorrectChoiceMessage = false;

  function navigateToNextSection() {
    canNavigateToAgeEduc = true;
    showIncorrectChoiceMessage = false; // Reset the message display
  }

  function handleIncorrectChoice() {
    showIncorrectChoiceMessage = true;
  }

  onMount(() => {
    // Component setup logic
  });

</script>
<Scroller
  top={0.0}
  bottom={1}
  threshold={0.5}
  bind:count
  bind:index
  bind:offset
  bind:progress
>
  <div class="background" slot="background">
    <div class="progress-bars">
      <p>current section: <strong>{index + 1}/{count}</strong></p>
      <progress value={count ? (index + 1) / count : 0} />

      <p>offset in current section</p>
      <progress value={offset || 0} />

      <p>total progress</p>
      <progress value={progress || 0} />
    </div>
  </div>

  <div class="foreground" slot="foreground">
    <section>
      <Introduction />
    </section>

    <section>
      <Income {index} />
    </section>

    <section>
      <!-- Add a key that changes based on the index -->
      {#key index === 2} 
        <Bread {index} />
      {/key}
    </section>

    <section>
      <Educ {index} />
    </section>

    <section>
      {#if index === 4 || canNavigateToAgeEduc}
        <BasicRegression {index} />
        <div class="button-container">
        <button on:click={navigateToNextSection}>Go to Next Section</button>
        <button on:click={handleIncorrectChoice}>Incorrect Choice</button>
      </div>
        {#if showIncorrectChoiceMessage}
          <p class="error-message">This is not the correct choice. Please try again.</p>
        {/if}
      {/if}
    </section>

    <section>
      {#if canNavigateToAgeEduc}
      <AgeEduc {index} />
      {/if}
    </section>

    <section>
      <AgeEducRegion />
    </section>

    <section>
      <USMap {index} />
    </section>
  </div>
</Scroller>

<style>
  

  .progress-bars {
    position: absolute;
    background: rgba(170, 51, 120, 0.2) /*  40% opaque */;
    visibility: hidden;
  }

  section {
  display: flex; /* Enables Flexbox layout within the section */
  flex-direction: column; /* Stacks flex items vertically */
  justify-content: center; /* Centers flex items vertically within the container */
  align-items: center; /* Centers flex items horizontally within the container */
  min-height: 80vh; /* Ensures that the section is at least 80% of the viewport height */
  background-color: rgba(255, 255, 255, 0.2); /* 20% opaque */
  outline: rgb(255, 255, 255) solid 3px;
  text-align: center;
  width: 90%; /* Allows the section to take up more of the width of the page, up to 90% */
  max-width: none; /* Removes the maximum width restriction */
  color: black;
  padding: 1em;
  margin: auto; /* Centers the section horizontally */
}

.button-container {
    display: flex;
    justify-content: space-between; /* This will put space between the buttons */
    align-items: center; /* This will vertically center align the items */
    gap: 40px;
    margin-bottom: 1rem; /* Give some space below the buttons */
  }

  button {
    padding: 1rem 2rem; /* Larger padding for bigger buttons */
    font-size: 1.2rem; /* Larger font size for text inside buttons */
    cursor: pointer; /* Changes the cursor to indicate it's clickable */
    margin: 0; /* Reset any default margin */
    border: 1px solid #ccc; /* Add a border to the button */
    background-color: #f8f8f8; /* Light background for the button */
    transition: background-color 0.3s ease; /* Smooth transition for hover effect */
  }

  button:hover {
    background-color: #e8e8e8; /* Slightly darker background on hover */
  }

  .error-message {
    color: red;
    text-align: center; /* Center-align the error message text */
    font-size: 36px;
    margin-top: 1rem; /* Give some space above the error message */
  }

</style>
