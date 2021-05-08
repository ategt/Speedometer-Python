<template>
	<div class="messenger" v-on:keydown.enter.stop.prevent="sendMessage">
		<input type="text" class="destination-text-input" name="recipient" v-model="recipient" placeholder="Destination SID"></input>
		<textarea v-model="message" placeholder="Enter message here"></textarea>
		<div class="send-button" v-on:click="sendMessage" v-bind:disabled="message.length && recipient.length">Send Message</div>
	</div>
</template>
<script>
export default {
	name: "Messenger",
	props: ['sid'],
	data () {
		return {
			message: "",
			recipient: "",
		};
	},
	watch: {
		sid () {
			this.recipient = this.sid;
		},
	},
	methods: {
		sendMessage (event) {
      		this.$store.dispatch("admin_info/sendMessage", {to: this.recipient, message: this.message});
          this.message = "";   
		},
	},
}
</script>
<style type="text/css" scoped>
  .messenger {
		width: 35%;
    display: flex;
    flex-direction: column;
    padding: 2px 7px;
    margin: 5px;
   }
  .messenger>input {
    margin: 2px;
    font-size: larger;
    text-align: center;
  }
  .messenger>textarea {
  	width: auto;
    margin: 2px;
    padding: 1em;
    height: 7.5em;
    font-size: large;
  }
  .messenger>.send-button, .send-button {
	  margin: 2px;
	  width: auto;
    border: 2px solid black;
    border-radius: 5px;
    text-align: center;
    padding: 5px;
    font-size: x-large;
    background-color: lightgrey;
    cursor: pointer;
  }
</style>