import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import { AuthPanel } from '../components/auth/AuthPanel';
import { PasswordInput } from '../components/auth/PasswordInput';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { CircularSpinner } from '../components/ui/CircularSpinner';
import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name) {
      newErrors.name = 'Name is required';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      console.log('User created:', user);

      if (user) {
        await setDoc(doc(db, 'Users', user.uid), {
          email: user.email,
          name: name,
        });
      }

      // Update the user's display name
      await updateProfile(user, { displayName: name });

      // Show success toast
      toast.success('Account created successfully!');
      toast.info('Use Signin to enter the analyzer');

    } catch (error: any) {
      console.error('Error during signup:', error.message);

      // Handle Firebase-specific errors and show error toast
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ email: 'Email is already in use' });
        toast.error('Email is already in use');
      } else if (error.code === 'auth/weak-password') {
        setErrors({ password: 'Password is too weak' });
        toast.error('Password is too weak');
      } else {
        setErrors({ general: 'Failed to create account. Please try again.' });
        toast.error('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AuthPanel
        title="Join ECG Analyzer"
        subtitle="Create an account to start monitoring your heart health with advanced ECG analysis tools."
      />

      <div className="flex w-full items-center justify-center px-4 sm:px-6 lg:w-1/2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Create your account
            </h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Full name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />

            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <PasswordInput
                value={password}
                onChange={setPassword}
                error={errors.password}
              />
            </div>

            {errors.general && (
              <p className="text-sm text-red-600">{errors.general}</p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <CircularSpinner />
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create account
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* ToastContainer for displaying toasts */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
