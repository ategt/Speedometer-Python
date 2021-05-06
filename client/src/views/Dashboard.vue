<template>
	<div class="dashboard">
		<TitleBanner></TitleBanner>
		<Status></Status>
		<RecieverField></RecieverField>
		<Schedule></Schedule>
	</div>
</template>
<script>
import TitleBanner from '../components/partials/TitleBanner.vue';
import RecieverField from '../components/Reciever.vue';
import Status from './Status.vue';
import Schedule from './Schedule.vue';

export default {
	name: "Dashboard",
	components: {
		TitleBanner,
		Status,
		RecieverField,
		Schedule,
	},
}	
</script>