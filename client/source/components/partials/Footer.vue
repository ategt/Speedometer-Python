<template>
	<footer>
		<div class="footer">
			<span class="footer-item">
    			<router-link v-bind:to="{name:'Home'}">Home</router-link>
			</span>
			<span class="footer-item">
    			<router-link to="/about">About</router-link>
			</span>
			<span class="footer-item">
				<router-link v-bind:to="{name:'Reports'}">Info</router-link>
			</span>
			<span class="footer-item">
				<router-link v-bind:to="{name:'Reciever'}">Reciever</router-link>
			</span>
			<span class="footer-item">
				<router-link v-bind:to="{name:'Graph'}">Graph</router-link>
			</span>
			<span class="footer-item">
				<router-link v-bind:to="{name:'Schedule'}">Scheduler</router-link>
			</span>
			<span class="footer-item">
				<router-link v-bind:to="{name:'StatusView'}">Status</router-link>
			</span>
			<span class="footer-item">
				<router-link to="/graph?start=0&stop=161125230800">Full Readout</router-link>				
			</span>
			<span class="footer-item" v-if="isSignedIn">
				<router-link v-bind:to="{name:'AdminPanel'}">Admin</router-link>
			</span>
			<span class="footer-item" v-else>
				<router-link v-bind:to="{name:'About'}">Sign In</router-link>
			</span>
		</div>
	</footer>
</template>
<script>
export default {
  name: "Footer",
  computed: {
  	isSignedIn () {
	  	return this.$auth.isAuthenticated();
  	} 
  }
}
</script>
