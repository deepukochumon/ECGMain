import { motion } from 'framer-motion';
import AnalysisHistory from '../../components/results/AnalysisHistory';

export function Results() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        ECG Analysis History
      </h1>
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <AnalysisHistory />
      </div>
    </motion.div>
  );
}