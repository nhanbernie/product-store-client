import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getReducedMotionVariants } from '../../utils/animations';

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  error,
  icon,
  required = false,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const inputVariants = getReducedMotionVariants({
    initial: {
      scale: 1,
      borderColor: error ? '#ef4444' : '#d1d5db',
    },
    focused: {
      scale: 1.01,
      borderColor: '#10b981',
      boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)',
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
    error: {
      scale: 1,
      borderColor: '#ef4444',
      boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
    },
  });

  const labelVariants = getReducedMotionVariants({
    initial: {
      color: '#6b7280',
    },
    focused: {
      color: '#10b981',
      transition: {
        duration: 0.2,
      },
    },
    error: {
      color: '#ef4444',
    },
  });

  const errorVariants = getReducedMotionVariants({
    initial: {
      opacity: 0,
      y: -10,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  });

  const getAnimationState = () => {
    if (error) return 'error';
    if (isFocused) return 'focused';
    return 'initial';
  };

  return (
    <div className="space-y-2">
      {label && (
        <motion.label
          htmlFor={props.id}
          variants={labelVariants}
          animate={getAnimationState()}
          className="block text-sm font-medium"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <motion.input
          variants={inputVariants}
          animate={getAnimationState()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full py-3 px-4 border rounded-lg 
            focus:outline-none focus:ring-0 
            transition-colors duration-200
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <motion.p
          variants={errorVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default AnimatedInput;
