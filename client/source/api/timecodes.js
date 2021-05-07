import axios from 'axios';
import { ROOT_URL } from '../shared/constants';

const TIMECODE_API_ENDPOINT = `${ROOT_URL}/last-timecode`;

export const getLatestTimeCode = function () {
	return new Promise(function (resolve, reject) {
		axios.get(TIMECODE_API_ENDPOINT).then(function (timecodeResponse) {
			const timecode = timecodeResponse.data.result;
			resolve(timecode);
		});
	});
};