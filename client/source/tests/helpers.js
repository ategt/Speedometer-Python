export const mockGet = _url => {
	return new Promise((resolve, reject) => {
		if (new RegExp("\/report").exec(_url)) {
			resolve({data:{
						reports:[
							{'averageSpeedDuringSprint': 773.5808823529412,
							   'avgSprintLength': 15.11111111111111,
			   			   		'cooldownTime': 523,
			   			   		'date': 1618452382078,
			   			   		'faultyReadingCount': 5,
			   			   		'id': 83,
			   			   		'lengthOfWorkout': 1336,
			   			   		'remarks': 'The wire fell out of the plug.  Wacky readings follow.',
				   			    'sprintCount': 9,
					   			'startTime': 1618450753,
			   			   		'stopTime': 1618452042,
			   			   		'topSpeed': 1090},
			  			   		{'averageSpeedDuringSprint': 732.0507246376811,
			   			   		'avgSprintLength': 27.6,
			   			   		'cooldownTime': 730,
			   			   		'date': 1618711311987,
			   			   		'faultyReadingCount': 1,
			   			   		'id': 86,
			   			   		'lengthOfWorkout': 1550,
			   			   		'remarks': 'A comment goes here.',
			   			   		'sprintCount': 5,
			   			   		'startTime': 1618709554,
			   			   		'stopTime': 1618711041,
			   			   		'topSpeed': 1000}]
			}})
		} else if (new RegExp("\/motdata").exec(_url)) {
			resolve({data:{
			  "motsdata": {
				"acteur": { "activeAudioId": "0", "firstAudioId": "0", "imageId": "05" },
				"actif": { "activeAudioId": "0", "firstAudioId": "0", "imageId": "05" }, 
				"administration": { "activeAudioId": "0", "firstAudioId": "0", "imageId": "05" }
			  }
			}})
		} else if (new RegExp("\/schedule\/$").exec(_url)) {
			resolve({data:{"active": [
					    {"card": "{\"viewId\": 0, \"dataId\": \"distance\"}", 
					      "creationTimestamp": 1612241538738, 
					      "dueTimestamp": 1612673538738, 
					      "interval": 5, 
					      "pending": true, 
					      "rating": 2, 
					      "repetitions": 4
					    },{
					      "card": "{\"viewId\": 0, \"dataId\": \"ch\\u00f4mage\"}", 
					      "creationTimestamp": 1612236877356, 
					      "dueTimestamp": 1612841677356, 
					      "interval": 7, 
					      "pending": true, 
					      "rating": 2, 
					      "repetitions": 8
					    }
			]}})
		} else if (new RegExp("\/schedule\/(\\d+)").exec(_url)) {
			resolve({data:{"due": [
					    {"card": "{\"viewId\": 0, \"dataId\": \"distance\"}", 
					      "creationTimestamp": 1612241538738, 
					      "dueTimestamp": 1612673538738, 
					      "interval": 5, 
					      "pending": true, 
					      "rating": 2, 
					      "repetitions": 4
					    },{
					      "card": "{\"viewId\": 0, \"dataId\": \"ch\\u00f4mage\"}", 
					      "creationTimestamp": 1612236877356, 
					      "dueTimestamp": 1612841677356, 
					      "interval": 7, 
					      "pending": true, 
					      "rating": 2, 
					      "repetitions": 8
					    }
			]}})
		} else if (new RegExp("\/notes\/").exec(_url)) {
			resolve({data:{
				notes: {
					août: {mot: "août", text: "August"},
					baisse: {mot: "baisse", text: "drop; decrease"},
					chose: {mot: "chose", text: "thing, object"},
					chômage: {mot: "chômage", text: "unemployment"},
					colère: {mot: "colère", text: "anger, rage↵wrath"}
				}
			}})
		} else {
			console.log( _url );
			reject("Unknown URL");
		}
	}
)}