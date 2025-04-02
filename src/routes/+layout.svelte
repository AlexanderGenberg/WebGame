<script>
	import '../app.postcss';

	// Highlight JS
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml'; // for HTML
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';

	hljs.registerLanguage('xml', xml); // for HTML
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import { base } from '$app/paths';
	let highscore = 100

</script>

<header>
	<nav>
		<a href="{base}/">Hem</a>
		<a href="{base}/game">Spela</a>
		<a href="{base}/about">Om oss</a>
	</nav>
    <h1>Samurai på webben</h1>
	<p>Highscore : {highscore}. 96 pixlar i höjd inkluderat med ground</p>
</header>

<style>
	header {
        display: grid;
		grid-template-columns: repeat(3, 1fr);
		justify-content: space-around;
		align-items: center;
		background-color: blue;
		height: 8vh;
		border-bottom: black 8px solid;
		padding: 10px;
    }

	nav :hover {
		background-color: black;
	}

	a {
		text-decoration: underline;
	}

	h1 {
		display: flex;
		justify-content: center;
	}

	p {
		display: flex;
		justify-content: flex-end;
	}
</style>

<slot />

