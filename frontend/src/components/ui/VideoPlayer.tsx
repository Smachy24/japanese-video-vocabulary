import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "plyr/dist/plyr.css";
import type { FunctionComponent } from "../../common/types";
import { PlyrPlayer } from "../../features/player/plyr-player";
import type { IVideoPlayer } from "../../features/player/player.interface";
import { usePlayerStore } from "../../store/player-store";
import { SubtitleDisplay } from "./SubtitleDisplay";

type Props = {
  src: string;
};

export const VideoPlayer = ({ src }: Props): FunctionComponent => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<IVideoPlayer | null>(null);
  const [plyrContainer, setPlyrContainer] = useState<Element | null>(null);
  const { setCurrentTime, setDuration, setIsPlaying, reset } = usePlayerStore();

  useEffect(() => {
    if (!videoRef.current) return;

    const player = new PlyrPlayer(videoRef.current);
    playerRef.current = player;

    setPlyrContainer(videoRef.current.closest(".plyr"));

    player.on("timeupdate", setCurrentTime);
    player.on("durationchange", setDuration);
    player.on("play", () => { setIsPlaying(true); });
    player.on("pause", () => { setIsPlaying(false); });
    player.on("ended", () => { setIsPlaying(false); });

    return (): void => {
      player.destroy();
      reset();
      setPlyrContainer(null);
    };
  }, [src, setCurrentTime, setDuration, setIsPlaying, reset]);

  return (
    <>
      <video ref={videoRef} className="w-full" src={src} />
      {plyrContainer && createPortal(<SubtitleDisplay />, plyrContainer)}
    </>
  );
};
