import { medicalGraph, graphUtils } from './medicalGraph.js';
import { HealthSyncJournal } from './models/HSJ.js';

// State Management
const state = {
  currentCategory: null,
  selectedSymptom: null,
  diagnosticStack: [],
  drawerOpen: false,
  isAnalyzing: false,
  hsj: new HealthSyncJournal()
};

// DOM Elements
const elements = {
  categoryNav: document.querySelector('.category-nav'),
  symptomArea: document.querySelector('.symptom-area'),
  symptomList: document.querySelector('.symptom-list'),
  refinementOptions: document.querySelector('.refinement-options'),
  stackDrawer: document.querySelector('.stack-drawer'),
  drawerTrigger: document.querySelector('.drawer-trigger'),
  stackList: document.querySelector('.stack-list'),
  analyzeButton: document.querySelector('.analyze-button'),
  analysisModal: document.querySelector('.analysis-modal'),
  backButton: document.querySelector('.back-button'),
  categoryTitle: document.querySelector('.category-title')
};

// Initialize Application
function initializeApp() {
  renderCategories();
  setupEventListeners();
  setupIntersectionObserver();
  setupTouchHandlers();
}

// Render Categories in Central Scroll
function renderCategories() {
  const categories = graphUtils.getCategories();
  elements.categoryNav.innerHTML = categories.map(category => `
    <div class="category-item" data-category="${category.id}">
      <div class="category-icon">
        <i data-lucide="${category.icon}"></i>
      </div>
      <span class="category-name">${category.name}</span>
      <p class="category-description">${category.description}</p>
    </div>
  `).join('');
  
  lucide.createIcons();
}

// Handle Category Selection
function handleCategorySelect(categoryId) {
  state.currentCategory = categoryId;
  const category = graphUtils.getCategories().find(c => c.id === categoryId);
  
  elements.categoryTitle.textContent = category.name;
  elements.symptomArea.classList.add('visible');
  
  renderSymptoms(categoryId);
}

// Render Symptoms for Category
function renderSymptoms(categoryId) {
  const symptoms = graphUtils.getBaseSymptoms(categoryId);
  
  elements.symptomList.innerHTML = symptoms.map(symptom => `
    <div class="symptom-item" data-symptom="${symptom.baseSymptom}">
      <h3>${symptom.name}</h3>
      <i data-lucide="chevron-right"></i>
    </div>
  `).join('');
  
  lucide.createIcons();
}

// Handle Symptom Selection
function handleSymptomSelect(baseSymptom) {
  state.selectedSymptom = baseSymptom;
  showRefinements(baseSymptom);
}

// Show Refinement Options
function showRefinements(baseSymptom) {
  const refinements = graphUtils.getRefinements(state.currentCategory, baseSymptom);
  
  elements.refinementOptions.innerHTML = `
    <h3>Select Type</h3>
    <div class="refinement-grid">
      ${refinements.map(ref => `
        <button class="refinement-button" 
          data-id="${ref.id}" 
          data-severity="${ref.severity}">
          <span>${ref.name}</span>
          <small>${ref.details.join(' • ')}</small>
        </button>
      `).join('')}
    </div>
  `;
  
  elements.refinementOptions.classList.add('visible');
}

// Add to Diagnostic Stack
function addToStack(symptomData) {
  if (!state.diagnosticStack.some(item => item.id === symptomData.id)) {
    state.diagnosticStack.push(symptomData);
    updateStackDisplay();
    openDrawer();
  }
}

// Update Stack Display
function updateStackDisplay() {
  elements.stackList.innerHTML = state.diagnosticStack.map(item => `
    <div class="stack-item" data-severity="${item.severity}">
      <span>${item.name}</span>
      <div class="stack-item-actions">
        <button class="remove-btn" data-id="${item.id}">
          <i data-lucide="x"></i>
        </button>
      </div>
    </div>
  `).join('');
  
  lucide.createIcons();
  updateAnalyzeButton();
}

// Update Analyze Button State
function updateAnalyzeButton() {
  elements.analyzeButton.disabled = state.diagnosticStack.length === 0;
}

