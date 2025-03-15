import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from '../../components/layout/Sidebar';
import { TopBar } from '../../components/layout/TopBar';

export function DashboardLayout() {
  const location = useLocation(); // Get the current route path

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <TopBar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="ml-[280px] p-8 pt-24"
      >
        <div className="mx-auto max-w-7xl space-y-6">

          {/* Show Welcome Section ONLY on /dashboard */}
          {location.pathname === "/dashboard" && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Welcome to Your ECG Dashboard
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                Monitor and analyze your ECG data efficiently.
              </p>
            </motion.div>
          )}

          {/* Show Instructions ONLY on /dashboard */}
          {location.pathname === "/dashboard" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.4 }}
              className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Quick Navigation Guide
              </h2>
              <ul className="mt-4 space-y-3 text-gray-700 dark:text-gray-300">
                <motion.li 
                  whileHover={{ scale: 1.02, color: "#2563eb" }} 
                  className="cursor-pointer"
                >
                  🔍 Click <strong>Hardware Analysis</strong> for real-time ECG analysis using hardware.
                </motion.li>
                <motion.li 
                  whileHover={{ scale: 1.02, color: "#2563eb" }} 
                  className="cursor-pointer"
                >
                  📤 Click <strong>Upload ECG</strong> to upload and analyze ECG data.
                </motion.li>
                <motion.li 
                  whileHover={{ scale: 1.02, color: "#2563eb" }} 
                  className="cursor-pointer"
                >
                  📊 Click <strong>History</strong> to view your analysis results.
                </motion.li>
                <motion.li 
                  whileHover={{ scale: 1.02, color: "#2563eb" }} 
                  className="cursor-pointer"
                >
                  👤 Click <strong>Profile</strong> to view and update your user profile.
                </motion.li>
              </ul>
            </motion.div>
          )}

          {/* Outlet for Child Routes */}
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
}
