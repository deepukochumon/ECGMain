import { motion } from 'framer-motion';
import { DropZone } from '../../components/upload/DropZone';

export function Upload() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Upload ECG
      </h1>
      <DropZone />
    </motion.div>
  );
}