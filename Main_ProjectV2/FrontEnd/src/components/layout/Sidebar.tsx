import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MonitorSmartphone, Upload, LineChart, User, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

const menuItems = [
  { icon: MonitorSmartphone, label: 'Hardware Analysis', path: '/dashboard/hardware' },
  { icon: Upload, label: 'Upload ECG', path: '/dashboard/upload' },
  { icon: LineChart, label: 'History', path: '/dashboard/results' },
  { icon: User, label: 'Profile', path: '/dashboard/profile' },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.div
      initial={false}
      animate={{ 
        width: isCollapsed ? 80 : 280,
        transition: { duration: 0.3, ease: 'easeInOut' }
      }}
      className="fixed left-0 top-0 h-screen bg-white/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 dark:bg-gray-900/80 z-30"
    >
      <div className="flex h-16 items-center justify-between px-4">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center"
            >
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="ml-3 text-lg font-bold text-gray-900 dark:text-white">
                ECG Analyzer
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      <nav className="mt-6 px-3">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={clsx(
              'mb-2 flex items-center rounded-lg px-3 py-2.5 transition-all duration-200',
              location.pathname === item.path
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            )}
          >
            <item.icon size={20} className="flex-shrink-0" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="ml-3"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        ))}
      </nav>
    </motion.div>
  );
}