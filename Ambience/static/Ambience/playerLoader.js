var PlayerHolder = [];
var container = document.getElementById('PlayerHolderContainer');

for(var i = 0; i < 9; i++) {

	PlayerHolder.push(
		{
		id: i,
		div: document.createElement('div'),
		isAvailable: true
		});
	PlayerHolder[i].div.setAttribute('id', 'player' + i);
	container.appendChild(PlayerHolder[i].div);
}

//Loading API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
	console.log('API READY');

	for(var i = 0; i < PlayerHolder.length; i++) {

		var ytPlayer = new YT.Player(PlayerHolder[i].div.getAttribute('id'), {
			height: '256',
			width: '486',
			videoId: 'KecVJnJcSI4',
			});

		PlayerHolder[i].div = ytPlayer;
	}
	console.log(PlayerHolder);
}