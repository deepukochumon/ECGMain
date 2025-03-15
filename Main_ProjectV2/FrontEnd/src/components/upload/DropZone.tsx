//edited on 20 febaruary

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Eye,
  Trash,
  Download,
} from "lucide-react";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";

interface FileWithPreview extends File {
  preview?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [".jpg", ".jpeg", ".png"];

export function DropZone() {
  const { currentUser } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("model1");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [documentData, setDocumentData] = useState<Uint8Array | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return "File size exceeds 10MB limit";
    }

    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_FILE_TYPES.includes(fileExtension)) {
      return "Invalid file type";
    }

    return null;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const newFiles = Array.from(e.dataTransfer.files);

    newFiles.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        alert(error);
        return;
      }

      if (file.type.startsWith("image/")) {
        const preview = URL.createObjectURL(file);
        setFiles((prev) => [...prev, Object.assign(file, { preview })]);
      } else {
        setFiles((prev) => [...prev, file]);
      }
    });
  }, []);

  const handleBrowseFiles = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      selectedFiles.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          alert(error);
          return;
        }

        if (file.type.startsWith("image/")) {
          const preview = URL.createObjectURL(file);
          setFiles((prev) => [...prev, Object.assign(file, { preview })]);
        } else {
          setFiles((prev) => [...prev, file]);
        }
      });
    },
    []
  );

  const analyzeECG = async () => {
    if (!files.length) {
      toast.error("Please upload an ECG image first");
      return;
    }
    setAnalyzing(true);
    setAnalysisResult(null);
    setDocumentData(null);
    const m = selectedModel === "model1" ? 1 : 2;
    setAnalyzing(true);
    setAnalysisResult(null);
    setDocumentData(null);
    let userId = null
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      userId = user.uid;
      
      if (!user) {
        throw new Error("User not authenticated");
      }
    }catch{
      console.log('printt')
    }
    try {
      const formData = new FormData();
      formData.append("image", files[0]);
      const response = await fetch(`http://localhost:5001/analyze?m=${m}&user_id=${userId}`, {
        method: "POST",
        body: formData,
      });


      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const result = await response.json();
      setAnalysisResult(result.report);

      if (currentUser?.uid) {
        await setAnalysisResult(
          result.report,
        );
        toast.success("Analysis saved to history");
      }


      // Convert base64 document to Uint8Array
      const binaryString = atob(result.document);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      setDocumentData(bytes);
    } catch (error) {
      console.error("Error analyzing ECG:", error);
      toast.error("Failed to analyze ECG");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDownload = () => {
    if (!documentData) return;

    const blob = new Blob([documentData], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ECG_Report.docx";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const formatAnalysisResult = (text: string) => {
    return text.split("\n").map((line, index) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <h2 key={index} className="text-xl font-bold mt-6 mb-3">
            {line.replace(/\*\*/g, "")}
          </h2>
        );
      } else if (line.startsWith("-")) {
        if (line.includes("Normal or Abnormal:")) {
          const status = line.toLowerCase();
          let statusColor = "text-yellow-500";
          if (status.includes("normal")) {
            statusColor = "text-green-500";
          } else if (status.includes("abnormal")) {
            statusColor = "text-red-500";
          }
          return (
            <div key={index} className="flex items-start ml-4 mb-2">
              <span className="mr-2">•</span>
              <span>
                Normal or Abnormal:{" "}
                <span className={`font-semibold ${statusColor}`}>
                  {line.split(":")[1].trim()}
                </span>
              </span>
            </div>
          );
        }
        return (
          <div key={index} className="flex items-start ml-4 mb-2">
            <span className="mr-2">•</span>
            <span>{line.substring(2)}</span>
          </div>
        );
      }
      return (
        <p key={index} className="mb-2">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
      >
        {/* Model Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Select Model
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="model1">Model V1</option>
            <option value="model2">Model V2</option>
          </select>
        </div>

        {/* Drop Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative rounded-lg border-2 border-dashed p-8 transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <div className="flex flex-col items-center">
            <Upload className="mb-4 h-12 w-12 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              Drag and drop your files here, or{" "}
              <span className="text-blue-600 hover:text-blue-500">
                click to select
              </span>
            </p>
            <p className="text-xs text-gray-500">
              Supported formats: JPG, PNG (max 10MB)
            </p>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept={ACCEPTED_FILE_TYPES.join(",")}
          className="hidden"
          onChange={handleBrowseFiles}
        />

        {/* Files List and Analysis Results */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div className="mt-6 space-y-4">
              {/* File List */}
              {files.map((file, index) => (
                <motion.div
                  key={file.name}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center space-x-4">
                    <ImageIcon className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {file.preview && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(file.preview, "_blank")}
                      >
                        <Eye size={16} />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFiles(files.filter((_, i) => i !== index));
                        if (file.preview) {
                          URL.revokeObjectURL(file.preview);
                        }
                      }}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </motion.div>
              ))}

              {/* Analysis Controls */}
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setFiles([])}>
                  Clear All
                </Button>
                <Button
                  onClick={analyzeECG}
                  disabled={analyzing || files.length === 0}
                >
                  {analyzing ? "Analyzing..." : "Analyze ECG"}
                </Button>
              </div>

              {/* Analysis Results */}
              {analyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-4 bg-blue-50 rounded-lg"
                >
                  <p className="text-center text-blue-600">Analyzing ECG...</p>
                </motion.div>
              )}

              {analysisResult && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-6 bg-white rounded-lg shadow"
                >
                  <div className="prose max-w-none">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold">Analysis Result</h3>
                      <Button
                        onClick={handleDownload}
                        disabled={!documentData}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download Report
                      </Button>
                    </div>
                    <div className="mt-4">
                      {formatAnalysisResult(analysisResult)}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
