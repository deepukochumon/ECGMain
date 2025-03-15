import { motion } from 'framer-motion';

export function CircularSpinner() {
  return (
    <motion.div
      className="h-6 w-6 rounded-full border-2 border-blue-500 border-t-transparent"
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
}