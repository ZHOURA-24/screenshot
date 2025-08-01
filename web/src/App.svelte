<script lang="ts">
	import { renderGame } from './lib/rendergame';
	import { useNuiEvent } from './lib/hooks/useNuiEvent';
	import { fetchNui } from './lib/utils/fetchNui';

	let image = $state('');

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

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		renderGame(canvas);

		const url = canvas.toDataURL(
			`image/${options.type || 'png'}`,
			options.quality || 0.5
		);
		fetchNui('screenshot', url).then(() => {
			image = url;
		});

		canvas = null;
	});
</script>

<main>
	<!-- {#if image}
		<img src={image} alt="screenshot" />
	{/if} -->
</main>

<style>
	main {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
