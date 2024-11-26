import { create } from 'zustand';

interface AudioState {
  audioContext: AudioContext | null;
  gainNode: GainNode | null;
  isInitialized: boolean;
  volume: number;
  initialize: () => void;
  setVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  audioContext: null,
  gainNode: null,
  isInitialized: false,
  volume: 0.8,

  initialize: () => {
    if (get().isInitialized) return;
    
    const audioContext = new AudioContext();
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    gainNode.gain.value = get().volume;
    
    set({ 
      audioContext, 
      gainNode,
      isInitialized: true 
    });
  },

  setVolume: (volume) => {
    const { gainNode } = get();
    if (gainNode) {
      gainNode.gain.value = volume;
      set({ volume });
    }
  }
}));