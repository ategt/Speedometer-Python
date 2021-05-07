<template>
  <div id="admin-recieved" class="recieved-field events-field admin-events-field admin-recieved">
    <div class="connections-text">
      Events
    </div>
  </div>
</template>
<script>
export default {
  name: "AdminEventsField",
  methods: {
    logToBroadcastField (msg) {
      // Log broadcast to recieving field.
      const divElement = document.createElement("div");

      divElement.innerText = JSON.stringify(msg.data);
      this.$el.appendChild(divElement);
    },
  },
  data () {
    return {
      events: this.$store.state.admin_info.events,
    };
  },
  mounted () {
    this.events.forEach(this.logToBroadcastField);
    this.$options.sockets["admin event"] = this.logToBroadcastField;
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