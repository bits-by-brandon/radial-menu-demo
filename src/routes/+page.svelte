<script>
	import RadialMenu from '../components/RadialMenu.svelte';
	import Window from '../components/Window.svelte';

	let items = ['Option 1', 'Option 2', 'Option 3'];
</script>

<main>
	<RadialMenu {items} />
	<Window />
</main>

<style>
	:global(body, html) {
		background-color: #efefef;
		height: 100%;
		margin: 0;
		padding: 0;
	}
</style>
