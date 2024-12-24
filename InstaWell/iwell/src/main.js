// Import the medical graph that contains our symptom definitions
import { medicalGraph } from './medicalGraph.js';

// Keep track of symptoms user has selected with their refinements
let diagnosticStack = [];

// Global state for graph traversal depth
let graphTraversalDepth = 0;

// Global state object
const state = {
  isAnalyzing: false,
  analysisResults: null,
  isTouchDevice: 'ontouchstart' in window,
  isFlaskTilted: false
};

// DOM Elements
const elements = {
  symptomList: document.getElementById('symptomList'),
  stackList: document.getElementById('stackList'),
  analyzeBtn: document.getElementById('analyzeBtn'),
  analysisResults: document.getElementById('analysisResults'),
  createHSJBtn: document.getElementById('createHSJ'),
  loadHSJInput: document.getElementById('hsjFile'),
  loadingScreen: document.getElementById('loadingScreen'),
  analyzeLiquid: document.getElementById('analyzeLiquid'),
  loadingLiquid: document.getElementById('loadingLiquid'),
  landingFlask: document.getElementById('landingFlask'),
  statusMessages: document.getElementById('status-messages'),
  errorDialog: document.getElementById('errorDialog'),
  errorMessage: document.getElementById('error-message')
};

// Initialize the application
function initializeApp() {
  setupEventListeners();
  populateSymptomList();
  startBubbling(elements.analyzeLiquid);
  simulateGraphTraversal();
}

// Set up event listeners
function setupEventListeners() {
  elements.analyzeBtn.addEventListener('click', analyzeSymptoms);
  elements.createHSJBtn.addEventListener('click', handleCreateHSJ);
  elements.loadHSJInput.addEventListener('change', handleLoadHSJ);
  elements.symptomList.addEventListener('click', handleSymptomClick);
  
  if (state.isTouchDevice) {
    const flasks = document.querySelectorAll('.flask');
    flasks.forEach(flask => {
      flask.addEventListener('touchstart', handleTouchStart);
      flask.addEventListener('touchend', handleTouchEnd);
    });
  }
}

// Populate the symptom list
function populateSymptomList() {
  const baseSymptoms = new Set();
  
  for (const condition in medicalGraph) {
    medicalGraph[condition].nodes.forEach(node => {
      baseSymptoms.add(node.baseSymptom);
    });
  }
  
  baseSymptoms.forEach(symptom => {
    const symptomItem = document.createElement('div');
    symptomItem.className = 'symptom-item';
    symptomItem.textContent = capitalizeFirstLetter(symptom);
    symptomItem.setAttribute('role', 'option');
    symptomItem.setAttribute('aria-selected', 'false');
    elements.symptomList.appendChild(symptomItem);
  });
}

// Handle symptom click
function handleSymptomClick(event) {
  if (event.target.classList.contains('symptom-item')) {
    const symptom = event.target.textContent.toLowerCase();
    addToStack(symptom);
  }
}

// Add symptom to diagnostic stack
function addToStack(baseSymptom) {
  const refinements = new Set();
  
  Object.values(medicalGraph).forEach(condition => {
    condition.nodes
      .filter(node => node.baseSymptom === baseSymptom)
      .forEach(node => refinements.add({
        id: node.id,
        name: node.name,
        refinement: node.refinement
      }));
  });
  
  showRefinementOptions(baseSymptom, Array.from(refinements));
}

// Show refinement options for a symptom
function showRefinementOptions(baseSymptom, refinements) {
  const optionsDiv = document.createElement('div');
  optionsDiv.className = 'refinement-options';
  optionsDiv.setAttribute('role', 'dialog');
  optionsDiv.setAttribute('aria-label', `Specify type of ${baseSymptom}`);
  
  optionsDiv.innerHTML = `
    <div class="refinement-prompt">
      <p>Specify type of ${baseSymptom}:</p>
      <div class="options">
        ${refinements.map(ref => `
          <button 
            class="refinement-btn"
            data-node-id="${ref.id}"
          >
            ${ref.name}
          </button>
        `).join('')}
      </div>
    </div>
  `;
  
  optionsDiv.querySelectorAll('.refinement-btn').forEach(btn => {
    btn.onclick = () => {
      const nodeId = btn.dataset.nodeId;
      const matchingNode = findNodeById(nodeId);
      
      if (!diagnosticStack.some(s => s.id === nodeId)) {
        diagnosticStack.push(matchingNode);
        updateStackDisplay();
        optionsDiv.remove();
        announceToScreenReader(`Added ${matchingNode.name} to diagnostic stack`);
      }
    };
  });
  
  elements.stackList.appendChild(optionsDiv);
}

