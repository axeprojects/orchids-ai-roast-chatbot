export type Mood = 'idle' | 'angry' | 'amused' | 'evil_grin' | 'disgusted';

export interface PsychoReactionEvent {
  mood: Mood;
  intensity: number;
  text: string;
  audio?: string;
}

export const emitPsychoReaction = (event: PsychoReactionEvent) => {
  window.dispatchEvent(new CustomEvent('psycho-reaction', { detail: event }));
};

export const onPsychoReaction = (callback: (event: PsychoReactionEvent) => void) => {
  const handler = (e: Event) => {
    callback((e as CustomEvent<PsychoReactionEvent>).detail);
  };
  window.addEventListener('psycho-reaction', handler);
  return () => window.removeEventListener('psycho-reaction', handler);
};
