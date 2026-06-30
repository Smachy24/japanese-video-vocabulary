import Plyr from "plyr";
import type { IVideoPlayer, PlayerEventMap } from "./player.interface";

export class PlyrPlayer implements IVideoPlayer {
  private readonly player: Plyr;

  public constructor(element: HTMLVideoElement) {
    this.player = new Plyr(element, {
      controls: ["play", "progress", "current-time", "mute", "volume", "fullscreen"],
      ratio: "16:9",
    });
  }

  public play(): void {
    void this.player.play();
  }

  public pause(): void {
    this.player.pause();
  }

  public seek(time: number): void {
    this.player.currentTime = time;
  }

  public setVolume(volume: number): void {
    this.player.volume = volume;
  }

  public requestFullscreen(): void {
    this.player.fullscreen.enter();
  }

  public on<K extends keyof PlayerEventMap>(event: K, callback: PlayerEventMap[K]): void {
    switch (event) {
      case "timeupdate":
        this.player.on("timeupdate", () => {
          (callback)(this.player.currentTime);
        });
        break;
      case "durationchange":
        this.player.on("loadedmetadata", () => {
          (callback)(this.player.duration);
        });
        break;
      default:
        this.player.on(event, () => { (callback as () => void)(); });
    }
  }

  public destroy(): void {
    this.player.destroy();
  }
}
