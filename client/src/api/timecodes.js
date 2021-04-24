import axios from 'axios';

const TIMECODE_API_ENDPOINT = "http://127.0.0.1:5000/last-timecode";

export const getLatestTimeCode = function () {
	return new Promise(function (resolve, reject) {
		axios.get(TIMECODE_API_ENDPOINT).then(function (timecodeResponse) {
			const timecode = timecodeResponse.data.result;
			resolve(timecode);
		});
	});
};
