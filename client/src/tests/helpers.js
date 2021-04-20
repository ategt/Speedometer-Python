export const mockGet = _url => {
	return new Promise((resolve, reject) => {
		if (new RegExp("\/mot\/").exec(_url)) {
			resolve({data:{"mots": ["jugement", "manque", "\u00e9chec", "professionnel", "animal"]}})
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