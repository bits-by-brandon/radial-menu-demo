<script lang="ts">
	import { onMount } from 'svelte';
	import { polarToCartesian } from '../lib/math';
	import { menuOpen } from '../stores/cursor';

	type Arc = {
		start: number;
		end: number;
	};

	let lineEl: SVGPathElement;

	export let arc: Arc;
	export let isHovered: boolean;
	export let offset: number;
	export let radius: number;
	let length: number = 0;

	onMount(() => {
		length = lineEl.getTotalLength();
	});

	$: end = polarToCartesian(radius - offset, arc.start);
	$: path = `
    M ${radius} ${radius}
    L ${end.x + radius} ${end.y + radius}
  `;

	$: midArc = arc.start + (arc.end - arc.start) / 2;
	$: textPosStart = polarToCartesian(radius * 0.5, midArc);
	$: textPosEnd = polarToCartesian(radius * 0.6, midArc);
	$: textPosHover = polarToCartesian(radius * 0.7, midArc);
	$: textPos = isHovered ? textPosHover : $menuOpen ? textPosEnd : textPosStart;
</script>

<div class="item">
	<svg width={radius * 2} height={radius * 2}>
		<path
			bind:this={lineEl}
			class="line"
			class:active={$menuOpen}
			style:stroke-dasharray={length}
			style:stroke-dashoffset={$menuOpen ? 0 : length}
			style:opacity={$menuOpen ? 1 : 0}
			stroke-width="1"
			d={path}
		/>
	</svg>

	<div
		class="textContainer"
		class:active={$menuOpen}
		class:hovered={isHovered}
		style:opacity={$menuOpen ? 1 : 0}
		style:top="50%"
		style:left="50%"
		style:transform={`translate(${textPos.x}px, ${textPos.y}px)`}
	>
		<div class="textInner">
			<slot />
		</div>
	</div>
</div>

<style>
	.item {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.line {
		stroke: var(--stoke-color);
		transition: stroke-dashoffset 300ms cubic-bezier(0, 0.76, 0.24, 1), opacity 100ms linear;
	}

	.line.active {
		transition: stroke-dashoffset 1200ms cubic-bezier(0, 0.76, 0.24, 1) 200ms, opacity 200ms linear;
	}

	.textContainer {
		position: absolute;
		transition: transform 200ms cubic-bezier(0, 0.76, 0.24, 1), opacity 100ms linear;
	}

	.textContainer.hovered {
		transition: transform 200ms ease-in-out;
	}

	.textContainer.active {
		transition: transform 1000ms cubic-bezier(0, 0.76, 0.24, 1) 100ms, opacity 300ms linear 100ms;
	}

	.textInner {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		transform: translate(-50%, -50%);
		width: 70px;
		font-family: sans-serif;
		-webkit-user-select: none;
		user-select: none;
	}
</style>
