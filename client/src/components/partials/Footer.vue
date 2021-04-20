<template>
	<footer>
		<div class="footer">
			<span class="footer-item">
    			<router-link to="/">Home</router-link>
			</span>
			<span class="footer-item">
    			<router-link to="/about">About</router-link>
			</span>
			<span class="footer-item">
				<router-link to="/public/info">Info</router-link>
			</span>
			<span class="footer-item">
				<router-link :to="{name:'Graph'}">Graph</router-link>
			</span>
			<span class="footer-item">
				<router-link :to="{name:'Schedule'}">Scheduler</router-link>
			</span>
			<span class="footer-item">
				<router-link to="/graph?start=0&stop=161125230800">Full Readout</router-link>
			</span>
		</div>
	</footer>
</template>
<script>
export default {
  name: "Footer",
  data() {
    return {
    }
  }
}
</script>
