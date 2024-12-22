export const medicalGraph = {
  "nodes": [
    {
      "id": "cold",
      "type": "condition",
      "name": "Cold",
      "description": "Sore throat with that cold? No worries. Congested with that cold? No worries. First Vicks First Defence stop that cold from turning into something worse."
    },
    {
      "id": "bronchitis",
      "type": "condition",
      "name": "Bronchitis",
      "description": "Mucus in the chest causing a cough, often resolves on its own with proper care. Granny used to call it a 'touch of rattle on the chest.' As long as you can cough it up, you are all good."
    },
    {
      "id": "expectoration",
      "type": "treatment",
      "name": "Expectoration",
      "description": "Clearing mucus from the chest by coughing. Key for managing bronchitis."
    },
    {
      "id": "beechams_all_in_one",
      "type": "treatment",
      "name": "Beechams All-in-One",
      "description": "An expectorant for clearing mucus and easing chest congestion. Look for something with an expectorant if you have a touch of rattle on the chest."
    },
    {
      "id": "strepsils",
      "type": "treatment",
      "name": "Strepsils Lozenges",
      "description": "Lozenges that soothe that sore throat from the cough."
    }
  ],
  "edges": [
    {
      "from": "cold",
      "to": "beechams_all_in_one",
      "relationship": "treated_by"
    },
    {
      "from": "bronchitis",
      "to": "expectoration",
      "relationship": "managed_by"
    },
    {
      "from": "bronchitis",
      "to": "beechams_all_in_one",
      "relationship": "treated_by"
    },
    {
      "from": "bronchitis",
      "to": "strepsils",
      "relationship": "relief_for"
    }
  ]
}
