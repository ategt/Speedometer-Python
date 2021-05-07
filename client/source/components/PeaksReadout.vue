<template>
	<div class="peak-info-div peaks-grid">
		<div class="peaks-grid-item peaks-grid-index peaks-grid-header">Index</div>
		<div class="peaks-grid-item peaks-grid-speed peaks-grid-header">Speed</div>
		<template v-for="peak in peaks">
			<div class="peaks-grid-item peaks-grid-index">
				{{ peak.idx }}
			</div>
			<div class="peaks-grid-item peaks-grid-speed">
				{{ peak[0] }}
			</div>
		</template>
	</div>
</template>
<script>
export default {
	name: "PeaksReadout",
	props: ['peaks'],
}
</script>
<style type="text/css">
.peaks-grid {
    display: grid;
    grid-template-columns: 10em 10em;
}
.peaks-grid-item {
	padding: 0.1em 0.5em;
}
.peaks-grid-speed {
	text-align: left;
}
.peaks-grid-index {
	text-align: right;
}
</style>