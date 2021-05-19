<template>
	<div class="title-banner">
		<div class="title-panel">
			<h1>HIIT MON</h1>
		</div>
		<div class="graph-link-panel">
			<h1>
				<span class="graph-link">
					<router-link to="/d3" id="graph-link" class="no-decoration">GRAPH</router-link>
				</span>
			</h1>
		</div>
	</div>
</template>
<script>
export default {
	name: "TitleBanner",
}
</script>
<style type="text/css">
span.graph-link {
  cursor: pointer;
  padding: 0.26em 1.1em;
  margin: 9px;
}
span.graph-link:hover {
  border: 1px solid black;
  border-radius: 4px;
  margin: 8px;
}
</style>