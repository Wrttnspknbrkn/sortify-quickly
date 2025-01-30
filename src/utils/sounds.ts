import { createDragSound, createDropSound, createCompleteSound } from './createSounds';

export const playDragSound = () => {
  try {
    createDragSound();
  } catch (error) {
    console.log('Error playing drag sound:', error);
  }
};

export const playDropSound = () => {
  try {
    createDropSound();
  } catch (error) {
    console.log('Error playing drop sound:', error);
  }
};

export const playCompleteSound = () => {
  try {
    createCompleteSound();
  } catch (error) {
    console.log('Error playing complete sound:', error);
  }
};