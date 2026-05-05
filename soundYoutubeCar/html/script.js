// ====================== YouTube Music Player ======================

let player = null;
let currentVideoId = null;
let isMuted = false;
let previousVolume = 50;

// YouTube IFrame APIが読み込まれたら自動で呼ばれる
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '1',
        width: '1',
        videoId: '',
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'modestbranding': 1,
            'playsinline': 1,
            'rel': 0,
            'origin': window.location.origin
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}

function onPlayerReady(event) {
    player.setVolume(50);
    const slider = document.getElementById('volumeSlider');
    const display = document.getElementById('volumeDisplay');

    if (slider) {
        slider.value = 50;
        slider.addEventListener('input', (e) => {
            const vol = parseInt(e.target.value);
            player.setVolume(vol);
            if (display) display.textContent = vol;
            if (isMuted) {
                isMuted = false;
                updateMuteButton();
            }
        });
    }
    if (display) display.textContent = '50';
}

function onPlayerError(event) {
    console.error('YouTube Error:', event.data);
}

function onPlayerStateChange(event) {
    const status = document.getElementById('status');
    if (!status) return;

    if (event.data === YT.PlayerState.PLAYING) {
        status.textContent = '▶ 再生中';
        status.style.color = '#00ff9d';
    } else if (event.data === YT.PlayerState.PAUSED) {
        status.textContent = '⏸ 一時停止';
        status.style.color = '#ffaa00';
    } else if (event.data === YT.PlayerState.ENDED) {
        status.textContent = '再生終了';
        status.style.color = '#888';
    }
}

function extractVideoId(url) {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function loadAndPlay() {
    const url = document.getElementById('urlInput').value.trim();
    const videoId = extractVideoId(url);
    
    if (!videoId) {
        alert('正しいYouTubeリンクを貼り付けてください！');
        return;
    }
    
    if (player) {
        player.loadVideoById(videoId);
        currentVideoId = videoId;
        document.getElementById('status').textContent = '読み込み中...';
    }
}

function playMusic() {
    if (player && currentVideoId) {
        player.playVideo();
    } else {
        alert('先にリンクをロードしてください！');
    }
}

function pauseMusic() {
    if (player) player.pauseVideo();
}

function toggleMute() {
    if (!player) return;
    
    if (isMuted) {
        player.unMute();
        player.setVolume(previousVolume);
        document.getElementById('volumeSlider').value = previousVolume;
        document.getElementById('volumeDisplay').textContent = previousVolume;
        isMuted = false;
    } else {
        previousVolume = player.getVolume() || 50;
        player.mute();
        isMuted = true;
    }
    updateMuteButton();
}

function updateMuteButton() {
    const btn = document.getElementById('muteBtn');
    if (btn) btn.textContent = isMuted ? '🔇' : '🔊';
}

function closeUI() {
    document.getElementById('music-ui').style.display = 'none';
    fetch(`https://${GetParentResourceName()}/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });
}

window.addEventListener('message', function(event) {
    if (event.data.action === 'show') {
        document.getElementById('music-ui').style.display = 'block';
    } else if (event.data.action === 'hide') {
        document.getElementById('music-ui').style.display = 'none';
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeUI();
});