// Import the medical graph that contains our symptom definitions
import { medicalGraph } from './medicalGraph.js';

// Keep track of symptoms user has selected with their refinements
let diagnosticStack = [];

// This function sets up our application when it first loads
function initializeApp() {
    // Get references to the important elements in our HTML
    const symptomList = document.getElementById('symptomList');
    const stackList = document.getElementById('stackList');
    const analyzeBtn = document.getElementById('analyzeBtn');

    // Create a Set to store unique base symptoms from our graph
    const baseSymptoms = new Set();
    
    // Go through each condition in our medical graph
    for (const condition in medicalGraph) {
        // For each node in the condition, add its base symptom to our set
        medicalGraph[condition].nodes.forEach(node => {
            baseSymptoms.add(node.baseSymptom);
        });
    }

    // Create buttons for each base symptom
    baseSymptoms.forEach(symptom => {
        const symptomItem = document.createElement('div');
        symptomItem.className = 'symptom-item';
        // Make the symptom name look nice with capital first letter
        symptomItem.textContent = capitalizeFirstLetter(symptom);
        // When clicked, show refinement options for this symptom
        symptomItem.onclick = () => addToStack(symptom);
        symptomList.appendChild(symptomItem);
    });

    // Set up the analyze button to run our analysis when clicked
    analyzeBtn.onclick = analyzeSymptoms;
}

// When a user clicks a base symptom, show them the refinement options
function addToStack(baseSymptom) {
    // Find all possible refinements for this base symptom
    const refinements = new Set();
    
    // Look through all conditions to find relevant refinements
    Object.values(medicalGraph).forEach(condition => {
        condition.nodes
            .filter(node => node.baseSymptom === baseSymptom)
            .forEach(node => refinements.add({
                id: node.id,
                name: node.name,
                refinement: node.refinement
            }));
    });
    
    // Show the refinement options to the user
    showRefinementOptions(baseSymptom, Array.from(refinements));
}

// Display the refinement options for a symptom
function showRefinementOptions(baseSymptom, refinements) {
    const stackList = document.getElementById('stackList');
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'refinement-options';
    
    // Create the HTML for our refinement options
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
    
    // Add click handlers to our refinement buttons
    optionsDiv.querySelectorAll('.refinement-btn').forEach(btn => {
        btn.onclick = () => {
            const nodeId = btn.dataset.nodeId;
            const matchingNode = findNodeById(nodeId);
            
            // Add to stack if not already there
            if (!diagnosticStack.some(s => s.id === nodeId)) {
                diagnosticStack.push(matchingNode);
                updateStackDisplay();
                optionsDiv.remove();
            }
        };
    });
    
    stackList.appendChild(optionsDiv);
}

// Helper function to find a node by its ID
function findNodeById(nodeId) {
    for (const condition in medicalGraph) {
        const node = medicalGraph[condition].nodes.find(n => n.id === nodeId);
        if (node) return node;
    }
    return null;
}

// Update the display of selected symptoms
function updateStackDisplay() {
    const stackList = document.getElementById('stackList');
    stackList.innerHTML = '';
    diagnosticStack.forEach(symptom => {
        const stackItem = document.createElement('div');
        stackItem.className = 'stack-item';
        stackItem.innerHTML = `
            ${symptom.name}
            <button class="remove-btn" onclick="removeFromStack('${symptom.id}')">Remove</button>
        `;
        stackList.appendChild(stackItem);
    });
}

// Remove a symptom from the stack
function removeFromStack(symptomId) {
    diagnosticStack = diagnosticStack.filter(s => s.id !== symptomId);
    updateStackDisplay();
}

// Analyze the selected symptoms to determine likely conditions
function analyzeSymptoms() {
    const results = {};
    const selectedSymptoms = diagnosticStack.map(s => s.id);

    // Check each condition
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
}

// Calculate how likely a condition is based on matched symptoms and connections
function calculateLikelihood(matchedNodes, totalNodes, matchedEdges, totalEdges) {
    const nodeScore = (matchedNodes / totalNodes) * 100;
    const edgeScore = (matchedEdges / totalEdges) * 100;
    return (nodeScore * 0.4 + edgeScore * 0.6);
}

// Display the analysis results
function displayResults(results) {
    const analysisResults = document.getElementById('analysisResults');
    analysisResults.innerHTML = '';

    for (const [condition, result] of Object.entries(results)) {
        const resultItem = document.createElement('div');
        resultItem.className = 'condition-result';
        resultItem.innerHTML = `
            <h3>${condition}</h3>
            <div class="likelihood-meter">
                <div class="meter-fill" style="width: ${result.likelihood}%"></div>
                <span>${result.likelihood.toFixed(1)}% match</span>
            </div>
            <p>Matched Symptoms: ${result.matchedSymptoms}/${result.totalSymptoms}</p>
            <p>Matched Connections: ${result.matchedConnections}/${result.totalConnections}</p>
        `;
        analysisResults.appendChild(resultItem);
    }
}

// Helper function to capitalize first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Make removeFromStack available globally for the onclick handlers
window.removeFromStack = removeFromStack;

// Start the app when the page loads
document.addEventListener('DOMContentLoaded', initializeApp);