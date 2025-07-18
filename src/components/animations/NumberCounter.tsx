import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  numberCounterVariants,
  getReducedMotionVariants,
} from "../../utils/animations";

interface NumberCounterProps {
  value: number;
  className?: string;
  format?: (value: number) => string;
}

const NumberCounter: React.FC<NumberCounterProps> = ({
  value,
  className = "",
  format = (val) => val.toString(),
}) => {
  const variants = getReducedMotionVariants(numberCounterVariants);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={value}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={`inline-block ${className}`}
      >
        {format(value)}
      </motion.span>
    </AnimatePresence>
  );
};

export default NumberCounter;
