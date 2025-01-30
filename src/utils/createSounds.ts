const audioContext = new AudioContext();

const createOscillator = (frequency: number, type: OscillatorType, duration: number) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  return { oscillator, gainNode };
};

export const createDragSound = () => {
  const { oscillator, gainNode } = createOscillator(400, 'sine', 0.15);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.15);
};

export const createDropSound = () => {
  const { oscillator, gainNode } = createOscillator(600, 'sine', 0.2);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.2);
};

export const createCompleteSound = () => {
  const { oscillator: osc1 } = createOscillator(800, 'sine', 0.3);
  const { oscillator: osc2 } = createOscillator(1000, 'sine', 0.3);
  
  osc1.start();
  osc2.start(audioContext.currentTime + 0.1);
  
  osc1.stop(audioContext.currentTime + 0.3);
  osc2.stop(audioContext.currentTime + 0.4);
};