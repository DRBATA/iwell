// Template for vital sign ranges and monitoring thresholds
// Used by HSJInitializer to create user's personal JSON

export const VITAL_RANGES_TEMPLATE = {
  newborn: {
    heartRate: {
      green: { min: 120, max: 160, unit: "bpm" },
      amber: { min: 100, max: 180, unit: "bpm" },
      red: { min: 0, max: 100, unit: "bpm" }
    },
    respiratoryRate: {
      green: { min: 30, max: 60, unit: "breaths/min" },
      amber: { min: 20, max: 70, unit: "breaths/min" },
      red: { min: 0, max: 20, unit: "breaths/min" }
    },
    oxygenSaturation: {
      green: { min: 95, max: 100, unit: "%" },
      amber: { min: 92, max: 94, unit: "%" },
      red: { min: 0, max: 91, unit: "%" }
    }
  },
  infant: {
    heartRate: {
      green: { min: 80, max: 140, unit: "bpm" },
      amber: { min: 70, max: 150, unit: "bpm" },
      red: { min: 0, max: 70, unit: "bpm" }
    },
    respiratoryRate: {
      green: { min: 20, max: 40, unit: "breaths/min" },
      amber: { min: 15, max: 50, unit: "breaths/min" },
      red: { min: 0, max: 15, unit: "breaths/min" }
    },
    oxygenSaturation: {
      green: { min: 95, max: 100, unit: "%" },
      amber: { min: 92, max: 94, unit: "%" },
      red: { min: 0, max: 91, unit: "%" }
    }
  },
  child_1_5: {
    heartRate: {
      green: { min: 70, max: 120, unit: "bpm" },
      amber: { min: 60, max: 130, unit: "bpm" },
      red: { min: 0, max: 60, unit: "bpm" }
    },
    respiratoryRate: {
      green: { min: 18, max: 30, unit: "breaths/min" },
      amber: { min: 15, max: 40, unit: "breaths/min" },
      red: { min: 0, max: 15, unit: "breaths/min" }
    },
    oxygenSaturation: {
      green: { min: 95, max: 100, unit: "%" },
      amber: { min: 92, max: 94, unit: "%" },
      red: { min: 0, max: 91, unit: "%" }
    }
  },
  child_5_plus: {
    heartRate: {
      green: { min: 60, max: 100, unit: "bpm" },
      amber: { min: 50, max: 120, unit: "bpm" },
      red: { min: 0, max: 50, unit: "bpm" }
    },
    respiratoryRate: {
      green: { min: 12, max: 20, unit: "breaths/min" },
      amber: { min: 10, max: 30, unit: "breaths/min" },
      red: { min: 0, max: 10, unit: "breaths/min" }
    },
    oxygenSaturation: {
      green: { min: 95, max: 100, unit: "%" },
      amber: { min: 92, max: 94, unit: "%" },
      red: { min: 0, max: 91, unit: "%" }
    }
  },
  adult: {
    heartRate: {
      green: { min: 60, max: 100, unit: "bpm" },
      amber: { min: 50, max: 120, unit: "bpm" },
      red: { min: 0, max: 50, unit: "bpm" }
    },
    bloodPressure: {
      green: { min: 90, max: 140, unit: "mmHg" },
      amber: { min: 141, max: 160, unit: "mmHg" },
      red: { min: 161, max: 999, unit: "mmHg" }
    },
    respiratoryRate: {
      green: { min: 12, max: 20, unit: "breaths/min" },
      amber: { min: 21, max: 24, unit: "breaths/min" },
      red: { min: 25, max: 999, unit: "breaths/min" }
    },
    oxygenSaturation: {
      green: { min: 95, max: 100, unit: "%" },
      amber: { min: 92, max: 94, unit: "%" },
      red: { min: 0, max: 91, unit: "%" }
    },
    temperature: {
      green: { min: 36.1, max: 37.2, unit: "°C" },
      amber: { min: 37.3, max: 38.5, unit: "°C" },
      red: { min: 38.6, max: 999, unit: "°C" }
    }
  },
  elderly: {
    heartRate: {
      green: { min: 50, max: 90, unit: "bpm" },
      amber: { min: 40, max: 100, unit: "bpm" },
      red: { min: 0, max: 40, unit: "bpm" }
    },
    bloodPressure: {
      green: { min: 90, max: 150, unit: "mmHg" },
      amber: { min: 151, max: 170, unit: "mmHg" },
      red: { min: 171, max: 999, unit: "mmHg" }
    },
    respiratoryRate: {
      green: { min: 12, max: 24, unit: "breaths/min" },
      amber: { min: 25, max: 28, unit: "breaths/min" },
      red: { min: 29, max: 999, unit: "breaths/min" }
    },
    oxygenSaturation: {
      green: { min: 95, max: 100, unit: "%" },
      amber: { min: 92, max: 94, unit: "%" },
      red: { min: 0, max: 91, unit: "%" }
    },
    temperature: {
      green: { min: 36.0, max: 36.8, unit: "°C" },
      amber: { min: 36.9, max: 38.0, unit: "°C" },
      red: { min: 38.1, max: 999, unit: "°C" }
    }
  }
};

export const CLINICAL_FEATURES_TEMPLATE = {
  skinColor: {
    options: ["Normal pink", "Pale", "Mottled", "Cold extremities", "Cyanosis", "Grey"],
    warningLevels: {
      "Normal pink": "green",
      "Pale": "amber",
      "Mottled": "amber",
      "Cold extremities": "amber",
      "Cyanosis": "red",
      "Grey": "red"
    }
  },
  behavior: {
    options: ["Normal activity", "Lethargic", "Irritable", "Inconsolable", "Unresponsive"],
    warningLevels: {
      "Normal activity": "green",
      "Lethargic": "amber",
      "Irritable": "amber",
      "Inconsolable": "amber",
      "Unresponsive": "red"
    }
  },
  urineOutput: {
    options: ["Normal", "Reduced", "None >12hrs", "Dark"],
    warningLevels: {
      "Normal": "green",
      "Reduced": "amber",
      "None >12hrs": "red",
      "Dark": "red"
    }
  }
};

export const WARNING_ACTIONS_TEMPLATE = {
  green: {
    action: "Monitor at home",
    advice: [
      "Maintain hydration",
      "Rest",
      "Monitor for changes"
    ]
  },
  amber: {
    action: "Contact 111",
    advice: [
      "Seek medical advice",
      "Increase monitoring"
    ]
  },
  red: {
    action: "Call 999",
    advice: [
      "Immediate medical attention required"
    ]
  }
};
