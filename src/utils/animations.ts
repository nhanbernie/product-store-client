import { Variants, Transition } from 'framer-motion';

// Easing curves
export const easing = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
} as const;

// Common transitions
export const transitions = {
  default: {
    duration: 0.3,
    ease: easing.easeInOut,
  },
  fast: {
    duration: 0.15,
    ease: easing.easeOut,
  },
  slow: {
    duration: 0.5,
    ease: easing.easeInOut,
  },
  bounce: {
    duration: 0.4,
    ease: easing.bounce,
  },
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  springBounce: {
    type: 'spring',
    stiffness: 400,
    damping: 25,
  },
} as const;

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

export const pageTransition: Transition = {
  duration: 0.4,
  ease: easing.easeInOut,
};

// Slide variants
export const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

// Scale variants
export const scaleVariants: Variants = {
  initial: {
    scale: 0.8,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
  },
  exit: {
    scale: 0.8,
    opacity: 0,
  },
};

// Fade variants
export const fadeVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

// Stagger container variants
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

// Stagger item variants
export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: transitions.fast,
  },
};

// Button hover variants
export const buttonHover: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: transitions.fast,
  },
  tap: {
    scale: 0.98,
    transition: transitions.fast,
  },
};

// Card hover variants
export const cardHover: Variants = {
  initial: {
    scale: 1,
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: transitions.default,
  },
};

// Heart animation variants
export const heartVariants: Variants = {
  initial: {
    scale: 1,
  },
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 0.3,
      ease: easing.bounce,
    },
  },
  hover: {
    scale: 1.1,
    transition: transitions.fast,
  },
};

// Cart badge variants
export const cartBadgeVariants: Variants = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: transitions.springBounce,
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: transitions.fast,
  },
  pulse: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 0.4,
      ease: easing.bounce,
    },
  },
};

// Modal variants
export const modalVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    y: 50,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: {
      duration: 0.2,
      ease: easing.easeIn,
    },
  },
};

// Backdrop variants
export const backdropVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

// Mobile menu variants
export const mobileMenuVariants: Variants = {
  closed: {
    x: '100%',
    transition: {
      duration: 0.3,
      ease: easing.easeInOut,
    },
  },
  open: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: easing.easeInOut,
    },
  },
};

// Dropdown variants
export const dropdownVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: -10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.15,
      ease: easing.easeIn,
    },
  },
};

// Loading spinner variants
export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Toast variants
export const toastVariants: Variants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.3,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: easing.bounce,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.5,
    transition: {
      duration: 0.2,
      ease: easing.easeIn,
    },
  },
};

// Number counter variants
export const numberCounterVariants: Variants = {
  initial: {
    y: 20,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: transitions.fast,
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: transitions.fast,
  },
};

// Utility function to check if user prefers reduced motion
export const shouldReduceMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Utility function to get reduced motion variants
export const getReducedMotionVariants = (variants: Variants): Variants => {
  if (shouldReduceMotion()) {
    return Object.keys(variants).reduce((acc, key) => {
      acc[key] = { opacity: variants[key]?.opacity || 1 };
      return acc;
    }, {} as Variants);
  }
  return variants;
};