// Find a node by its ID
function findNodeById(nodeId) {
  for (const condition in medicalGraph) {
    const node = medicalGraph[condition].nodes.find(n => n.id === nodeId);
    if (node) return node;
  }
  return null;
}

// Update the display of the diagnostic stack
function updateStackDisplay() {
  elements.stackList.innerHTML = '';
  diagnosticStack.forEach(symptom => {
    const stackItem = document.createElement('div');
    stackItem.className = 'stack-item';
    stackItem.setAttribute('role', 'listitem');
    stackItem.innerHTML = `
      ${symptom.name}
      <button class="remove-btn" onclick="removeFromStack('${symptom.id}')" aria-label="Remove ${symptom.name}">Remove</button>
    `;
    elements.stackList.appendChild(stackItem);
  });
}

// Remove a symptom from the stack
function removeFromStack(symptomId) {
  const removedSymptom = diagnosticStack.find(s => s.id === symptomId);
  diagnosticStack = diagnosticStack.filter(s => s.id !== symptomId);
  updateStackDisplay();
  announceToScreenReader(`Removed ${removedSymptom.name} from diagnostic stack`);
}

// Analyze symptoms
function analyzeSymptoms() {
  setAnalyzing(true);
  const results = {};
  const selectedSymptoms = diagnosticStack.map(s => s.id);
  
  setTimeout(() => {
    for (const [conditionName, condition] of Object.entries(medicalGraph)) {
      const matchedNodes = condition.nodes.filter(node => 
        selectedSymptoms.includes(node.id)
      );
      
      const matchedEdges = condition.edges.filter(edge => 
        selectedSymptoms.includes(edge.from) && 
        selectedSymptoms.includes(edge.to)
      );
  
      const likelihood = calculateLikelihood(
        matchedNodes.length,
        condition.nodes.length,
        matchedEdges.length,
        condition.edges.length
      );
  
      results[conditionName] = {
        matchedSymptoms: matchedNodes.length,
        totalSymptoms: condition.nodes.length,
        matchedConnections: matchedEdges.length,
        totalConnections: condition.edges.length,
        likelihood: likelihood
      };
    }
  
    displayResults(results);
    setAnalyzing(false);
  }, 2000);
}

// Calculate likelihood of a condition
function calculateLikelihood(matchedNodes, totalNodes, matchedEdges, totalEdges) {
  const nodeScore = (matchedNodes / totalNodes) * 100;
  const edgeScore = (matchedEdges / totalEdges) * 100;
  return (nodeScore * 0.4 + edgeScore * 0.6);
}

// Display analysis results
function displayResults(results) {
  elements.analysisResults.innerHTML = '';
  
  for (const [condition, result] of Object.entries(results)) {
    const resultItem = document.createElement('div');
    resultItem.className = 'condition-result';
    resultItem.innerHTML = `
      <h3>${condition}</h3>
      <div class="likelihood-meter" role="progressbar" aria-valuenow="${result.likelihood.toFixed(1)}" aria-valuemin="0" aria-valuemax="100">
        <div class="meter-fill" style="width: ${result.likelihood}%"></div>
        <span>${result.likelihood.toFixed(1)}% match</span>
      </div>
      <p>Matched Symptoms: ${result.matchedSymptoms}/${result.totalSymptoms}</p>
      <p>Matched Connections: ${result.matchedConnections}/${result.totalConnections}</p>
    `;
    elements.analysisResults.appendChild(resultItem);
  }
  
  announceToScreenReader('Analysis complete. Results are now displayed.');
}

// Handle creating a new Health Sync Journal
function handleCreateHSJ() {
  const hsj = {
    symptoms: diagnosticStack,
    analysis: state.analysisResults,
    timestamp: new Date().toISOString()
  };
  downloadHSJ(hsj);
}

