import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface AuthPanelProps {
  title: string;
  subtitle: string;
}

export function AuthPanel({ title, subtitle }: AuthPanelProps) {
  return (
    <div className="hidden w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 lg:block">
      <div className="flex h-full flex-col items-center justify-center px-12 text-white">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          <Heart className="mb-8 h-16 w-16" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 text-4xl font-bold"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center text-lg text-white"
        >
          {subtitle}
        </motion.p>
      </div>
    </div>
  );
}
