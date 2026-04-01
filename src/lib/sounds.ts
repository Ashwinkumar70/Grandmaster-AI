import { Howl } from 'howler';

const SOUND_URLS = {
  move: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  capture: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
  check: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3',
  castle: 'https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3',
  promote: 'https://assets.mixkit.co/active_storage/sfx/2575/2575-preview.mp3',
  gameEnd: 'https://assets.mixkit.co/active_storage/sfx/2576/2576-preview.mp3',
};

class SoundManager {
  private sounds: Record<string, Howl> = {};
  private muted: boolean = false;

  constructor() {
    Object.entries(SOUND_URLS).forEach(([key, url]) => {
      this.sounds[key] = new Howl({ src: [url], volume: 0.5 });
    });
  }

  play(sound: keyof typeof SOUND_URLS) {
    if (!this.muted && this.sounds[sound]) {
      this.sounds[sound].play();
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
  }

  isMuted() {
    return this.muted;
  }
}

export const soundManager = new SoundManager();
