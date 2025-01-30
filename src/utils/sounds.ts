const dragSound = new Audio('/sounds/drag.mp3');
const dropSound = new Audio('/sounds/drop.mp3');
const completeSound = new Audio('/sounds/complete.mp3');

export const playDragSound = () => {
  dragSound.currentTime = 0;
  dragSound.volume = 0.3;
  dragSound.play().catch(() => {});
};

export const playDropSound = () => {
  dropSound.currentTime = 0;
  dropSound.volume = 0.3;
  dropSound.play().catch(() => {});
};

export const playCompleteSound = () => {
  completeSound.currentTime = 0;
  completeSound.volume = 0.4;
  completeSound.play().catch(() => {});
};