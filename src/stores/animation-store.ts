import { create } from "zustand";

interface AnimationState {
  animateHero: boolean;
  setAnimateHero: (animate: boolean) => void;
}

export const useAnimationStore = create<AnimationState>((set) => ({
  animateHero: false,
  setAnimateHero: (animate) => set({ animateHero: animate }),
}));