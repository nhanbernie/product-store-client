import React from 'react';
import { motion } from 'framer-motion';
import { spinnerVariants, getReducedMotionVariants } from '../../utils/animations';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'currentColor',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const variants = getReducedMotionVariants(spinnerVariants);

  return (
    <motion.div
      variants={variants}
      animate="animate"
      className={`border-2 border-current border-t-transparent rounded-full ${sizeClasses[size]} ${className}`}
      style={{ borderColor: color, borderTopColor: 'transparent' }}
    />
  );
};

export default LoadingSpinner;
