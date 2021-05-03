import axios from 'axios';

const SCHEDULE_API_ENDPOINT = "http://127.0.0.1:5000/schedule";

export const setDefault = function (id) {
	return new Promise(function (resolve, reject) {
		axios.put(SCHEDULE_API_ENDPOINT, {id:id});
	});
};

export const retireSchedule = function (id) {
	return new Promise(function (resolve, reject) {
		axios.delete(`${SCHEDULE_API_ENDPOINT}/${id}`);
	});
}