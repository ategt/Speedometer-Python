<template>
	<div class="dashboard">
		<TitleBanner />
		<Status />
		<Reciever />
		<Schedule />
	</div>
</template>
<script>
import TitleBanner from '../components/partials/TitleBanner';
import Status from './Status';
import Reciever from './Reciever';
import Schedule from './Schedule';

export default {
	name: "Dashboard",
	components: {
		TitleBanner,
		Status,
		Reciever,
		Schedule,
	},
}	
</script>