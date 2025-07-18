import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, getReducedMotionVariants } from '../../utils/animations';

interface StaggeredListProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  className = '',
  delay = 0.1,
  staggerDelay = 0.1,
}) => {
  const containerVariants = getReducedMotionVariants({
    ...staggerContainer,
    animate: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggeredItemProps {
  children: React.ReactNode;
  className?: string;
}

export const StaggeredItem: React.FC<StaggeredItemProps> = ({
  children,
  className = '',
}) => {
  const itemVariants = getReducedMotionVariants(staggerItem);

  return (
    <motion.div
      variants={itemVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default StaggeredList;
