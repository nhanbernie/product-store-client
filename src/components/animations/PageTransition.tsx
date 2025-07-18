import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition, getReducedMotionVariants } from '../../utils/animations';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  const variants = getReducedMotionVariants(pageVariants);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={variants}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
