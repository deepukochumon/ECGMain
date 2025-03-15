import { motion } from 'framer-motion';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="h-1 w-24 rounded-full bg-blue-500"
        animate={{
          scaleX: [1, 1.5, 1],
          x: [-100, 100, -100],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}