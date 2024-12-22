import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Alert, AlertDescription } from "../ui/alert"
import { X, Upload, Plus, Copy } from 'lucide-react'
import { useHSJ } from '../../lib/manifest'
import { HSJManifest } from '../../lib/manifest/types'

interface HSJAccessModalProps {
  isOpen: boolean
  onClose: () => void
  onAccess: () => void
}

const HSJAccessModal: React.FC<HSJAccessModalProps> = ({ isOpen, onClose, onAccess }) => {
  const { createHSJ, verifyPin, importData, ejectData } = useHSJ();
  
  // State for create new
  const [postcode, setPostcode] = useState('')
  const [dob, setDob] = useState('')
  const [showCreate, setShowCreate] = useState(true)
  
  // State for load existing
  const [pin, setPin] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State for PIN and filename display
  const [showPinAlert, setShowPinAlert] = useState(false)
  const [generatedPin, setGeneratedPin] = useState('')
  const [generatedFilename, setGeneratedFilename] = useState('')
  const [pendingManifest, setPendingManifest] = useState<HSJManifest | null>(null)

  // Common input styles
  const inputClasses = "bg-white/90 text-gray-800 placeholder-gray-500 border-[#00CED1] focus:border-[#FFD700] focus:ring-[#FFD700] text-lg";

  const handleCreate = async () => {
    console.log('Starting handleCreate with:', { postcode, dob });
    
    if (!postcode || !dob) {
      console.log('Missing required fields');
      setError('Please enter your postcode and date of birth');
      return;
    }

    try {
      console.log('Creating new HSJ...');
      const { pin, manifest } = await createHSJ({ postcode, dob });
      console.log('HSJ created:', { pin, manifest });
      
      // Show PIN first
      setGeneratedPin(pin);
      setGeneratedFilename(manifest.hsj_id);
      setPendingManifest(manifest);
      setShowPinAlert(true);
      console.log('Set showPinAlert to true');
      
      // Reset form
      setPostcode('');
      setDob('');
      setError('');
    } catch (err) {
      console.error('Error in handleCreate:', err);
      setError('Failed to create health journal');
    }
  };

  const handlePinAcknowledged = async () => {
    console.log('PIN acknowledged, saving file');
    
    if (pendingManifest) {
      try {
        // Get export package
        const exportPackage = await ejectData();
        console.log('Got export package:', exportPackage);
        
        // Create file download
        const blob = new Blob([JSON.stringify(exportPackage)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${generatedFilename}.json`;
        a.click();
        URL.revokeObjectURL(url);
        console.log('File download triggered');
        
        // Close modal
        setShowPinAlert(false);
        onClose();
      } catch (err) {
        console.error('Error saving file:', err);
        setError('Failed to save journal file');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input change event:', e);
    const file = e.target.files?.[0];
    console.log('Selected file:', file);
    if (file) {
      console.log('Setting selected file:', file.name);
      setSelectedFile(file);
    }
  };

  const handleLoad = async () => {
    if (!pin || !selectedFile) {
      setError('Please enter your PIN and select your health journal file');
      return;
    }

    // Read the selected file
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        console.log('Loading journal file');
        const fileData = JSON.parse(e.target?.result as string);
        console.log('Parsed file data:', fileData);
        
        // Check file format
        if (!fileData.manifest || !fileData.healthData || !fileData.metadata) {
          console.error('Invalid file format');
          setError('Invalid journal file format');
          return;
        }
        
        // Verify PIN matches file
        console.log('Verifying PIN for HSJ:', fileData.manifest.hsj_id);
        const isValid = await verifyPin(pin, fileData.manifest.hsj_id);
        if (!isValid) {
          console.error('PIN verification failed');
          setError('Invalid PIN for this file');
          return;
        }

        // Import data (this already calls loadHSJ internally)
        console.log('Importing data...');
        await importData(fileData);
        console.log('Data imported successfully');
        
        setPin('');
        setSelectedFile(null);
        onAccess();
        onClose();
      } catch (err) {
        console.error('Error loading journal:', err);
        setError('Failed to load health journal');
      }
    };
    reader.onerror = () => {
      console.error('Error reading file');
      setError('Failed to read journal file');
    };
    reader.readAsText(selectedFile);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-4"
            >
              <Card className="bg-white/95 backdrop-blur relative">
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  aria-label="Close access modal"
                  title="Close access modal"
                >
                  <X size={20} />
                </button>
                
                <CardHeader className="space-y-1">
                  <div className="flex justify-center mb-6">
                    <motion.div
                      className="relative"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="w-20 h-20 rounded-full bg-[#00CED1] flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-[#FFD700] flex items-center justify-center">
                          <div className="text-white text-4xl font-bold">+</div>
                        </div>
                      </div>
                    </motion.div>
                    <div className="absolute mt-20 text-center">
                      <span className="text-[#00CED1] font-bold text-2xl">Easy</span>
                      <span className="text-[#FFD700] font-bold text-2xl">GP</span>
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl text-[#00CED1] flex items-center gap-2 justify-center mt-8">
                    {showCreate ? (
                      <>
                        <Plus className="h-6 w-6 text-[#FFD700]" />
                        Create New Journal
                      </>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-[#FFD700]" />
                        Load Existing Journal
                      </>
                    )}
                  </CardTitle>
                  
                  <CardDescription className="text-center text-gray-600">
                    {showCreate 
                      ? "Create a new health journal by entering your details"
                      : "Load your existing health journal with your PIN"
                    }
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Toggle Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="default"
                        onClick={() => {
                          setShowCreate(true);
                          setError('');
                        }}
                        className={`flex items-center justify-center gap-2 ${
                          showCreate 
                            ? 'bg-[#00CED1] hover:bg-[#00CED1]/90 text-white' 
                            : 'bg-white hover:bg-gray-50 text-[#00CED1] border-2 border-[#00CED1]'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        Create New
                      </Button>
                      <Button
                        variant="default"
                        onClick={() => {
                          setShowCreate(false);
                          setError('');
                        }}
                        className={`flex items-center justify-center gap-2 ${
                          !showCreate 
                            ? 'bg-[#00CED1] hover:bg-[#00CED1]/90 text-white'
                            : 'bg-white hover:bg-gray-50 text-[#00CED1] border-2 border-[#00CED1]'
                        }`}
                      >
                        <Upload className="w-4 h-4" />
                        Load Existing
                      </Button>
                    </div>

                    {showCreate ? (
                      // Create New Form
                      <div className="space-y-4">
                        <div>
                          <Input
                            placeholder="Postcode (e.g., SW1A 1AA)"
                            value={postcode}
                            onChange={(e) => setPostcode(e.target.value)}
                            className={inputClasses}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="_ _ / _ _ / _ _ _ _"
                            value={dob}
                            onChange={(e) => {
                              // Only allow numbers and slashes
                              const value = e.target.value.replace(/[^\d/]/g, '');
                              
                              // Auto-add slashes
                              let formatted = value;
                              if (value.length >= 2 && !value.includes('/')) {
                                formatted = value.slice(0, 2) + '/' + value.slice(2);
                              }
                              if (value.length >= 5 && formatted.split('/').length < 3) {
                                formatted = formatted.slice(0, 5) + '/' + formatted.slice(5);
                              }
                              
                              // Limit to DD/MM/YYYY format
                              if (formatted.length <= 10) setDob(formatted);
                            }}
                            onPaste={(e) => {
                              e.preventDefault();
                              const pastedText = e.clipboardData.getData('text');
                              const numbers = pastedText.replace(/[^\d]/g, '');
                              let formatted = numbers;
                              if (numbers.length >= 2) formatted = numbers.slice(0, 2) + '/' + numbers.slice(2);
                              if (numbers.length >= 4) formatted = formatted.slice(0, 5) + '/' + formatted.slice(5);
                              if (formatted.length <= 10) setDob(formatted);
                            }}
                            className={`${inputClasses} tracking-wider`}
                            maxLength={10}
                          />
                        </div>
                        <Button 
                          onClick={handleCreate}
                          className="w-full bg-[#00CED1] hover:bg-[#00CED1]/90 text-white"
                          disabled={!postcode || !dob}
                        >
                          Create Journal
                        </Button>
                        <p className="text-sm text-center text-gray-600">
                          Your postcode and date of birth are only used to generate your PIN.
                          This information is not stored.
                        </p>
                      </div>
                    ) : (
                      // Load Existing Form
                      <div className="space-y-4">
                        <div>
                          <Input
                            placeholder="Enter your PIN"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className={inputClasses}
                          />
                        </div>
                        <div className="space-y-2">
                          <Button 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full bg-white hover:bg-gray-50 border-2 border-dashed border-[#00CED1] text-[#00CED1]"
                          >
                            {selectedFile ? (
                              <span className="truncate">{selectedFile.name}</span>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Choose Journal File
                              </>
                            )}
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            className="hidden"
                            onChange={handleFileSelect}
                            aria-label="Choose health journal file"
                          />
                        </div>
                        <Button 
                          onClick={handleLoad}
                          className="w-full bg-[#00CED1] hover:bg-[#00CED1]/90 text-white"
                          disabled={!pin || !selectedFile}
                        >
                          Load Journal
                        </Button>
                      </div>
                    )}

                    {error && (
                      <Alert variant="destructive" className="bg-red-50">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PIN Alert Modal */}
      <AnimatePresence>
        {showPinAlert && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={(e) => e.stopPropagation()}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg p-6 max-w-sm mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-[#00CED1] mb-2">Save Your Access Details</h3>
              <p className="text-gray-600 mb-4">
                Your journal file will be saved. After clicking below:
                <br/><br/>
                1. Save your PIN and filename securely
                <br/>
                2. Click Get Started again
                <br/>
                3. Use these details to load your journal
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Your PIN</label>
                  <div className="bg-gray-100 p-3 rounded text-center flex items-center justify-between">
                    <span className="font-mono text-2xl text-[#FFD700]">{generatedPin}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(generatedPin)}
                      title="Copy PIN"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Your Filename</label>
                  <div className="bg-gray-100 p-3 rounded text-center flex items-center justify-between">
                    <span className="font-mono text-sm text-[#00CED1] truncate">{generatedFilename}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(generatedFilename)}
                      title="Copy filename"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                onClick={handlePinAcknowledged}
                className="w-full bg-[#00CED1] hover:bg-[#00CED1]/90 text-white mt-4"
              >
                Save File & Continue
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default HSJAccessModal;
