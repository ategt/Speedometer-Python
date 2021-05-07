<template>
  <div id="recieved" class="recieved-field"></div>
</template>
<script>
export default {
  name: "RecieverField",
  methods: {
    logToBroadcastField (msg) {
      // Log broadcast to recieving field.
      const divElement = document.createElement("div");

      divElement.innerText = JSON.stringify(msg.data);
      this.$el.appendChild(divElement);
    },
  },
  mounted () {
    this.$options.sockets["tabata timer update broadcast"] = this.logToBroadcastField;
    this.$options.sockets["speedometer update broadcast"]  = this.logToBroadcastField;
    this.$options.sockets["recorder action broadcast"]     = this.logToBroadcastField;
  },
}
</script>
