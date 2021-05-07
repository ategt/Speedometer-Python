import axios from "axios";
import { ROOT_URL } from '../shared/constants';

const READINGS_API_ENDPOINT = `${ROOT_URL}/readings`;

export const getReadings = function (startTime, stopTime) {
	return new Promise(function (resolve, reject) {
		axios.get(READINGS_API_ENDPOINT, {params:{start: startTime, stop: stopTime}}).then(function (readingsResponse) {
			resolve(readingsResponse.data.result);
		}).catch(reject);
	});
};
