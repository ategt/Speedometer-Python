<template>
	<div v-html="html"></div>
</template>
<script>
import { runOnLoad, load_summary, load_peak, top_speed } from '../src/summary';

export default {
	name: "PeaksReadout",
	props: ['peaks'],
	components: {
	},
	data () {
		return {
			html: "",
		}
	},
	created () {
		this.html = load_peak(this.peaks);
	}
}
</script>