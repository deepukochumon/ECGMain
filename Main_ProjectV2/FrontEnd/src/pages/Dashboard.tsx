import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, User, LogOut } from "lucide-react";
import { Button } from "../components/ui/Button";

export function Dashboard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      console.log("File selected:", e.target.files[0].name);
    } else {
      console.error("No file selected.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white shadow dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                ECG Analyzer
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="secondary" size="sm">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
          >
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Upload ECG File
            </h2>
            <div className="flex flex-col items-center space-y-4">
              <label
                htmlFor="file-upload"
                className="flex w-full cursor-pointer flex-col items-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <Upload className="mb-2 h-8 w-8 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Click to upload or drag and drop
                </span>
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".ecg,.txt"
                onChange={handleFileUpload}
              />

              {selectedFile && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Selected file: {selectedFile.name}
                </p>
              )}

              <Button
                className="w-full"
                onClick={() => {
                  if (selectedFile) {
                    console.log("Processing file:", selectedFile.name);
                  } else {
                    alert("Please select a file first.");
                  }
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                Analyze ECG
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
          >
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Analysis Results
            </h2>
            <div className="text-center text-gray-500 dark:text-gray-400">
              Upload an ECG file to see analysis results
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
