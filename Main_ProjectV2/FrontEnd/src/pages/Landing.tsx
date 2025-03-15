import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Activity, Brain, Shield, ChevronRight, Sun, Moon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useTheme } from '../context/ThemeContext';

export function Landing() {
  const { theme, toggleTheme } = useTheme();
  const [showContent, setShowContent] = useState(false);

  const handleLearnMore = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContent(true);
    const featuresSection = document.getElementById('features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Navigation */}
      <nav className={`fixed w-full backdrop-blur-md z-50 ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/80'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
          <div className="flex items-center justify-start">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className={`ml-2 text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              ECG Analyzer
            </span>
          </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-white" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>
              <Link
                to="/login"
                className={`${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} px-3 py-2 rounded-md text-sm font-medium`}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-5xl md:text-6xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            Advanced ECG Analysis
            <span className="text-blue-600"> Made Simple</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-xl mb-12 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
          >
            Transform your cardiac monitoring with AI-powered ECG analysis. Get instant, accurate insights into heart health.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center space-x-6"
          >
          <Button
            size="lg"
            className="group flex items-center justify-center text-lg px-8 py-4 bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-md"
          >
            <Link to="/signup" className="flex items-center justify-center w-full h-full">
              Start Analyzing
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
          <Button
              onClick={handleLearnMore}
              variant="outline"
              size="lg"
              className={`text-lg px-8 py-4 backdrop-blur-sm ${
                theme === 'dark' 
                  ? 'text-white hover:text-blue-400 border-white/20 hover:border-white/40 bg-white/5' 
                  : 'text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 bg-white/50'
              }`}
            >
              Learn More
            </Button>
          </motion.div>
        </div>
      </section>

      {showContent && (
        <>
          {/* Features Section */}
          <section id="features" className={`py-24 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <h2 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Powerful Features for Heart Health
                </h2>
                <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Everything you need to monitor and analyze ECG data effectively
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Activity,
                    title: "Real-time Analysis",
                    description: "Get instant insights from your ECG recordings with our advanced AI algorithms."
                  },
                  {
                    icon: Brain,
                    title: "AI-Powered Detection",
                    description: "Detect anomalies and patterns with machine learning technology."
                  },
                  {
                    icon: Shield,
                    title: "Secure Storage",
                    description: "Your ECG data is encrypted and stored securely in the cloud."
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * index }}
                    className={`p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow ${
                      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                    }`}
                  >
                    <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                    <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {feature.title}
                    </h3>
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-24">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <h2 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Frequently Asked Questions
                </h2>
                <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Get answers to common questions about ECG Analyzer
                </p>
              </motion.div>

              <div className="space-y-8">
                {[
                  {
                    question: "How accurate is the ECG analysis?",
                    answer: "Our AI-powered analysis system has been validated with over 1 million ECG recordings, achieving 98% accuracy in detecting common cardiac abnormalities."
                  },
                  {
                    question: "Is my data secure?",
                    answer: "Yes, we use industry-standard encryption and comply with HIPAA regulations to ensure your medical data is always protected."
                  },
                  {
                    question: "What file formats are supported?",
                    answer: "We support all major ECG file formats including PDF, XML, DICOM, and raw data files from popular ECG devices."
                  }
                ].map((faq, index) => (
                  <motion.div
                    key={faq.question}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * index }}
                    className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
                  >
                    <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {faq.question}
                    </h3>
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                      {faq.answer}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center mb-4">
                    <Heart className="h-6 w-6 text-blue-400" />
                    <span className="ml-2 text-lg font-bold">ECG Analyzer</span>
                  </div>
                  <p className="text-gray-400">
                    Advanced cardiac monitoring for healthcare professionals.
                  </p>
                </div>
                
                {[
                  {
                    title: "Product",
                    links: ["Features", "Pricing", "Documentation", "Updates"]
                  },
                  {
                    title: "Company",
                    links: ["About", "Careers", "Contact", "Blog"]
                  },
                  {
                    title: "Legal",
                    links: ["Privacy", "Terms", "Security", "HIPAA"]
                  }
                ].map((section) => (
                  <div key={section.title}>
                    <h3 className="font-bold mb-4">{section.title}</h3>
                    <ul className="space-y-2">
                      {section.links.map((link) => (
                        <li key={link}>
                          <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                <p>© 2024 ECG Analyzer. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </>
      )}{/*jissin */}
    </div>
  );
}