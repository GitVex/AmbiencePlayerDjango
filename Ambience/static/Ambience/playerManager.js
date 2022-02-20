var selectedMixer = []
var IDregex = new RegExp(/(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
var loadedVideos = []

const getMethods = (obj) => {
	let properties = new Set()
	let currentObj = obj
	do {
	  Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
	} while ((currentObj = Object.getPrototypeOf(currentObj)))
	return [...properties.keys()].filter(item => typeof obj[item] === 'function')
}

/* LISTENERS */

$("#id_title").bind("change paste keyup", function() {
	console.log($(this).val())
});


/* BUTTON FUNCTIONS */

function addPlayer() {

	let i = 0;
	while (i < PlayerHolder.length) {
		if (PlayerHolder[i].isAvailable == true) {
			break;
		}
		i++;
	}

	//Loading HTML Template
	var temp = document.getElementById("LocalMixerBoxGridItemTEMPLATE").content;
	var toImport = document.importNode(temp, true);

	if(getNextPlayerPosition(i) == "none") {

		alert("No more Player Slots available");

	} else {

		//Placing HTML element;
		var PlayerItem = toImport.firstElementChild;
		PlayerItem.setAttribute('id', 'slot' + i);
		PlayerItem.setAttribute('style', '')
		PlayerItem.style.setProperty('grid-area', getNextPlayerPosition(i));
		document.getElementById("LocalMixerBoxGrid").appendChild(toImport);

		//Assigning PlayerID
		var newLocalMixer = document.getElementById('slot' + i);
		var playerSlot = newLocalMixer.querySelector('#LocalPlayer');
		var playerSlotID = "playerSlot" + playerSlot.parentElement.getAttribute('id');
		playerSlot.setAttribute('id', playerSlotID);

		//Pickping & Replacing player from PlayerHolder
		var newChild = document.getElementById('PlayerHolderContainer').querySelector("#player" + i);
		newChild.setAttribute('class', 'LocalPlayer');

		document.getElementById(playerSlotID).parentElement.appendChild(newChild);
		document.getElementById(playerSlotID).remove();
		    
	  	PlayerHolder[i].isAvailable = false;
	}
}

function removePlayer() {

	let PHreversed = Array.from(PlayerHolder.reverse());
	PlayerHolder.reverse()
	let i = 0;
	while (PHreversed[i].isAvailable != false) {
		i++;
	}
	let lastPlayer = PHreversed[i];
	let toRemove = getCurrentMixer(lastPlayer.div['h'])[0];
	// let toRemoveVolControl = toRemove.querySelector('#sliderContainer');
	// console.log(toRemove);

	// console.log(selectedMixer.includes(toRemoveVolControl), selectedMixer.indexOf(toRemoveVolControl));
	// if(selectedMixer.includes(toRemoveVolControl)) {
	// 	selectedMixer = selectedMixer.slice(selectedMixer.indexOf(toRemoveVolControl), 1);
	// }

	document.getElementById('PlayerHolderContainer').appendChild(lastPlayer.div['h']);

	lastPlayer.isAvailable = true;
	toRemove.remove();
}

function deletePlayer() {

	let removeID = getCurrentMixer(event.target);
	let toRemove = removeID[0];
	console.log(removeID);
	console.log(toRemove);
		 
	try {
		document.getElementById('PlayerHolderContainer').appendChild(toRemove.children[toRemove.children.length - 1]);
	} catch (e) {
		alert(e);
		return;
	}
	 
	PlayerHolder[removeID[1]].isAvailable = true;
	toRemove.remove();
}

function openPanel(id) {
	document.getElementById(id).style.setProperty('display', 'flex');
	setTimeout(() => document.getElementById(id).style.setProperty('opacity', '1'), 5);
}

function closePanel(id) {
	setTimeout(() => document.getElementById(id).style.setProperty('display', 'none'), 500)
	document.getElementById(id).style.setProperty('opacity', '0');
}

function toggleSelection() {

	for(var i = 0; i < selectedMixer.length; i++) {
		if(!Array.from(document.getElementsByClassName('sliderContainer')).includes(selectedMixer[i])) {
			selectedMixer.splice(i, 1);
		}
	}

	function refreshColors() {
		if(selectedMixer[0]) {
			selectedMixer[0].style.setProperty('filter', 'drop-shadow(0px 0px 7px #D53A3A)');
		}
		if(selectedMixer[1]) {
			selectedMixer[1].style.setProperty('filter', 'drop-shadow(0px 0px 7px #3B8AD4)');
		}
	}

	let src = event.target;

	if(src.getAttribute('id') == "VolumeSlider") {
		return;
	}

	if(selectedMixer.includes(src)) {
		selectedMixer.splice(selectedMixer.indexOf(src), 1);
		src.style.setProperty('filter', '');
	} else if(selectedMixer.length < 2) {
		selectedMixer.push(src);
		refreshColors();
	}
}

function updateVideo() {

	let currentMixer = getCurrentMixer(event.target);
	let videoIdContainer = currentMixer[0].children[2].firstElementChild;
	let videoID;
	if (videoIdContainer.value.includes("youtube")) {
		for(var i = 0; i < videoIdContainer.value.match(IDregex).length; i++) {
		}
		videoID = videoIdContainer.value.match(IDregex)[1];
	} else {
		videoID = videoIdContainer.value;
	}
		 
	try {
		PlayerHolder[currentMixer[1]].div.loadVideoById(videoID);
	} catch (e) {
		alert(e);
	}
}

function updateVolume() {

	let currentMixer = getCurrentMixer(event.target);
	let volSlider = currentMixer[0].children[0].firstElementChild;

	try {
		PlayerHolder[currentMixer[1]].div.setVolume(parseInt(volSlider.value));
	} catch (e) {
		alert(e);
	}
}

function loadPlayersForPreset() {

	document.getElementById('viewVideosFieldTable').innerHTML = '<tr><th>Video Tile</th><th>Video ID</th></tr>'

	for(var i = 0; i < PlayerHolder.length; i++) {

		if(!PlayerHolder[i].isAvailable) {

			var url = PlayerHolder[i].div.getVideoUrl();
			var videoID = url.match(IDregex)[1];
			var videoTitle = "";
			$.ajax({
				url: 'https://noembed.com/embed?url=https://youtu.be/' + videoID,
				dataType : 'json',
				async: false,
				success: (data) => {
					videoTitle = data.title;
				}
				})
			html_to_insert = "<tr><td>" + videoTitle + "</td><td>" + videoID + "</td></tr>";
			document.getElementById('viewVideosFieldTable').insertAdjacentHTML('beforeend', html_to_insert);

			let playerData = []
			let newPlayerData = {
				ID: videoID, 
				title: videoTitle
			}
			playerData.push(newPlayerData)

			let newLoadedVideo = {
				playerID: i.toString(),
				playerData: playerData
			}
			if(!loadedVideos.includes(newLoadedVideo)) {
				loadedVideos.push(newLoadedVideo)
			}
		}
	}
	document.getElementById('presetDataField').value = JSON.stringify(loadedVideos)
}

/* HELPER FUNCTIONS */

function getPlayerCount() {

	var PlayersCount = document.getElementsByClassName('LocalMixerBoxGridItem').length;
	return PlayersCount;
}

function getNextPlayerPosition(nextID) {

	let nextPosition = "";
	switch(nextID) {
	case 0:
		nextPosition = "topleft";
		break;
	case 1:
		nextPosition = "topmid";
		break;
	case 2:
		nextPosition = "topright";
		break;
	case 3:
		nextPosition = "midleft";
		break;
	case 4:
		nextPosition = "midmid";
		break;
	case 5:
		nextPosition = "midright";
		break;
	case 6:
		nextPosition = "bottomleft";
		break;
	case 7:
		nextPosition = "bottommid";
		break;
	case 8:
		nextPosition = "bottomright";
		break;
	case 9:
		nextPosition = "none";
		break;
	}


	return nextPosition;
}

function getCurrentMixer(eventOrigin) {

	let currentMixer = eventOrigin;

	let compToken = eventOrigin.getAttribute('id');
	while (compToken != 'slot') {

		currentMixer = currentMixer.parentElement;
		compToken = currentMixer.getAttribute('id');
		compToken = compToken.slice(0, -1);
	}

	let currentMixerId = currentMixer.getAttribute('id').charAt(currentMixer.getAttribute('id').length - 1);
	return [currentMixer, currentMixerId];
}

/*FADE FUNCTIONS*/

function fadeIn() {

	let currentMixer = getCurrentMixer(event.target);
	let volSlider = currentMixer[0].children[0].firstElementChild;
	let endValue = parseInt(volSlider.value);
	if(endValue == 0) {endValue = 30;}
	volSlider.value = '0';
	let playerState = PlayerHolder[currentMixer[1]].div.getPlayerState();
	PlayerHolder[currentMixer[1]].div.setVolume(0);

	if(playerState == 2) {

		PlayerHolder[currentMixer[1]].div.playVideo();
	}
	
	var handler;
	function increase(){

		if (parseInt(volSlider.value) >= endValue) {
	
			window.clearInterval(handler);
		}

		volSlider.value = parseInt(volSlider.value) + .5;			
		PlayerHolder[currentMixer[1]].div.setVolume(parseInt(volSlider.value));
	}


	handler = window.setInterval(increase, 50);
}

function fadeInCross(toFadeIn) {

	let currentMixer = getCurrentMixer(toFadeIn);
	let volSlider = currentMixer[0].children[0].firstElementChild;
	let endValue = parseInt(volSlider.value);
	if(endValue == 0) {endValue = 30;}
	volSlider.value = '0';
	let playerState = PlayerHolder[currentMixer[1]].div.getPlayerState();
	PlayerHolder[currentMixer[1]].div.setVolume(0);

	if(playerState == 2) {

		PlayerHolder[currentMixer[1]].div.playVideo();
	}
	
	var handler;
	function increase(){

		if (parseInt(volSlider.value) >= endValue) {
	
			window.clearInterval(handler);
		}

		volSlider.value = parseInt(volSlider.value) + .5;			
		PlayerHolder[currentMixer[1]].div.setVolume(parseInt(volSlider.value));
	}


	handler = window.setInterval(increase, 50);
}

function fadeOut() {

	let currentMixer = getCurrentMixer(event.target);
	let volSlider = currentMixer[0].children[0].firstElementChild;
	let endValue = 0;

	var handler;

	function decrease(){

		if (parseInt(volSlider.value) <= endValue) {

			window.clearInterval(handler);
			PlayerHolder[currentMixer[1]].div.pauseVideo();
		}
		volSlider.value = parseInt(volSlider.value) - 1;
		PlayerHolder[currentMixer[1]].div.setVolume(parseInt(volSlider.value));
	}
	handler = window.setInterval(decrease, 50);
}

function fadeOutCross(toFadeOut) {

	let currentMixer = getCurrentMixer(toFadeOut);
	let volSlider = currentMixer[0].children[0].firstElementChild;
	let endValue = 0;

	var handler;

	function decrease(){

		if (parseInt(volSlider.value) <= endValue) {

			window.clearInterval(handler);
			PlayerHolder[currentMixer[1]].div.pauseVideo();
		}
		volSlider.value = parseInt(volSlider.value) - 1;
		PlayerHolder[currentMixer[1]].div.setVolume(parseInt(volSlider.value));
	}
	handler = window.setInterval(decrease, 50);
}

function crossFade() {
	if(selectedMixer.length < 2) {

		alert('There need to be at least 2 Mixers selected')
		return;
	}

	fadeInCross(selectedMixer[1]);
	fadeOutCross(selectedMixer[0]);
}


