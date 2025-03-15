import { motion } from 'framer-motion';
import { Chrome, Facebook } from 'lucide-react';

const socialButtons = [
  {
    icon: Chrome,
    label: 'Continue with Google',
    bgColor: 'bg-white hover:bg-gray-50',
    textColor: 'text-gray-600',
    borderColor: 'border-gray-300',
  },
  {
    icon: Facebook,
    label: 'Continue with Facebook',
    bgColor: 'bg-blue-600 hover:bg-blue-700',
    textColor: 'text-white',
    borderColor: 'border-blue-600',
  },
];

export function SocialLogin() {
  return (
    <div className="space-y-3">
      {socialButtons.map((button, index) => (
        <motion.button
          key={button.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + index * 0.1 }}
          className={`flex w-full items-center justify-center space-x-2 rounded-lg border ${button.borderColor} ${button.bgColor} px-4 py-2 transition-colors ${button.textColor}`}
        >
          <button.icon size={20} />
          <span>{button.label}</span>
        </motion.button>
      ))}
    </div>
  );
}