// Analyze Symptoms
async function analyzeSymptoms() {
  if (state.isAnalyzing || state.diagnosticStack.length === 0) return;
  
  state.isAnalyzing = true;
  elements.analyzeButton.classList.add('loading');
  
  // Simulate processing time for UX
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const results = graphUtils.calculateLikelihood(state.diagnosticStack);
  
  // Add to HSJ
  state.hsj.addDiagnosticSession({
    symptoms: state.diagnosticStack,
    analysis: results
  });
  
  displayResults(results);
  
  state.isAnalyzing = false;
  elements.analyzeButton.classList.remove('loading');
}

// Display Analysis Results
function displayResults(results) {
  elements.analysisModal.querySelector('.results-container').innerHTML = 
    results.map(result => `
      <div class="result-item" data-severity="${result.severity}">
        <div class="result-header">
          <h3>${result.condition}</h3>
          <span class="result-category">${result.category}</span>
        </div>
        <div class="likelihood-bar">
          <div class="bar-fill" style="width: ${result.score}%"></div>
          <span>${result.score.toFixed(1)}% match</span>
        </div>
        <div class="result-details">
          <p>Matched Symptoms: ${result.matchedSymptoms}/${result.totalSymptoms}</p>
          <p>Matched Connections: ${result.matchedConnections}/${result.totalConnections}</p>
        </div>
      </div>
    `).join('');
  
  elements.analysisModal.classList.add('visible');
}

// Drawer Controls
function toggleDrawer() {
  state.drawerOpen = !state.drawerOpen;
  elements.stackDrawer.classList.toggle('open', state.drawerOpen);
}

function openDrawer() {
  state.drawerOpen = true;
  elements.stackDrawer.classList.add('open');
}

// Setup Touch Handlers
function setupTouchHandlers() {
  let startX;
  
  elements.symptomArea.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });
  
  elements.symptomArea.addEventListener('touchmove', e => {
    if (!startX) return;
    
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    
    if (diff > 50) { // Swipe left
      openDrawer();
    } else if (diff < -50) { // Swipe right
      elements.symptomArea.classList.remove('visible');
      elements.refinementOptions.classList.remove('visible');
    }
    
    startX = null;
  });
}

// Setup Intersection Observer for Category Scroll
function setupIntersectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.5 });
  
  document.querySelectorAll('.category-item').forEach(item => {
    observer.observe(item);
  });
}

// Event Listeners
function setupEventListeners() {
  // Category Selection
  elements.categoryNav.addEventListener('click', e => {
    const categoryItem = e.target.closest('.category-item');
    if (categoryItem) {
      handleCategorySelect(categoryItem.dataset.category);
    }
  });
  
  // Symptom Selection
  elements.symptomList.addEventListener('click', e => {
    const symptomItem = e.target.closest('.symptom-item');
    if (symptomItem) {
      handleSymptomSelect(symptomItem.dataset.symptom);
    }
  });
  
  // Refinement Selection
  elements.refinementOptions.addEventListener('click', e => {
    const refinementBtn = e.target.closest('.refinement-button');
    if (refinementBtn) {
      const symptomData = {
        id: refinementBtn.dataset.id,
        name: refinementBtn.querySelector('span').textContent,
        severity: refinementBtn.dataset.severity
      };
      addToStack(symptomData);
      elements.refinementOptions.classList.remove('visible');
    }
  });
  
  // Back Button
  elements.backButton.addEventListener('click', () => {
    elements.symptomArea.classList.remove('visible');
    elements.refinementOptions.classList.remove('visible');
  });
  
  // Drawer Toggle
  elements.drawerTrigger.addEventListener('click', toggleDrawer);
  
  // Remove from Stack
  elements.stackList.addEventListener('click', e => {
    const removeBtn = e.target.closest('.remove-btn');
    if (removeBtn) {
      const id = removeBtn.dataset.id;
      state.diagnosticStack = state.diagnosticStack.filter(item => item.id !== id);
      updateStackDisplay();
    }
  });
  
  // Analyze Button
  elements.analyzeButton.addEventListener('click', analyzeSymptoms);
  
  // Modal Close
  elements.analysisModal.addEventListener('click', e => {
    if (e.target === elements.analysisModal) {
      elements.analysisModal.classList.remove('visible');
    }
  });
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', initializeApp);