<template>
    <div class="admin-panel">
        <div class="messager-panel">
          <ConnectedClients v-on:sid-clicked="passSid"></ConnectedClients>
          <AdminMessagesField></AdminMessagesField>
        </div>
        <div class="messager-panel messager-panel-2">
          <AdminEventsField></AdminEventsField>
          <Messenger v-bind:sid="clientSid"></Messenger>
        </div>
        <RecieverField class="wrappx"></RecieverField>
        <div class="admin-buttons">
          <span class="reload-button" v-on:click="clearLocalSave">Clear Local Schedule Save</span>
          <span class="reload-button" v-on:click="forceLocalSave">Force Local Schedule Save</span>
          <span class="reload-button" v-on:click="refreshClients">Refresh Clients</span>
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
          <span class="tests-link">
            <a href="/tests">Run Tests</a>
          </span>
        </div>
    </div>
</template>
<script>
import RecieverField from '../components/Reciever.vue';
import AdminMessagesField from '../components/AdminMessagesField.vue';
import ConnectedClients from '../components/ConnectedClients.vue';
import AdminEventsField from '../components/AdminEventsField.vue';
import Messenger from '../components/Messenger.vue';

import { generate_report, prepare_report } from '../shared/reports';
import { saveScheduleLocally, clearLocalSchedule } from '../shared/schedule';

export default {
  name: "AdminPanel",
  components: {
      Messenger,
      RecieverField,
      ConnectedClients,
      AdminMessagesField,
      AdminEventsField,
  },
  data () {
    return {
      clientSid: "",
    };
  },
  methods: {
    submitReport (event) {
      const speedHistory = this.$store.state.speedometer.speedHistory;
      const activeSchedule = this.$store.state.schedules.activeSchedule;

      const report = prepare_report(speedHistory, activeSchedule);

      this.$store.dispatch("reports/submitReport", report);
    },
    stopRecorder (event) {
      this.$socket.emit("recorder directive", {directive:"shutdown"});
    },
    forceLocalSave (event) {
      //loadScheduleFromStorage
      //const activeSchedule = this.$store.getters["schedule/getActiveSchedule"];
      const activeSchedule = this.$store.state.schedules.activeSchedule;
      saveScheduleLocally(activeSchedule);
    },
    clearLocalSave (event) {
      clearLocalSchedule();
    },
    refreshClients (event) {
      this.$store.dispatch("admin_info/getAllClients");
    },
    passSid (sid) {
      this.clientSid = sid;
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
  .messager-panel {
    display: flex;
  }
</style>