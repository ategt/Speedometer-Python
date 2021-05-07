import axios from "axios";
import { ROOT_URL } from '../shared/constants';

const REPORT_API_ENDPOINT = `${ROOT_URL}/report`;

export const getReports = function () {
	return new Promise(function (resolve, reject) {
		axios.get(REPORT_API_ENDPOINT).then(function (response) {
		    const reports = response.data.reports.map(r => Object.assign({}, {remarks:""}, r));
		    resolve(reports);
		}).catch(reject);
	});
};

export const getReport = function (reportId) {
	return new Promise(function (resolve, reject) {
		getReports().then(function (reports) {
			const relevant_report = reports.filter(itm => itm.id === reportId)[0];
			resolve(relevant_report);
		}).catch(reject);
	});
};

export const createReport = function (report) {
	return new Promise(function (resolve, reject) {
		axios.post(REPORT_API_ENDPOINT, report).then((response) => resolve(response.data)).catch(reject);
	});
};

export const retireReport = function (id) {
	return axios.delete(`${ROOT_URL}/${id}`);
};

export const updateTimes = function (id, start_time, stop_time) {
	return axios.patch(REPORT_API_ENDPOINT, {id:id, startTime: start_time, stopTime: stop_time});
};

export const updateRemarks = function (id, comment) {
  	return axios.patch(REPORT_API_ENDPOINT, {id:id, remarks:comment});
};
