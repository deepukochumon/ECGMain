import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { getAuth } from 'firebase/auth';

interface AnalysisRecord {
  id: number;
  timestamp: string;
  report: string;
  document_base64: string;
}

const AnalysisHistory: React.FC = () => {
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (!user) {
        throw new Error("User is not authenticated");
      }
  
      const uid = user.uid;
      const response = await fetch(`http://localhost:5001/analysis-history?user_id=${uid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analysis history');
      }
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = (analysis: AnalysisRecord) => {
    const byteCharacters = atob(analysis.document_base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ECG_Analysis_${format(new Date(analysis.timestamp), 'yyyy-MM-dd_HH-mm')}.docx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const formatReport = (report: string) => {
    const sections = report.split('**').filter(Boolean);
    return sections.map((section, index) => {
      if (section.trim().endsWith(':')) {
        // This is a heading
        return (
          <div key={index} className="mt-6 first:mt-0">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
              {section.trim()}
            </h3>
          </div>
        );
      } else {
        // This is content
        const lines = section.split('\n').filter(Boolean);
        return (
          <div key={index} className="space-y-2">
            {lines.map((line, lineIndex) => {
              if (line.startsWith('-')) {
                const [label, value] = line.substring(1).split(':').map(s => s.trim());
                return (
                  <div key={lineIndex} className="flex flex-col sm:flex-row sm:items-start gap-2 text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[200px]">{label}:</span>
                    <span className="text-gray-600 dark:text-gray-400">{value}</span>
                  </div>
                );
              }
              return (
                <p key={lineIndex} className="text-sm text-gray-600 dark:text-gray-400">
                  {line.trim()}
                </p>
              );
            })}
          </div>
        );
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Analysis List */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <h2 className="text-lg font-semibold p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          Analysis History
        </h2>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {history.map((analysis,index) => (
            <div
              key={analysis.id}
              className={`p-4 cursor-pointer transition-colors ${
                selectedAnalysis?.id === analysis.id 
                  ? 'bg-blue-50 dark:bg-blue-900' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => setSelectedAnalysis(analysis)}
            >
              <div className="font-medium text-gray-900 dark:text-gray-100">
                Analysis {index+1}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(analysis.timestamp), 'PPpp')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Details */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800">
        {selectedAnalysis ? (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Analysis Details
              </h2>
              <button
                onClick={() => downloadReport(selectedAnalysis)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Download Report
              </button>
            </div>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {formatReport(selectedAnalysis.report)}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            Select an analysis to view details
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisHistory; 