// Handle loading a Health Sync Journal
function handleLoadHSJ(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const hsj = JSON.parse(e.target.result);
        loadHSJ(hsj);
      } catch (error) {
        showError('Invalid HSJ file. Please try again.');
      }
    };
    reader.readAsText(file);
  }
}

// Download Health Sync Journal
function downloadHSJ(hsj) {
  const blob = new Blob([JSON.stringify(hsj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `HSJ_${new Date().toISOString()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  announceToScreenReader('Health Sync Journal has been downloaded.');
}

// Load Health Sync Journal
function loadHSJ(hsj) {
  diagnosticStack = hsj.symptoms || [];
  state.analysisResults = hsj.analysis;
  updateStackDisplay();
  if (state.analysisResults) {
    displayResults(state.analysisResults);
  }
  announceToScreenReader('Health Sync Journal has been loaded.');
}

// Show error message
function showError(message) {
  elements.errorMessage.textContent = message;
  elements.errorDialog.classList.remove('hidden');
  announceToScreenReader('An error occurred: ' + message);
}

// Close error dialog
function closeErrorDialog() {
  elements.errorDialog.classList.add('hidden');
}

// Set analyzing state
function setAnalyzing(isAnalyzing) {
  state.isAnalyzing = isAnalyzing;
  elements.loadingScreen.classList.toggle('hidden', !isAnalyzing);
  elements.analyzeBtn.disabled = isAnalyzing;
  elements.loadingScreen.setAttribute('aria-hidden', !isAnalyzing);
}

// Create a bubble for animation
function createBubble(container, isLarge = false, isAnalyzing = false) {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  
  const size = isLarge ? Math.random() * 20 + 10 : Math.random() * 6 + 3;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  
  const leftPosition = state.isFlaskTilted ? 
    Math.random() * 60 + 20 : 
    Math.random() * 80 + 10;
  bubble.style.left = `${leftPosition}%`;
  
  const duration = isLarge ? Math.random() * 3 + 3 : Math.random() * 2 + 2;
  bubble.style.animationDuration = `${duration}s`;
  
  if (state.isFlaskTilted) {
    bubble.style.animationName = 'riseTilted';
  }
  
  if (isAnalyzing) {
    const glowIntensity = Math.min(graphTraversalDepth * 2, 10);
    bubble.style.boxShadow = `0 0 ${glowIntensity}px ${glowIntensity / 2}px rgba(255, 255, 255, 0.7)`;
  }
  
  container.appendChild(bubble);
  setTimeout(() => bubble.remove(), duration * 1000);
}

// Start bubbling animation
function startBubbling(container, isLarge = false, isAnalyzing = false) {
  return setInterval(() => createBubble(container, isLarge, isAnalyzing), 800);
}

// Handle touch start for flask tilt
function handleTouchStart(event) {
  if (!state.isTouchDevice) return;
  
  event.preventDefault();
  const flask = event.currentTarget;
  state.isFlaskTilted = true;
  flask.classList.add('tilted');
}

// Handle touch end for flask tilt
function handleTouchEnd(event) {
  if (!state.isTouchDevice) return;
  
  const flask = event.currentTarget;
  state.isFlaskTilted = false;
  flask.classList.remove('tilted');
}

// Simulate graph traversal
function simulateGraphTraversal() {
  const interval = setInterval(() => {
    graphTraversalDepth++;
    updateBubbleGlow();
    if (graphTraversalDepth >= 5) {
      clearInterval(interval);
    }
  }, 1000);
}

// Update bubble glow based on graph traversal depth
function updateBubbleGlow() {
  const bubbles = document.querySelectorAll('.bubble');
  bubbles.forEach(bubble => {
    const glowIntensity = Math.min(graphTraversalDepth * 2, 10);
    bubble.style.boxShadow = `0 0 ${glowIntensity}px ${glowIntensity / 2}px rgba(255, 255, 255, 0.7)`;
  });
}

// Announce message to screen reader
function announceToScreenReader(message) {
  elements.statusMessages.textContent = message;
}

// Capitalize first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Make removeFromStack and closeErrorDialog globally available
window.removeFromStack = removeFromStack;
window.closeErrorDialog = closeErrorDialog;

// Start the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);