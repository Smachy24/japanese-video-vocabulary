export interface PlayerEventMap {
  play: () => void;
  pause: () => void;
  ended: () => void;
  timeupdate: (currentTime: number) => void;
  durationchange: (duration: number) => void;
}

export interface IVideoPlayer {
  play(): void;
  pause(): void;
  seek(time: number): void;
  setVolume(volume: number): void;
  requestFullscreen(): void;
  on<K extends keyof PlayerEventMap>(event: K, callback: PlayerEventMap[K]): void;
  destroy(): void;
}
