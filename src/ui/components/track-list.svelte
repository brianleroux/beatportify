<script lang="ts">
  import { fade } from "svelte/transition";

  import TrackItem from "./track-item.svelte";

  import type { Track } from "@typings/app";

  export let tracks: Track[] = [];
</script>

<section
  class="tracklist"
  class:tracklist--header={$$slots.header}
  class:tracklist--footer={$$slots.footer}
  class:tracklist--header-footer={$$slots.header && $$slots.footer}
>
  <slot name="header" />

  {#if tracks?.length}
    <div class="tracklist__items" in:fade>
      {#each tracks as item (item.id)}
        <TrackItem {item} />
      {/each}
    </div>
  {:else}
    <div class="tracklist__items" />
  {/if}

  <slot name="footer" />
</section>

<style lang="scss">
  .tracklist {
    display: grid;
    align-items: start;
    gap: 1rem;

    overflow: hidden;
    height: 100%;

    &.tracklist--header {
      grid-template-rows: auto 1fr;
    }

    &.tracklist--footer {
      grid-template-rows: 1fr auto;
    }

    &.tracklist--header-footer {
      grid-template-rows: auto 1fr auto;
    }
  }

  .tracklist__items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1rem;

    overflow: hidden auto;
    max-height: 100%;
    padding: 1rem;

    @media (--mq-medium) {
      padding: 1rem 0;
    }
  }
</style>
