<template>
    <div class="admin-panel">
        <ConnectedClients></ConnectedClients>
        <AdminEventsField></AdminEventsField>
        <AdminMessagesField></AdminMessagesField>
        <RecieverField class="wrappx"></RecieverField>
        <div class="admin-buttons">
          <span class="reload-button" v-on:click="stopRecorder">Stop Recorder</span>
          <span class="reload-button" v-on:click="submitReport">Submit Report</span>
        </div>
    </div>
</template>
<script>
import RecieverField from '../components/Reciever.vue';
import AdminMessagesField from '../components/AdminMessagesField.vue';
import ConnectedClients from '../components/ConnectedClients.vue';
import AdminEventsField from '../components/AdminEventsField.vue';

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

        const sortedHistory = Array.from(speedHistory).sort(function (a,b) {
          return a.timestamp - b.timestamp;
        });

        const timecodes = sortedHistory.map(item => item.timestamp);
        const speeds = sortedHistory.map(item => item['currentRevsPerMin'])

        const start_time = Math.min(...timecodes);
        const stop_time  = Math.max(...timecodes);
        const report = generate_report(speeds, start_time, stop_time);

        const activeSchedule = this.$store.getters["schedule/getActiveSchedule"];
        report.scheduleId = activeSchedule.id;
        report.scheduleName = activeSchedule.name;
        
        this.$store.dispatch("reports/submitReport", report);
      },
      stopRecorder (event) {
        this.$socket.emit("recorder directive", {directive:"shutdown"});
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