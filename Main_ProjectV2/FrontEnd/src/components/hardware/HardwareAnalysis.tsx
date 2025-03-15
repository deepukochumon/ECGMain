import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, MonitorSmartphone, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export function HardwareAnalysis() {
  const [isScanning, setIsScanning] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setShowError(false);
    
    setTimeout(() => {
      setIsScanning(false);
      setShowError(true);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
      >
        <div className="text-center">
          <Button
            onClick={handleScan}
            disabled={isScanning}
            className="group relative w-64 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            <AnimatePresence mode="wait">
              {isScanning ? (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center"
                >
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Hardware...
                </motion.div>
              ) : (
                <motion.div
                  key="start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center"
                >
                  <MonitorSmartphone className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  Start Hardware Analysis
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>

        <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 rounded-lg bg-red-50 p-4 dark:bg-red-900/20"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400 animate-pulse" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    No Hardware Detected
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <p>
                      Please ensure your ECG hardware is properly connected and powered on.
                      Check all connections and try again.
                    </p>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <Button
                      size="sm"
                      onClick={() => {
                        setShowError(false);
                        handleScan();
                      }}
                      className="bg-red-50 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/40"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Try Again
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowError(false)}
                      className="text-red-800 dark:text-red-200"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}