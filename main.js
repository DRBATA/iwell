import { medicalGraph } from './data/medicalGraph.js'

const symptomCategories = [
  {
    id: 'respiratory',
    name: 'Respiratory',
    icon: '🫁',
    symptoms: [
      { id: 'cough', name: 'Cough', emoji: '😷', options: ['Dry', 'Wet', 'Persistent', 'Occasional'] },
      { id: 'shortness-of-breath', name: 'Shortness of Breath', emoji: '😮‍💨', options: ['At rest', 'On exertion', 'Lying down', 'After activity'] },
    ],
  },
  {
    id: 'throat',
    name: 'Throat & Mouth',
    icon: '👄',
    symptoms: [
      { id: 'sore-throat', name: 'Sore Throat', emoji: '😣', options: ['Mild', 'Severe', 'With swelling', 'With white patches'] },
      { id: 'hoarseness', name: 'Hoarseness', emoji: '🔇', options: ['Mild', 'Severe', 'Intermittent', 'Persistent'] },
    ],
  },
  {
    id: 'neurological',
    name: 'Neurological',
    icon: '🧠',
    symptoms: [
      { id: 'headache', name: 'Headache', emoji: '🤕', options: ['Mild', 'Severe', 'Throbbing', 'Pressure'] },
      { id: 'dizziness', name: 'Dizziness', emoji: '😵', options: ['Mild', 'Severe', 'With nausea', 'When standing'] },
    ],
  },
  {
    id: 'cardiovascular',
    name: 'Cardiovascular',
    icon: '❤️',
    symptoms: [
      { id: 'chest-pain', name: 'Chest Pain', emoji: '💔', options: ['Sharp', 'Dull', 'Squeezing', 'Radiating'] },
      { id: 'palpitations', name: 'Palpitations', emoji: '💓', options: ['Occasional', 'Frequent', 'At rest', 'With activity'] },
    ],
  }
]

// State
let selectedSymptoms = []
let symptomDetails = {}
let activeCategory = 'respiratory'
let isDrawerOpen = true

// Additional DOM Elements
const drawer = document.getElementById('drawer')
const drawerToggle = document.getElementById('drawerToggle')
const analyzeButton = document.getElementById('analyzeButton')
const symptomStack = document.getElementById('symptomStack')
const proToggle = document.getElementById('proToggle')
const sidebarIcons = document.querySelectorAll('.sidebar-icon')

// DOM Elements
const symptomGrid = document.getElementById('symptomGrid')
const results = document.getElementById('results')
const treatmentList = document.getElementById('treatmentList')

// Initialize UI
function initializeUI() {
  updateSymptomGrid()
  setupDragAndDrop()
  setupEventListeners()
  updateDrawerState()
}

function setupEventListeners() {
  // Drawer toggle
  drawerToggle.addEventListener('click', () => {
    isDrawerOpen = !isDrawerOpen
    updateDrawerState()
  })

  // Initialize category icons
  const categoryIcons = document.getElementById('categoryIcons')
  categoryIcons.innerHTML = symptomCategories.map((category, index) => `
    <button class="sidebar-icon ${index === 0 ? 'active' : ''}" data-category="${category.id}">
      <span class="emoji" role="img" aria-label="${category.name}">${category.icon}</span>
    </button>
  `).join('')

  // Category switching
  document.querySelectorAll('.sidebar-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-icon').forEach(i => i.classList.remove('active'))
      icon.classList.add('active')
      activeCategory = icon.dataset.category
      updateSymptomGrid()
    })
  })

  // Analyze button
  analyzeButton.addEventListener('click', () => {
    if (selectedSymptoms.length > 0) {
      updateResults()
    }
  })

  // Pro toggle
  proToggle.addEventListener('change', (e) => {
    const isPro = e.target.checked
    document.body.classList.toggle('pro-enabled', isPro)
  })
}

function updateDrawerState() {
  drawer.style.transform = isDrawerOpen ? 'translateX(0)' : 'translateX(400px)'
  drawerToggle.querySelector('.toggle-icon').style.transform = isDrawerOpen ? 'rotate(0deg)' : 'rotate(180deg)'
}

function updateSymptomGrid() {
  const category = symptomCategories.find(c => c.id === activeCategory)
  if (!category) return

  symptomGrid.innerHTML = `
    <h2 class="category-title">${category.name}</h2>
    <div class="symptom-cards">
      ${category.symptoms.map(symptom => `
        <div class="symptom-card" draggable="true" data-id="${symptom.id}">
          <div class="symptom-header">
            <span class="symptom-emoji">${symptom.emoji}</span>
            <h3>${symptom.name}</h3>
          </div>
          <select class="symptom-select" data-id="${symptom.id}">
            <option value="">Select type</option>
            ${symptom.options.map(option => `
              <option value="${option}">${option}</option>
            `).join('')}
          </select>
          <p class="drag-hint">Drag me to add to your analysis stack!</p>
        </div>
      `).join('')}
    </div>
  `

  // Add event listeners to new elements
  document.querySelectorAll('.symptom-card').forEach(card => {
    card.addEventListener('dragstart', handleDragStart)
    card.addEventListener('click', () => {
      const symptomId = card.dataset.id
      if (!selectedSymptoms.includes(symptomId)) {
        addSymptom(symptomId)
      }
    })
  })

  document.querySelectorAll('.symptom-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const symptomId = select.dataset.id
      updateSymptomDetails(symptomId, { option: e.target.value })
    })
  })
}

