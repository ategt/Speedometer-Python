<template>
	<div>Shell Text
		<Minor></Minor>
		<Minor></Minor>
		<Minor></Minor>
		<TextDetail></TextDetail>
		<Graph></Graph>
	</div>
</template>
<script>
import Minor from '../components/Minor.vue';
import TextDetail from '../components/TextDetail.vue';
import Graph from '../components/Graph.vue';

export default {
	name: "Tester",
	components: {
		Minor,
		TextDetail,
		Graph,
	},
}	
</script>