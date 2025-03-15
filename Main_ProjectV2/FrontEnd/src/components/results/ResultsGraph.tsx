import { motion } from 'framer-motion';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ResultsGraphProps {
  isLoading?: boolean;
  data?: number[];
}

export function ResultsGraph({ isLoading, data }: ResultsGraphProps) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!data?.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">
          No ECG data available
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-64 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800"
    >
      {/* Graph implementation will go here */}
      <div className="h-full w-full rounded-lg bg-gray-50 dark:bg-gray-700" />
    </motion.div>
  );
}