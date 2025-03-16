import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, MonitorSmartphone, RefreshCw, Play, Pause, StopCircle, Download, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

export function HardwareAnalysis() {
  const [isScanning, setIsScanning] = useState(false);
  const [hardwareDetected, setHardwareDetected] = useState(false);
  const [plotData, setPlotData] = useState<number[]>([]);
  const [isPlotting, setIsPlotting] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [hasScanned, setHasScanned] = useState(false);
  const [serialPort, setSerialPort] = useState<SerialPort | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const isWebSerialSupported = 'serial' in navigator;

  const connectToArduino = async () => {
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      setSerialPort(port);
      setHardwareDetected(true);
      return true;
    } catch (error) {
      console.error('Error connecting to Arduino:', error);
      setHardwareDetected(false);
      return false;
    }
  };

  const disconnectFromArduino = async () => {
    if (serialPort) {
      await serialPort.close();
      setSerialPort(null);
      setHardwareDetected(false);
    }
  };

  const readDataFromArduino = async () => {
    if (!serialPort) return;

    const reader = serialPort.readable?.getReader();
    if (!reader) return;

    while (isPlotting && hardwareDetected) {
      try {
        const { value, done } = await reader.read();
        if (done || !isPlotting) break; // Stop reading if paused or disconnected

        const ecgValue = parseInt(new TextDecoder().decode(value), 10);
        if (!isNaN(ecgValue)) {
          setPlotData((prevData) => {
            const newData = [...prevData, ecgValue];
            return newData.slice(-300); // Keep the last 300 data points
          });
        }
      } catch (error) {
        console.error('Error reading data from Arduino:', error);
        break;
      }
    }

    reader.releaseLock();
  };

  const handleScan = async () => {
    if (!isWebSerialSupported) {
      alert('Web Serial API is not supported in this browser.');
      return;
    }

    setIsScanning(true);
    setHardwareDetected(false);
    setCapturedImage(null);
    setHasScanned(true);
    setIsPlotting(false);
    setPlotData([]);

    await disconnectFromArduino();

    const connected = await connectToArduino();
    setIsScanning(false);

    if (!connected) {
      setIsPlotting(false);
      setPlotData([]);
    }
  };

  const handleExit = async () => {
    setIsPlotting(false); // Stop plotting
    await disconnectFromArduino(); // Disconnect from Arduino
    setHardwareDetected(false); // Reset hardware detection state
    setCapturedImage(null); // Clear captured image
    setPlotData([]); // Clear plot data
  };

  const handlePause = () => {
    setIsPlotting((prev) => !prev); // Toggle plotting state
  };

  const capturePlot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current, { backgroundColor: '#fff' });
      setCapturedImage(canvas.toDataURL('image/png'));
    }
  };

  const handleImageUpload = async () => {
    if (capturedImage) {
      console.log('Uploading image to server:', capturedImage);
    }
  };

  useEffect(() => {
    if (isPlotting && hardwareDetected) {
      readDataFromArduino();
    }
  }, [isPlotting, hardwareDetected]);

  useEffect(() => {
    if (chartRef.current) {
      const data = [
        {
          y: plotData,
          type: 'scatter',
          mode: 'lines',
          line: { color: 'blue' },
        },
      ];

      const layout = {
        title: 'ECG Signal',
        xaxis: { title: 'Time' },
        yaxis: { title: 'Value', range: [0, 1023] },
      };

      Plotly.newPlot(chartRef.current, data, layout);
    }
  }, [plotData]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <Button onClick={handleScan} disabled={isScanning || !isWebSerialSupported} className="relative w-64 px-8 py-4 text-lg font-medium text-white bg-blue-600 shadow-lg transition-all hover:bg-blue-700 disabled:opacity-70">
            <AnimatePresence mode="wait">
              {isScanning ? (
                <motion.div key="scanning" className="flex items-center justify-center">
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Hardware...
                </motion.div>
              ) : (
                <motion.div key="start" className="flex items-center justify-center">
                  <MonitorSmartphone className="mr-2 h-5 w-5" />
                  Start Hardware Analysis
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>

        {!isWebSerialSupported && (
          <motion.div className="mt-6 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 animate-pulse" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Web Serial API Not Supported</h3>
                <p className="text-sm text-red-700 dark:text-red-300">Please use a browser that supports the Web Serial API (e.g., Chrome or Edge).</p>
              </div>
            </div>
          </motion.div>
        )}

        {hasScanned && !hardwareDetected && !isScanning && isWebSerialSupported && (
          <motion.div className="mt-6 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 animate-pulse" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">No Hardware Detected</h3>
                <p className="text-sm text-red-700 dark:text-red-300">Ensure your Arduino board is connected to a valid port.</p>
                <Button size="sm" onClick={handleScan} className="mt-2">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {hardwareDetected && (
          <div className="mt-6 space-y-4">
            <div className="flex space-x-3">
              <Button onClick={() => setIsPlotting(true)} disabled={isPlotting}>
                <Play className="mr-2 h-5 w-5" /> Start Plotting
              </Button>
              <Button onClick={handlePause} disabled={!isPlotting}>
                <Pause className="mr-2 h-5 w-5" /> {isPlotting ? 'Pause' : 'Resume'}
              </Button>
              <Button onClick={capturePlot}>
                <Download className="mr-2 h-5 w-5" /> Capture Plot
              </Button>
              <Button onClick={handleExit} variant="outline">
                <StopCircle className="mr-2 h-5 w-5" /> Exit
              </Button>
            </div>

            {/* Scrollable Chart Container */}
            <div className="overflow-x-auto border p-4 bg-white" style={{ maxWidth: '100%' }}>
              <div ref={chartRef} style={{ width: `${plotData.length * 2}px`, minWidth: '100%' }} />
            </div>

            {capturedImage && (
              <div className="mt-4 border p-4">
                <h4 className="text-lg font-semibold">Captured Image</h4>
                <img src={capturedImage} alt="Captured plot" className="mt-2 max-w-full h-auto border" />
                <div className="mt-2 flex space-x-3">
                  <Button onClick={() => setCapturedImage(null)} variant="outline">
                    <Trash2 className="mr-2 h-5 w-5" /> Remove
                  </Button>
                  <a href={capturedImage} download="plot.png" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <Download className="mr-2 h-5 w-5" /> Download Image
                  </a>
                  <Button onClick={handleImageUpload} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Download className="mr-2 h-5 w-5" /> Upload Image
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}