<template>
  <div class="admin-buttons">
    <span class="reload-button" v-on:click="clearLocalSave">Clear Local Schedule Save</span>
    <span class="reload-button" v-on:click="forceLocalSave">Force Local Schedule Save</span>
    <span class="reload-button" v-on:click="refreshClients">Refresh Clients</span>
    <span class="reload-button" v-on:click="stopRecorder">Stop Recorder</span>
    <span class="reload-button" v-on:click="submitReport">Submit Report</span>
    <span class="report-counter" v-on:click="downloadSpeedHistory">
      <span class="report-count-label">
        Speed Readings:
      </span>
      <span class="report-count-text">
        {{ readingCount }}
      </span>
    </span>
  </div>  
</template>
<script>

import { prepare_report } from '../../shared/reports';
import { saveScheduleLocally, clearLocalSchedule } from '../../shared/schedule';

export default {
  name: "AdminButtons",
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
      const activeSchedule = this.$store.state.schedules.activeSchedule;
      saveScheduleLocally(activeSchedule);
    },
    clearLocalSave (event) {
      clearLocalSchedule();
    },
    refreshClients (event) {
      this.$store.dispatch("admin_info/getAllClients");
    },
    downloadSpeedHistory () {
      const speedBlob = new Blob([JSON.stringify(this.$store.state.speedometer.speedHistory)], {type:"plain/text"});
      import('../../dependencies/FileSaver.js').then((result) => {
        saveAs(speedBlob, 'speedHistory.json');
      });
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
  .admin-buttons {
    padding: 0.5em;
    z-index: 2;
  }
  .report-counter {
    cursor: pointer;
    width: 173em;
    padding: 7px 17px;
    margin: 5px;
  }
  .report-counter:hover {
    border-radius: 6px;
    border: 2px solid black;
    padding: 5px 15px;
  }
  .report-count-text {
    width: 4em;
    display: inline-block;
  }
</style>