<script>
  import Scroller from "@sveltejs/svelte-scroller";
  import Introduction from "./Introduction.svelte";
  import Graph from "./Graph.svelte";
  import Income from "./Income.svelte";
  import USMap from "./USMap.svelte";
  import Educ from "./Educ.svelte";
  import BasicRegression from "./BasicRegression.svelte";
  import Bread from "./Bread.svelte";

  

  let count, index, offset, progress;
  let animateBread = false;

  // Assuming the bread section is at a certain index, for example 4
  $: if (index === 4) {
    animateBread = true;
  } else {
    animateBread = false;
  }
</script>
<Scroller bind:count bind:index bind:offset bind:progress>
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
      <Educ {index} />
    </section>
    <section>
      <BasicRegression />
    </section>
    <section>
      <!-- Add a key that changes based on the index -->
      {#key index === 4} 
        <Bread {index} />
      {/key}
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

</style>
