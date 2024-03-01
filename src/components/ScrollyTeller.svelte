<script>
  import Scroller from "@sveltejs/svelte-scroller";
  import Introduction from "./Introduction.svelte";
  let count, index, offset, progress;
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
    <section>This is the second section.</section>
    <section>This is the third section.</section>
  </div>

</Scroller>
<style>
  .progress-bars {
    position: absolute;
    background: rgba(170, 51, 120, 0.2) /*  40% opaque */;
    visibility: hidden;
  }

  section {
    height: 80vh;
    background-color: rgba(255, 255, 255, 0.2); /* 20% opaque */
    /* color: white; */
    outline: rgb(255, 255, 255) solid 3px;
    text-align: center;
    max-width: 750px; /* adjust at will */
    color: black;
    padding: 1em;
    margin: 0 0 4em 0;
  }
</style>
