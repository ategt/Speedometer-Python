import axios from 'axios';
import { ROOT_URL } from '../shared/constants';

const CLIENTS_API_ENDPOINT = `${ROOT_URL}/clients`;

export const getAllClients = function () {
	return new Promise(function (resolve, reject) {
		axios.get(CLIENTS_API_ENDPOINT).then(function (clientsResponse) {
			const clients = clientsResponse.data.clients;
			resolve(clients);
		});
	});
};