// This class handles all Health Sync Journal operations
export class HealthSyncJournal {
    constructor(initialData = null) {
        this.data = initialData || {
            metadata: {
                version: "1.0",
                created: new Date().toISOString(),
                lastModified: new Date().toISOString()
            },
            profile: {
                id: crypto.randomUUID(),
                // Profile data will be added here
            },
            entries: {
                diagnostics: [],
                symptoms: [],
                measurements: [],
                notes: []
            }
        }
    }

    // Add a diagnostic session to the HSJ
    addDiagnosticSession(session) {
        this.data.entries.diagnostics.push({
            timestamp: new Date().toISOString(),
            symptoms: session.symptoms,
            analysis: session.analysis
        })
        this._updateLastModified()
    }

    // Export the HSJ as a downloadable file
    export() {
        const blob = new Blob([JSON.stringify(this.data, null, 2)], {
            type: 'application/json'
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `hsj-${new Date().toISOString()}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    // Load an HSJ from a file
    static async fromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result)
                    resolve(new HealthSyncJournal(data))
                } catch (error) {
                    reject(error)
                }
            }
            reader.readAsText(file)
        })
    }

    _updateLastModified() {
        this.data.metadata.lastModified = new Date().toISOString()
    }
}