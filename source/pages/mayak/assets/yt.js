(function () {
	// Load the IFrame Player API code asynchronously.
	var tag = document.createElement("script");

	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName("script")[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	// Instantiate the Player.
	var player;
})();
function onYouTubeIframeAPIReady() {
	var video = document.getElementById("player");
    var videoNextBlock = document.getElementById("next-video")
	var videoId = video.dataset.id;
	var videoIdNext = video.dataset.nextVideo;
	var videoDuration = 0;
    var isNext = true;
    var options = {
        timerNextVideo: 5
    }

	video.parentNode.style.backgroundImage =
		"url(https://img.youtube.com/vi/" + videoId + "/maxresdefault.jpg)";
	player = new YT.Player("player", {
		height: "360",
		width: "640",
		videoId: videoId,
        playerVars: {
            rel: 0,
            showinfo: 0,
            // list: 'PLpPkjTyjWP51Y9HCobw9KA43M9Y22LBse'
        },
		events: {
			onReady: onPlayerReady,
			onStateChange: onPlayerStateChange,
		},
	});

    var iframeWindow = player.getIframe().contentWindow;

    window.addEventListener("message", function (event) {
        // Check that the event was sent from the YouTube IFrame.
        if (event.source === iframeWindow) {
            var data = JSON.parse(event.data);
            if(data.info.duration) {
                videoDuration = data.info.duration;
            }
            // console.log(videoDuration+' :: '+data.info.currentTime);
            if((videoDuration - options.timerNextVideo) <= data.info.currentTime && isNext) {
                document.getElementById('timer').innerHTML = Math.floor(videoDuration - data.info.currentTime);
                videoNextBlock.style.display = "flex";
                if(videoDuration - data.info.currentTime < 1) {
                    setTimeout(function() {
                        location.href = videoIdNext
                    }, 500)
                }
            } else {
                document.getElementById('timer').innerHTML = '';
            }
        }
    });
    document.querySelector('.next-video__buttons_close').addEventListener('click', function() {
        videoNextBlock.style.display = "none";
        isNext = false;
    })
}

function onPlayerReady(event) {
	event.target.playVideo();
}

function onPlayerStateChange(event) {
	// console.log(event.data);
	// console.log(player.getDuration());
	// if (event.data == YT.PlayerState.PLAYING && !done) {
	//     console.log(event.data);
	//   setTimeout(stopVideo, 6000);
	//   done = true;
	// }
}
function stopVideo() {
	player.stopVideo();
}