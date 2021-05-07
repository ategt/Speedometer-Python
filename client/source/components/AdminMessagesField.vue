<template>
  <div id="admin-messages" class="recieved-field events-field admin-events-field admin-recieved admin-messages messages">
    <div class="connections-text">
      Messages:
    </div>
    <div class="message" v-for="message in messages">
        {{ message }}
    </div>
  </div>
</template>
<script>
export default {
  name: "AdminMessagesField",
  computed: {
    messages () {
      return Array.from([...this.$store.state.admin_info.messages.map(item => item.message), 
                          ...this.$store.state.clients.messages.map(item => item.message)]).sort(function (a,b) {
                            return a.recieved - b.recieved;
                          });
    },
  },
}
</script>
<style type="text/css">
  #admin-messages {
    width: 27em;
    border: 2px solid black;
    border-radius: 6px;
    background: lightgrey;
    padding: 5px 15px;
    margin: 5px;
  }
</style>