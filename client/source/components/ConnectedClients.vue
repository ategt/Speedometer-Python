<template>
  <div id="admin-clients" class="recieved-field events-field admin-events-field admin-recieved admin-clients clients">
    <div class="connections-text">
      Connected IDs:
    </div>
    <div class="client" v-for="client in clients">
        {{ client }}
    </div>
  </div>
</template>
<script>
export default {
  name: "ConnectedClients",
  computed: {
    clients () {
      return this.$store.state.admin_info.clients;
    },
  },
}
</script>
<style type="text/css">
  #admin-clients {
    width: 27em;
    border: 5px solid black;
    border-radius: 6px;
    background: lightgrey;
    padding: 5px 15px;
    margin: 5px;
  }
</style>