function setupDragAndDrop() {
  const dropZone = document.getElementById('dropZone')
  
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault()
    dropZone.classList.add('drag-over')
  })
  
  dropZone.addEventListener('dragleave', (e) => {
    dropZone.classList.remove('drag-over')
  })
  
  dropZone.addEventListener('drop', handleDrop)

  // Add visual feedback when dragging starts
  document.addEventListener('dragstart', () => {
    dropZone.style.transform = 'scale(1.02)'
    dropZone.style.borderWidth = '3px'
  })

  document.addEventListener('dragend', () => {
    dropZone.style.transform = ''
    dropZone.style.borderWidth = ''
    dropZone.classList.remove('drag-over')
  })
}

function handleDragStart(e) {
  e.dataTransfer.setData('text/plain', e.currentTarget.dataset.id)
  e.currentTarget.classList.add('dragging')
  
  // Set drag image
  const dragImage = e.currentTarget.cloneNode(true)
  dragImage.style.transform = 'rotate(-5deg)'
  dragImage.style.position = 'absolute'
  dragImage.style.left = '-9999px'
  document.body.appendChild(dragImage)
  e.dataTransfer.setDragImage(dragImage, 0, 0)
  setTimeout(() => document.body.removeChild(dragImage), 0)
}

function handleDrop(e) {
  e.preventDefault()
  const symptomId = e.dataTransfer.getData('text/plain')
  const dropZone = document.getElementById('dropZone')
  
  // Add symptom with animation
  addSymptom(symptomId)
  
  // Reset drop zone
  dropZone.classList.remove('drag-over')
  dropZone.style.transform = ''
  dropZone.style.borderWidth = ''
  
  // Find and reset the dragged card
  document.querySelectorAll('.symptom-card').forEach(card => {
    if (card.dataset.id === symptomId) {
      card.classList.remove('dragging')
    }
  })
}

function addSymptom(symptomId) {
  if (!selectedSymptoms.includes(symptomId)) {
    selectedSymptoms.push(symptomId)
    symptomDetails[symptomId] = { option: '' }
    updateSymptomStack()
    analyzeButton.disabled = false
  }
}

function updateSymptomStack() {
  const stackHtml = selectedSymptoms.map(symptomId => {
    const symptom = symptomCategories
      .flatMap(c => c.symptoms)
      .find(s => s.id === symptomId)
    
    if (!symptom) return ''
    
    return `
      <div class="stack-item">
        <div class="stack-header">
          <span class="symptom-emoji">${symptom.emoji}</span>
          <span class="symptom-name">${symptom.name}</span>
          <button class="remove-symptom" onclick="handleRemoveSymptom('${symptomId}')">×</button>
        </div>
        <div class="stack-details">
          <select class="type-select" onchange="updateSymptomOption('${symptomId}', this.value)">
            <option value="">Select type</option>
            ${symptom.options.map(option => `
              <option value="${option}" ${symptomDetails[symptomId].option === option ? 'selected' : ''}>
                ${option}
              </option>
            `).join('')}
          </select>
        </div>
      </div>
    `
  }).join('')

  symptomStack.innerHTML = stackHtml || '<p class="empty-stack">No symptoms added yet</p>'
}

function updateSymptomDetails(symptomId, details) {
  symptomDetails[symptomId] = { ...symptomDetails[symptomId], ...details }
  updateResults()
}

function updateResults() {
  if (selectedSymptoms.length === 0) {
    results.classList.add('hidden')
    return
  }

  results.classList.remove('hidden')
  
  // Find treatments considering symptom types
  const treatments = selectedSymptoms.flatMap(symptomId => {
    const symptomType = symptomDetails[symptomId].option
    const edges = medicalGraph.edges.filter(edge => edge.from === symptomId)
    
    return edges.map(edge => {
      const treatment = medicalGraph.nodes.find(node => node.id === edge.to)
      const severity = symptomType?.toLowerCase().includes('severe') ? 'urgent' : 'standard'
      
      return {
        ...treatment,
        relationship: edge.relationship,
        severity,
        type: symptomType
      }
    })
  })

  // Sort treatments by severity
  const sortedTreatments = treatments.sort((a, b) => 
    a.severity === 'urgent' ? -1 : b.severity === 'urgent' ? 1 : 0
  )

  // Update treatment list with severity indicators
  treatmentList.innerHTML = sortedTreatments.map(treatment => `
    <div class="treatment ${treatment.severity}">
      <div class="treatment-header">
        <h4>${treatment.name}</h4>
        ${treatment.severity === 'urgent' ? '<span class="urgent-tag">Urgent</span>' : ''}
      </div>
      <p>${treatment.description}</p>
      <div class="treatment-meta">
        <small class="relationship">${formatRelationship(treatment.relationship)}</small>
        ${treatment.type ? `<small class="type">For: ${treatment.type}</small>` : ''}
      </div>
    </div>
  `).join('')

  results.scrollIntoView({ behavior: 'smooth' })
}

function formatRelationship(relationship) {
  return relationship.replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Add these functions to handle symptom updates
window.handleRemoveSymptom = function(symptomId) {
  selectedSymptoms = selectedSymptoms.filter(id => id !== symptomId)
  delete symptomDetails[symptomId]
  updateSymptomStack()
  analyzeButton.disabled = selectedSymptoms.length === 0
}

window.updateSymptomIntensity = function(symptomId, value) {
  symptomDetails[symptomId] = {
    ...symptomDetails[symptomId],
    intensity: parseInt(value)
  }
  updateSymptomStack()
}

window.updateSymptomOption = function(symptomId, value) {
  symptomDetails[symptomId] = {
    ...symptomDetails[symptomId],
    option: value
  }
  updateSymptomStack()
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  initializeUI()
  // Disable analyze button initially
  analyzeButton.disabled = true
})
