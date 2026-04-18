<script lang="ts">
	import { renderGame } from './lib/rendergame';
	import { useNuiEvent } from './lib/hooks/useNuiEvent';
	import { fetchNui } from './lib/utils/fetchNui';

	let image = $state('');

	const debug = false;

	type ScreenshotOptions = {
		quality: number;
		type: string;
	};

	useNuiEvent<ScreenshotOptions>('takeScreenshot', (options) => {
		let canvas: HTMLCanvasElement | null = document.createElement('canvas');

		if (!canvas) {
			console.error('Failed to create canvas');
			return;
		}

		canvas.width = window.innerWidth / 5;
		canvas.height = window.innerHeight / 5;

		renderGame(canvas);

		const url = canvas.toDataURL(
			`image/${options.type || 'png'}`,
			options.quality || 0.5,
		);
		fetchNui('screenshot', url).then(() => {
			if (debug) {
				image = url;
			}
		});

		canvas = null;
	});
</script>

<main>
	{#if debug && image}
		<img src={image} alt="screenshot" />
	{/if}
</main>

<style>
	main {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	img {
		max-width: 50%;
		max-height: 50%;
	}
</style>
