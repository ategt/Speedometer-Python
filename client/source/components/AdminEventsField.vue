<template>
  <div id="admin-recieved" class="recieved-field events-field admin-events-field admin-recieved">
    <div class="connections-text">
      Events
    </div>
    <div class="event-item" v-for="event in events">
      {{ event }}
    </div>
  </div>
</template>
<script>
export default {
  name: "AdminEventsField",
  computed: {
    events () {
      return this.$store.state.admin_info.events.map(event => JSON.stringify(event));
    },
  },
}
</script>
<style type="text/css">
  #admin-recieved {
    width: 27em;
    border: 2px solid black;
    border-radius: 6px;
    background: lightgrey;
    padding: 5px 15px;
    margin: 5px;
  }
</style>