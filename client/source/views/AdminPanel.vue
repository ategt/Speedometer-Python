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
        <RecieverField class="reciever-field-wrapper"></RecieverField>
        <div class="admin-panel-footer">
          <AdminButtons></AdminButtons>
          <div class="tests-link-container">
            <span class="tests-link">
              <a href="/tests">Run Tests</a>
            </span>
          </div>
        </div>
    </div>
</template>
<script>
import RecieverField from '../components/Reciever.vue';
import AdminMessagesField from '../components/AdminMessagesField.vue';
import AdminButtons from '../components/partials/AdminButtons.vue';
import ConnectedClients from '../components/ConnectedClients.vue';
import AdminEventsField from '../components/AdminEventsField.vue';
import Messenger from '../components/Messenger.vue';

export default {
  name: "AdminPanel",
  components: {
      Messenger,
      RecieverField,
      ConnectedClients,
      AdminMessagesField,
      AdminEventsField,
      AdminButtons,
  },
  data () {
    return {
      clientSid: "",
    };
  },
  methods: {
    passSid (sid) {
      this.clientSid = sid;
    },
  },
  computed: {},
}   
</script>
<style type="text/css">
  .reciever-field-wrapper {
    border: 2px solid black;
    border-radius: 6px;
    background: lightgrey;
    padding: 5px 15px;
    margin: 30px 57px;
  }
  .messager-panel {
    display: flex;
  }
  .admin-panel-footer {
    display: flex;
    width: 100%;
  }
  .tests-link-container {
    text-align: right;
    width: 94%;
    display: inline-block;
    position: absolute;
    z-index: 1;
  }
  .tests-link {
    vertical-align: sub;
  }
</style>