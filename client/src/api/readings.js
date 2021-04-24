import axios from "axios";

const READINGS_API_ENDPOINT = "http://127.0.0.1:5000/readings";

export const getReadings = function (startTime, stopTime) {
	return new Promise(function (resolve, reject) {
		axios.get(READINGS_API_ENDPOINT, {params:{start: startTime, stop: stopTime}}).then(function (readingsResponse) {
			resolve(readingsResponse.data.result);
		}).catch(reject);
	});
};
