<template>
  <div id="admin-clients" class="recieved-field events-field admin-events-field admin-recieved admin-clients clients">
    <div class="connections-text">
      Connected IDs:
    </div>
    <div class="client" v-for="client in clients" v-on:click="$emit('sid-clicked', client)">
        {{ client }}
    </div>
  </div>
</template>
<script>
export default {
  name: "ConnectedClients",
  computed: {
    clients () {
      return this.$store.getters["admin_info/getConnections"];
    },
  },
  mounted () {
    this.$store.dispatch("admin_info/populateClients");
  },
}
</script>
<style type="text/css">
.client {
  cursor: pointer;
  padding: 3px;
  text-align: center;
}
.client:hover {
  border-radius: 5px;
  border: 1px solid black;
  /*background: grey;*/
  padding: 2px;
}
  #admin-clients {
    width: 27em;
    border: 5px solid black;
    border-radius: 6px;
    background: lightgrey;
    padding: 5px 15px;
    margin: 5px;
  }
</style>