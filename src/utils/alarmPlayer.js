// src/utils/alarmPlayer.js
let audioInstance = null;

export const playHabitraAlarm = (soundUrl = '/alarm.mp3') => {
  try {
    if (!audioInstance) {
      audioInstance = new Audio(soundUrl);
      audioInstance.loop = true;
      audioInstance.volume = 1.0;
    }
    audioInstance.currentTime = 0;
    const playPromise = audioInstance.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch((err) => {
        console.warn('Alarm autoplay blocked until user interaction:', err.message);
      });
    }
  } catch (err) {
    console.error('Failed to play alarm audio:', err);
  }
};

export const stopHabitraAlarm = () => {
  if (audioInstance) {
    audioInstance.pause();
    audioInstance.currentTime = 0;
  }
};