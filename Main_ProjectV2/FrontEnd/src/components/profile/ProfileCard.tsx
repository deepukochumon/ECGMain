//new edited one by 20 february

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { db, auth } from '../../pages/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import personImage from './person.png';

export function ProfileCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [userAge, setUserAge] = useState<string>('');
  const [emergencyContact, setEmergencyContact] = useState<string>('');
  const [medicalHistory, setMedicalHistory] = useState<string[]>([]);
  const [isMedicalHistoryVisible, setIsMedicalHistoryVisible] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
        try {
          const userDocRef = doc(db, 'Users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.name || 'Unknown User');
            setUserAge(userData.age || 'Unknown Age');
            setEmergencyContact(userData.emergencyContact || 'Not Provided');
            setMedicalHistory(userData.medicalHistory || []);
          } else {
            console.log('User document does not exist, creating a new one...');
            await setDoc(userDocRef, {
              name: 'Unknown User',
              age: '',
              emergencyContact: '',
              medicalHistory: [],
            });
          }
        } catch (error) {
          setError('Failed to fetch user data.');
          console.error('Error fetching user data:', error);
        }
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (!userId) return;
    if (userName.trim() === '') {
      setError('Name cannot be empty.');
      return;
    }
    if (userAge !== '' && (isNaN(Number(userAge)) || Number(userAge) <= 0)) {
      setError('Age must be a valid positive number.');
      return;
    }

    try {
      setError(null);
      const userDocRef = doc(db, 'Users', userId);
      await updateDoc(userDocRef, {
        name: userName.trim(),
        age: userAge.trim() === '' ? 'Unknown Age' : userAge.trim(),
        emergencyContact: emergencyContact.trim() === '' ? 'Not Provided' : emergencyContact.trim(),
        medicalHistory,
      });
      setIsEditing(false);
      console.log('User profile updated successfully.');
    } catch (error) {
      setError('Error updating profile.');
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-2 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
      >
        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={personImage}
                    alt="Default profile"
                    className="h-20 w-20 rounded-full bg-gray-300"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isEditing ? (
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="border rounded p-1 text-black w-full"
                      />
                    ) : (
                      userName
                    )}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">User Id: {userId}</p>
                </div>
              </div>
              <Button onClick={isEditing ? handleSave : () => setIsEditing(true)}>
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>

            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="border rounded p-1 text-black w-full"
                />
              ) : (
                <p className="mt-1 text-gray-900 dark:text-white">{userName}</p>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Age
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={userAge}
                  onChange={(e) => setUserAge(e.target.value)}
                  className="border rounded p-1 text-black w-full"
                />
              ) : (
                <p className="mt-1 text-gray-900 dark:text-white">{userAge}</p>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Emergency Contact
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="border rounded p-1 text-black w-full"
                />
              ) : (
                <p className="mt-1 text-gray-900 dark:text-white">{emergencyContact}</p>
              )}
            </div>

            {/* Medical History Section */}
            <div className="mt-6">
              <button
                onClick={() => setIsMedicalHistoryVisible(!isMedicalHistoryVisible)}
                className="w-full text-left text-sm font-medium text-blue-500"
              >
                {isMedicalHistoryVisible ? 'Hide Medical History' : 'View Medical History'}
              </button>
              {isMedicalHistoryVisible && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
                  {medicalHistory.length > 0 ? (
                    <ul className="list-disc pl-4 text-gray-900 dark:text-white">
                      {medicalHistory.map((entry, index) => (
                        <li key={index}>{entry}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-300">No medical history available.</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
