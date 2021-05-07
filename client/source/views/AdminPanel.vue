<template>
    <div class="admin-panel">
        <ConnectedClients></ConnectedClients>
        <AdminEventsField></AdminEventsField>
        <AdminMessagesField></AdminMessagesField>
        <RecieverField class="wrappx"></RecieverField>
        <div class="admin-buttons">
          <span class="reload-button" v-on:click="stopRecorder">Stop Recorder</span>
          <span class="reload-button" v-on:click="submitReport">Submit Report</span>
          <span class="report-counter">
            <span class="report-count-label">
              Speed Readings:
            </span>
            <span class="report-count-text">
              {{ readingCount }}
            </span>
          </span>
        </div>
    </div>
</template>
<script>
import RecieverField from '../components/Reciever.vue';
import AdminMessagesField from '../components/AdminMessagesField.vue';
import ConnectedClients from '../components/ConnectedClients.vue';
import AdminEventsField from '../components/AdminEventsField.vue';

import { generate_report, prepare_report } from '../shared/reports';

export default {
  name: "AdminPanel",
  components: {
      RecieverField,
      ConnectedClients,
      AdminMessagesField,
      AdminEventsField,
  },
  methods: {
    submitReport (event) {
      const speedHistory = this.$store.state.speedometer.speedHistory;
      const activeSchedule = this.$store.getters["schedule/getActiveSchedule"];

      const report = prepare_report(speedHistory, activeSchedule);

      this.$store.dispatch("reports/submitReport", report);
    },
    stopRecorder (event) {
      this.$socket.emit("recorder directive", {directive:"shutdown"});
    },
  },
  computed: {
    readingCount () {
      return this.$store.state.speedometer.speedHistory.length;
    },
  },
}   
</script>
<style type="text/css">
  .reload-button {
    width: 173em;
    border: 2px solid black;
    border-radius: 6px;
    background: lightgrey;
    padding: 5px 15px;
    margin: 5px;
    cursor: pointer;
  }
  .wrappx {
    border: 2px solid black;
    border-radius: 6px;
    background: lightgrey;
    padding: 5px 15px;
    margin: 30px 57px;
  }
  .admin-buttons {
    padding: 0.5em;
  }
</style>