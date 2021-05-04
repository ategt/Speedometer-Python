import axios from 'axios';

const SCHEDULE_API_ENDPOINT = "http://127.0.0.1:5000/schedule";

export const setDefault = function (id) {
	return new Promise(function (resolve, reject) {
		axios.put(SCHEDULE_API_ENDPOINT, {id});
	});
};

export const retireSchedule = function (id) {
	return new Promise(function (resolve, reject) {
		axios.delete(`${SCHEDULE_API_ENDPOINT}/${id}`);
	});
};

export const getSchedules = function () {
	return new Promise(function (resolve, reject) {
		axios.get(SCHEDULE_API_ENDPOINT).then(function (response) {
			resolve(response.data);
		});
	});
};

export const updateSchedule = function (schedule) {
	return axios.patch(SCHEDULE_API_ENDPOINT, {...schedule, updated: +new Date()});
};

export const createSchedule = function (schedule) {
	return axios.post(SCHEDULE_API_ENDPOINT, {...schedule, created: +new Date()});
};
