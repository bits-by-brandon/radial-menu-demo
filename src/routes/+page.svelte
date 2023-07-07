<script>
	import RadialMenu from '../components/RadialMenu.svelte';
	import Window from '../components/Window.svelte';

	let items = ['Option 1', 'Option 2', 'Option 3'];
  let windows = Array(12);
</script>

<main>
	<RadialMenu {items} />
	{#each windows as _}
		<Window
		/>
	{/each}
</main>

<style>
	:global(body, html) {
		background-color: #efefef;
		height: 100%;
    width: 100%;
		margin: 0;
		padding: 0;
	}

  main {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }
</style>
