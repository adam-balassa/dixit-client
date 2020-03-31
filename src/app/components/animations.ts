import { trigger, transition, style, animate, AnimationTriggerMetadata } from '@angular/animations';

export function animation(
  duration: number = 300, translation: number = 0, direction: string = 'X', name: string = 'appear'
  ): AnimationTriggerMetadata {
  return trigger(name, [
    transition('void => *', [
      style({ opacity: 0, transform: `translate${direction}(${translation}px)` }),
      animate(`${duration}ms ease`),
      style({ opacity: 1, transform: `translate${direction}(0)` }),
    ]),
    transition('* => void', [
      animate(`${duration}ms ease`),
      style({ opacity: 0, transform: `translate${direction}(${translation}px)` }),
    ]),
  ]);
}
