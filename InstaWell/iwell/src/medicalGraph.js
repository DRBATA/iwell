// This represents our medical knowledge base
export const medicalGraph = {
    pneumonia: {
        nodes: [
            { id: "wheeze_diffuse", name: "Diffuse Wheeze", baseSymptom: "wheeze" },
            { id: "sob_at_rest", name: "Shortness of Breath at Rest", baseSymptom: "sob" },
            { id: "fever_high", name: "High Fever", baseSymptom: "fever" }
        ],
        edges: [
            { from: "wheeze_diffuse", to: "sob_at_rest" },
            { from: "sob_at_rest", to: "fever_high" }
        ],
        contradictions: ["wheeze_localised"] // Symptoms that rule out this condition
    },
    bronchitis: {
        nodes: [
            { id: "wheeze_localised", name: "Localised Wheeze", baseSymptom: "wheeze" },
            { id: "cough_productive", name: "Productive Cough", baseSymptom: "cough" },
            { id: "sob_exertion", name: "Shortness of Breath on Exertion", baseSymptom: "sob" }
        ],
        edges: [
            { from: "wheeze_localised", to: "cough_productive" },
            { from: "cough_productive", to: "sob_exertion" }
        ],
        contradictions: ["wheeze_diffuse"] // Cannot have diffuse wheeze with bronchitis
    }
};