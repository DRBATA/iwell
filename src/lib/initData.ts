import { generateHash } from './utils';

// Generate a 6-digit PIN from postcode and DOB by randomly recombining available digits
export const generatePin = (postcode: string, dob: string) => {
  // Extract all digits from postcode and DOB
  const postcodeDigits = postcode.replace(/\D/g, '');
  const dobDigits = dob.replace(/\D/g, '');
  
  // Combine all available digits
  const allDigits = postcodeDigits + dobDigits;
  
  // Randomly select 6 digits
  let pin = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * allDigits.length);
    pin += allDigits[randomIndex];
  }
  
  return pin;
};

// Generate a file ID from PIN
export const generateFileId = (pin: string) => {
  return transformPinToFilename(pin);
};

// Transform PIN into filename through one-way transformation
export const transformPinToFilename = (pin: string) => {
  // Use factors of PIN digits to create filename
  const factors = pin.split('').map(Number).map(n => 
    Array.from({ length: n }, (_, i) => i + 1).filter(i => n % i === 0)
  );
  const factorHash = factors.flat().join('');
  return `hsj_${generateHash(factorHash)}`;
};

// Verify if a PIN could have generated a filename through factor check
export const verifyPinForFile = (pin: string, filename: string) => {
  const expectedFilename = transformPinToFilename(pin);
  return filename === expectedFilename;
};

// Calculate age at creation
const calculateAge = (dob: string) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Initialize HSJ data structure (no personal info stored)
export const initializeData = (data: { postcode: string; dob: string; }) => {
  // Calculate age at creation (only store age, not DOB)
  const ageAtCreation = calculateAge(data.dob);

  // Create initial HSJ structure
  const initialData = {
    created: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    ageAtCreation,
    bloodPressure: {
      monitoring: "No",
      readings: [],
      trackingNeeds: {
        dailyMetrics: []
      }
    },
    conditions: [],
    cognitive: {
      enabled: true,  // Enable cognitive journal by default
      thoughts: [],   // Initialize empty thoughts array
      trackingNeeds: {
        dailyMetrics: []
      }
    },
    labResults: {
      results: []
    },
    notifications: {
      settings: {
        medicationReminders: true,
        appointmentAlerts: true,
        bpCheckReminders: true,
        cognitivePrompts: true
      },
      queue: []
    }
  };

  // Generate PIN to show user (but never store it)
  const pin = generatePin(data.postcode, data.dob);

  // Return PIN to show user, but don't store it
  return { 
    pin,
    data: initialData
  };
};
