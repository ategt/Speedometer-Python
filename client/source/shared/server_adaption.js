export const convertTimestampToClient = (timestamp) => parseInt(parseFloat(timestamp)*1000);
export const convertTimestampToServer = (timestamp) => parseFloat(timestamp)/1000;
