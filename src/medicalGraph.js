export const medicalGraph = {
  "Respiratory": {
    category: {
      id: "respiratory",
      name: "Respiratory",
      icon: "lungs",
      colorToken: "var(--color-severity-medium)",
      description: "Breathing and lung-related symptoms"
    },
    conditions: {
      "Bronchitis": {
        nodes: [
          {
            id: "cough2",
            name: "Productive Cough",
            baseSymptom: "cough",
            refinement: "productive",
            severity: "medium",
            details: ["With phlegm", "Worse in morning", "Improves through day"]
          },
          {
            id: "chest_pain1",
            name: "Chest Pain on Coughing",
            baseSymptom: "chest_pain",
            refinement: "pleuritic",
            severity: "low",
            details: ["Worse with cough", "Sharp", "Localizable"]
          }
        ],
        edges: [
          { from: "cough2", to: "chest_pain1", relationship: "causal" }
        ]
      },
      "Pneumonia": {
        nodes: [
          {
            id: "fever2",
            name: "High Fever",
            baseSymptom: "fever",
            refinement: "high",
            severity: "high",
            details: ["Above 38.5°C", "With chills", "Poor response to antipyretics"]
          },
          {
            id: "sputum1",
            name: "Green Sputum",
            baseSymptom: "sputum",
            refinement: "purulent",
            severity: "high",
            details: ["Green/yellow color", "Thick consistency", "Occasional blood streaks"]
          },
          {
            id: "breath2",
            name: "Breathing Difficulty",
            baseSymptom: "breath",
            refinement: "rest_and_exertion",
            severity: "high",
            details: ["At rest", "Worse with activity", "Reduced O2 saturation"]
          }
        ],
        edges: [
          { from: "fever2", to: "sputum1", relationship: "concurrent" },
          { from: "sputum1", to: "breath2", relationship: "progressive" }
        ]
      },
      "Pulmonary Embolism": {
        nodes: [
          {
            id: "breath3",
            name: "Sudden Breathlessness",
            baseSymptom: "breath",
            refinement: "acute",
            severity: "high",
            details: ["Sudden onset", "Severe", "With anxiety"]
          },
          {
            id: "chest_pain2",
            name: "Sharp Chest Pain",
            baseSymptom: "chest_pain",
            refinement: "pleuritic",
            severity: "high",
            details: ["Sharp", "Worse with breathing", "With hemoptysis"]
          },
          {
            id: "tachycardia1",
            name: "Fast Heart Rate",
            baseSymptom: "heart_rate",
            refinement: "tachycardia",
            severity: "high",
            details: [">100 bpm", "At rest", "With hypoxia"]
          }
        ],
        edges: [
          { from: "breath3", to: "chest_pain2", relationship: "concurrent" },
          { from: "breath3", to: "tachycardia1", relationship: "compensatory" }
        ]
      }
    }
  },
  "Cardiac": {
    category: {
      id: "cardiac",
      name: "Cardiac",
      icon: "heart",
      colorToken: "var(--color-severity-high)",
      description: "Heart and circulation symptoms"
    },
    conditions: {
      "Stable Angina": {
        nodes: [
          {
            id: "chest_pain3",
            name: "Exertional Chest Pain",
            baseSymptom: "chest_pain",
            refinement: "exertional",
            severity: "medium",
            details: ["With activity", "Relieved by rest", "Predictable pattern"]
          }
        ],
        edges: []
      },
      "Unstable Angina": {
        nodes: [
          {
            id: "chest_pain4",
            name: "Rest Chest Pain",
            baseSymptom: "chest_pain",
            refinement: "rest",
            severity: "high",
            details: ["At rest", "Increasing frequency", "Changing pattern"]
          },
          {
            id: "sweating1",
            name: "Cold Sweats",
            baseSymptom: "sweating",
            refinement: "diaphoresis",
            severity: "high",
            details: ["Cold", "Clammy", "With nausea"]
          }
        ],
        edges: [
          { from: "chest_pain4", to: "sweating1", relationship: "concurrent" }
        ]
      }
    }
  },
  "Gastrointestinal": {
    category: {
      id: "gastro",
      name: "Gastrointestinal",
      icon: "stomach",
      colorToken: "var(--color-severity-medium)",
      description: "Digestive system symptoms"
    },
    conditions: {
      "Acid Reflux": {
        nodes: [
          {
            id: "chest_pain5",
            name: "Burning Chest Pain",
            baseSymptom: "chest_pain",
            refinement: "burning",
            severity: "low",
            details: ["After meals", "Worse when lying", "Retrosternal"]
          },
          {
            id: "regurgitation1",
            name: "Acid Regurgitation",
            baseSymptom: "regurgitation",
            refinement: "acid",
            severity: "low",
            details: ["Sour taste", "With heartburn", "Food-related"]
          }
        ],
        edges: [
          { from: "chest_pain5", to: "regurgitation1", relationship: "concurrent" }
        ]
      }
    }
  }
};

export const graphUtils = {
  getCategories() {
    return Object.entries(medicalGraph).map(([_, data]) => data.category);
  },

  getBaseSymptoms(categoryId) {
    const category = Object.values(medicalGraph).find(c => c.category.id === categoryId);
    if (!category) return [];
    
    const symptoms = new Set();
    Object.values(category.conditions).forEach(condition => {
      condition.nodes.forEach(node => {
        symptoms.add({
          baseSymptom: node.baseSymptom,
          name: this.formatSymptomName(node.baseSymptom)
        });
      });
    });
    return Array.from(symptoms);
  },

  getRefinements(categoryId, baseSymptom) {
    const category = Object.values(medicalGraph).find(c => c.category.id === categoryId);
    if (!category) return [];
    
    const refinements = new Set();
    Object.values(category.conditions).forEach(condition => {
      condition.nodes
        .filter(node => node.baseSymptom === baseSymptom)
        .forEach(node => refinements.add({
          id: node.id,
          refinement: node.refinement,
          name: node.name,
          severity: node.severity,
          details: node.details
        }));
    });
    return Array.from(refinements);
  },

  formatSymptomName(name) {
    return name.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  calculateLikelihood(symptoms) {
    const results = [];
    
    Object.entries(medicalGraph).forEach(([categoryName, category]) => {
      Object.entries(category.conditions).forEach(([conditionName, condition]) => {
        const matchedNodes = condition.nodes.filter(node => 
          symptoms.some(s => s.id === node.id)
        );
        
        const matchedEdges = condition.edges.filter(edge =>
          symptoms.some(s => s.id === edge.from) && 
          symptoms.some(s => s.id === edge.to)
        );
        
        const nodeScore = matchedNodes.length / condition.nodes.length;
        const edgeScore = condition.edges.length ? 
          matchedEdges.length / condition.edges.length : 1;
        
        const totalScore = (nodeScore * 0.7 + edgeScore * 0.3) * 100;
        
        if (totalScore > 0) {
          results.push({
            category: categoryName,
            condition: conditionName,
            score: totalScore,
            matchedSymptoms: matchedNodes.length,
            totalSymptoms: condition.nodes.length,
            matchedConnections: matchedEdges.length,
            totalConnections: condition.edges.length,
            severity: Math.max(...matchedNodes.map(n => 
              n.severity === 'high' ? 3 : n.severity === 'medium' ? 2 : 1
            ))
          });
        }
      });
    });
    
    return results.sort((a, b) => b.score - a.score);
  }
};