import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../pages/firebase"; // Import Firestore and Auth instances
import { doc, getDoc } from "firebase/firestore"; // Firestore methods
import { onAuthStateChanged } from "firebase/auth"; // For auth state

export function TopBar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Loading...");
  const [userRole, setUserRole] = useState("");

  // Function to fetch user data from Firestore
  const fetchUserData = async (uid: string): Promise<void> => { // Explicitly declare uid as a string
    try {
      const userDocRef = doc(db, "Users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData.name.toUpperCase() || "Unknown User");
        setUserRole(userData.role || "User");
      } else {
        console.error("No user document found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fetch the user data using their UID
        fetchUserData(user.uid);
      } else {
        // Handle case where no user is signed in
        setUserName("Guest");
        setUserRole("");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="fixed left-0 right-0 top-0 z-20 border-b border-gray-200 dark:border-gray-800">
      <div className="flex h-16 items-center justify-between bg-white/80 px-4 backdrop-blur-xl dark:bg-gray-900/80">
        <div className="flex items-center ml-[280px] space-x-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-3"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium">
              {userName.charAt(0).toUpperCase()} {/* Display first letter */}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {userName}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {userRole}
              </span>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
            onClick={() => {
              auth.signOut(); // Sign out the user
              navigate("/login"); // Redirect to login page
            }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
