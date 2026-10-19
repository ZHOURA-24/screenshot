<script lang="ts">
	import { onMount } from 'svelte';
	import { renderGame, type GameView } from './lib/rendergame';
	import { useNuiEvent } from './lib/hooks/useNuiEvent';
	import { fetchNui } from './lib/utils/fetchNui';

	let image = $state('');

	const debug = false;

	type ScreenshotOptions = {
		quality: number;
		type: string;
	};

	let gameView: GameView | null = null;

	const getGameView = (): GameView => {
		const width = Math.max(1, Math.floor(window.innerWidth / 5));
		const height = Math.max(1, Math.floor(window.innerHeight / 5));

		if (!gameView) {
			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			gameView = renderGame(canvas);
		} else {
			gameView.resize(width, height);
		}

		return gameView;
	};

	onMount(() => {
		const view = getGameView();
		requestAnimationFrame(() => {
			view.render();
		});
	});

	useNuiEvent<ScreenshotOptions>('takeScreenshot', (options) => {
		const view = getGameView();

		view.render();

		requestAnimationFrame(() => {
			view.render();

			const url = view.canvas.toDataURL(
				`image/${options?.type || 'png'}`,
				options?.quality || 0.5,
			);

			fetchNui('screenshot', url).then(() => {
				if (debug) {
					image = url;
				}
			});
		});
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
