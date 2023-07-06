<script lang="ts">
	import { onMount, tick } from 'svelte';
	import RadialMenuItem from './RadialMenuItem.svelte';
	import { getAngle, getDistance } from '../lib/math';

	export let items: string[] = [];

	let container: HTMLElement;
	let circle: HTMLElement;
	let innerCircle: HTMLElement;

	let mousePos: Vector = { x: 0, y: 0 };
	let position: Vector = { x: 0, y: 0 };
	let radius = 150;
	let innerRadius = 50;
	let isActive = false;
	let isPastThreshold = false;
	let hoveredOption = -1;

	function getOption() {
		if (isPastThreshold) {
			let angle = getAngle(mousePos.x, mousePos.y, position.x, position.y);
			angle += Math.PI / 2;
			if (angle > 2 * Math.PI) {
				angle -= 2 * Math.PI;
			}

			return Math.floor((angle * items.length) / (2 * Math.PI));
		} else {
			return -1;
		}
	}

	function handleMouseMove(event: MouseEvent) {
		mousePos = { x: event.clientX, y: event.clientY };

		if (isActive) {
			isPastThreshold = getDistance(mousePos.x, mousePos.y, position.x, position.y) > innerRadius;
			hoveredOption = getOption();
		}
	}

	function handleMouseDown(event: MouseEvent) {
		position = { x: event.clientX, y: event.clientY };
		isPastThreshold = false;
		isActive = true;
		hoveredOption = -1;
	}

	function handleMouseUp(event: MouseEvent) {
		isActive = false;
		isPastThreshold = false;
		hoveredOption = -1;
	}

	function getArc(index: number, total: number) {
		let start = (index / total) * 2 * Math.PI - Math.PI / 2;
		let end = ((index + 1) / total) * 2 * Math.PI - Math.PI / 2;

		if (start < 0) {
			start += 2 * Math.PI;
			end += 2 * Math.PI;
		}

		return { start, end };
	}

	onMount(() => {
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mousedown', handleMouseDown);
		document.addEventListener('mouseup', handleMouseUp);
		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mousedown', handleMouseDown);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	});
</script>

<div
	class="radialMenu"
	style:--radius="{radius}px"
	style:transform="translate({position.x - radius}px, {position.y - radius}px)"
	draggable="false"
	bind:this={container}
>
	<div
		class="circle"
		class:active={isActive}
		style:background-position="{mousePos.x - position.x}px {mousePos.y - position.y}px"
    draggable="false"
		bind:this={circle}
	/>

	<div class="items">
		{#each items as item, i}
			<RadialMenuItem
				{radius}
				{isActive}
				isHovered={hoveredOption == i}
				arc={getArc(i, items.length)}
				offset={10}
			>
				{item}
			</RadialMenuItem>
		{/each}
	</div>

	<div
		class="innerCircle"
		class:active={isActive}
		style:--inner-radius="{innerRadius}px"
		bind:this={innerCircle}
	/>
</div>

<style>
	.radialMenu {
		--stoke-color: rgb(142, 142, 142);
		width: calc(var(--radius) * 2);
		height: calc(var(--radius) * 2);
		position: absolute;
	}

	.circle {
		width: 100%;
		height: 100%;
		border-radius: 100%;
		border: 1px solid var(--stoke-color);
		transition: transform 400ms cubic-bezier(0, 0.76, 0.24, 1), opacity 200ms linear;
		background: radial-gradient(circle, rgba(34, 0, 255, 0.05) 0%, rgba(255, 255, 255, 0) 90%)
			no-repeat;
		opacity: 0;
		transform: scale(0.5);
	}

	.circle.active {
		transition: transform 1000ms cubic-bezier(0, 0.76, 0.24, 1) 80ms, opacity 400ms linear 10ms;
		opacity: 1;
		transform: scale(1);
	}

	.innerCircle {
		position: absolute;
		width: calc(var(--inner-radius) * 2);
		height: calc(var(--inner-radius) * 2);
		top: 50%;
		left: 50%;
		border-radius: 100%;
		background-color: white;
		opacity: 0;
		transform: translate(-50%, -50%) scale(0.2);
		transition: transform 200ms ease-in 100ms, opacity 150ms ease-in 100ms;
	}

	.innerCircle.active {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
		transition: transform 400ms cubic-bezier(0, 0.76, 0.24, 1), opacity 150ms ease-out;
	}
</style>
