import { keyframes } from '@emotion/react';

// Fade in animation
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Fade in up animation
export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Fade in down animation
export const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Fade in left animation
export const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Fade in right animation
export const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Pulse animation
export const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Bounce animation
export const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
`;

// Spin animation
export const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Shake animation
export const shake = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
`;

// Animation durations
export const durations = {
  short: '0.2s',
  medium: '0.4s',
  long: '0.6s'
};

// Animation easings
export const easings = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
};

// Animation helpers
export const animationHelpers = {
  fadeIn: (duration = durations.medium, easing = easings.easeInOut) => `
    animation: ${fadeIn} ${duration} ${easing};
  `,
  fadeInUp: (duration = durations.medium, easing = easings.easeOut) => `
    animation: ${fadeInUp} ${duration} ${easing};
  `,
  fadeInDown: (duration = durations.medium, easing = easings.easeOut) => `
    animation: ${fadeInDown} ${duration} ${easing};
  `,
  fadeInLeft: (duration = durations.medium, easing = easings.easeOut) => `
    animation: ${fadeInLeft} ${duration} ${easing};
  `,
  fadeInRight: (duration = durations.medium, easing = easings.easeOut) => `
    animation: ${fadeInRight} ${duration} ${easing};
  `,
  pulse: (duration = durations.long, easing = easings.easeInOut) => `
    animation: ${pulse} ${duration} ${easing} infinite;
  `,
  bounce: (duration = durations.long, easing = easings.easeInOut) => `
    animation: ${bounce} ${duration} ${easing} infinite;
  `,
  spin: (duration = durations.long, easing = easings.easeInOut) => `
    animation: ${spin} ${duration} ${easing} infinite;
  `,
  shake: (duration = durations.short, easing = easings.sharp) => `
    animation: ${shake} ${duration} ${easing};
  `
};

export default {
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  pulse,
  bounce,
  spin,
  shake,
  durations,
  easings,
  ...animationHelpers
};

