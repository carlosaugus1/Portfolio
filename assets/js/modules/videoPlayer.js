export function initVideoPlayer() {
    const video = document.getElementById('heroVideo');
    if (video) {
        video.currentTime = 0;
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Autoplay started successfully
            }).catch(error => {
                console.warn('Browser autoplay policy prevented playback:', error);
            });
        }
    }
}
