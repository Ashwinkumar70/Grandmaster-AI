import { Howl } from 'howler';

const SOUND_URLS = {
  move: 'https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3',
  capture: 'https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3',
  check: 'https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/check.mp3',
  castle: 'https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/castle.mp3',
  promote: 'https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/promote.mp3',
  gameEnd: 'https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/game-end.mp3',
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
