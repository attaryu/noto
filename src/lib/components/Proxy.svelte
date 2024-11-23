<script lang="ts">
  let { as = false, children, fallback, ...props }: any = $props();
</script>

{#if as}
  {@render as(props, children)}
{:else}
  {@render fallback(props, children)}
{/if}
