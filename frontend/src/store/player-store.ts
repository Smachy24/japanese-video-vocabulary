import { create } from "zustand";

type PlayerState = {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
};

type PlayerActions = {
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  reset: () => void;
};

const initialState: PlayerState = {
  currentTime: 0,
  duration: 0,
  isPlaying: false,
};

const usePlayerStore = create<PlayerState & PlayerActions>((set) => ({
  ...initialState,
  setCurrentTime: (time): void => { set({ currentTime: time }); },
  setDuration: (duration): void => { set({ duration }); },
  setIsPlaying: (isPlaying): void => { set({ isPlaying }); },
  reset: (): void => { set(initialState); },
}));

export { usePlayerStore };
