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