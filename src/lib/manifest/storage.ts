import { HSJManifest, HSJHealthData, HSJExportPackage } from './types';

class HSJStorage {
  private static instance: HSJStorage;
  private db: IDBDatabase | null = null;
  private encryptionKey: CryptoKey | null = null;
  private readonly DB_NAME = 'HSJStorage';
  private readonly DB_VERSION = 1;

  private constructor() {}

  static getInstance(): HSJStorage {
    if (!HSJStorage.instance) {
      HSJStorage.instance = new HSJStorage();
    }
    return HSJStorage.instance;
  }

  async initialize(): Promise<void> {
    await this.initializeDB();
    await this.initializeEncryption();
  }

  private async initializeDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(new Error('Failed to open database'));

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create stores if they don't exist
        if (!db.objectStoreNames.contains('manifests')) {
          db.createObjectStore('manifests', { keyPath: 'hsj_id' });
        }
        if (!db.objectStoreNames.contains('healthData')) {
          db.createObjectStore('healthData', { keyPath: 'hsj_id' });
        }
      };
    });
  }

  private async initializeEncryption(): Promise<void> {
    // Generate or retrieve encryption key
    const keyMaterial = await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );

    this.encryptionKey = keyMaterial;
  }

  private async encrypt(data: any): Promise<{ encrypted: ArrayBuffer; iv: Uint8Array }> {
    if (!this.encryptionKey) {
      throw new Error('Encryption not initialized');
    }

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(data));

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      this.encryptionKey,
      encoded
    );

    return { encrypted, iv };
  }

  private async decrypt(encrypted: ArrayBuffer, iv: Uint8Array): Promise<any> {
    if (!this.encryptionKey) {
      throw new Error('Encryption not initialized');
    }

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      this.encryptionKey,
      encrypted
    );

    const decoded = new TextDecoder().decode(decrypted);
    return JSON.parse(decoded);
  }

  private async store(storeName: string, data: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onerror = () => reject(new Error('Failed to store data'));
      request.onsuccess = () => resolve();
    });
  }

  private async retrieve(storeName: string, key: string): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onerror = () => reject(new Error('Failed to retrieve data'));
      request.onsuccess = () => resolve(request.result);
    });
  }

  private async delete(storeName: string, key: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onerror = () => reject(new Error('Failed to delete data'));
      request.onsuccess = () => resolve();
    });
  }

  async storeManifest(manifest: HSJManifest): Promise<void> {
    // Store manifest unencrypted for performance
    await this.store('manifests', manifest);
  }

  async retrieveManifest(hsj_id: string): Promise<HSJManifest | null> {
    return this.retrieve('manifests', hsj_id);
  }

  async storeHealthData(hsj_id: string, data: HSJHealthData): Promise<void> {
    // Encrypt sensitive health data
    const { encrypted, iv } = await this.encrypt(data);
    
    const encryptedPackage = {
      hsj_id,
      data: encrypted,
      iv,
      timestamp: new Date().toISOString()
    };

    await this.store('healthData', encryptedPackage);
  }

  async retrieveHealthData(hsj_id: string): Promise<HSJHealthData | null> {
    const encryptedPackage = await this.retrieve('healthData', hsj_id);
    if (!encryptedPackage) return null;

    return this.decrypt(encryptedPackage.data, encryptedPackage.iv);
  }

  async exportData(hsj_id: string): Promise<HSJExportPackage> {
    const manifest = await this.retrieveManifest(hsj_id);
    const healthData = await this.retrieveHealthData(hsj_id);

    if (!manifest || !healthData) {
      throw new Error('Data not found');
    }

    const exportPackage: HSJExportPackage = {
      manifest,
      healthData,
      metadata: {
        exportedAt: new Date().toISOString(),
        version: manifest.version,
        checksum: await this.generateChecksum({ manifest, healthData })
      }
    };

    return exportPackage;
  }

  async importData(data: HSJExportPackage): Promise<void> {
    // Verify checksum
    const calculatedChecksum = await this.generateChecksum({
      manifest: data.manifest,
      healthData: data.healthData
    });

    if (calculatedChecksum !== data.metadata.checksum) {
      throw new Error('Data integrity check failed');
    }

    // Store both manifest and health data
    await this.storeManifest(data.manifest);
    await this.storeHealthData(data.manifest.hsj_id, data.healthData);
  }

  private async generateChecksum(data: any): Promise<string> {
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async clearData(hsj_id?: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    if (hsj_id) {
      // Clear specific HSJ data
      await Promise.all([
        this.delete('manifests', hsj_id),
        this.delete('healthData', hsj_id)
      ]);
    } else {
      // Clear all data
      const transaction = this.db.transaction(['manifests', 'healthData'], 'readwrite');
      transaction.objectStore('manifests').clear();
      transaction.objectStore('healthData').clear();
    }
  }
}

export const storage = HSJStorage.getInstance();
