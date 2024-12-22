import { CacheConfig, CacheEntry, HSJManifest, HSJHealthData } from './types';

class HSJMemoryCache {
  private static instance: HSJMemoryCache;
  private cache: Map<string, CacheEntry<any>>;
  private config: CacheConfig;

  private constructor() {
    this.cache = new Map();
    this.config = {
      maxSize: 1000,
      retention: '1d',
      cleanupInterval: 1000 * 60 * 60 // 1 hour
    };

    // Start cleanup interval
    setInterval(() => this.cleanup(), this.config.cleanupInterval);
  }

  static getInstance(): HSJMemoryCache {
    if (!HSJMemoryCache.instance) {
      HSJMemoryCache.instance = new HSJMemoryCache();
    }
    return HSJMemoryCache.instance;
  }

  private getRetentionTime(): number {
    const unit = this.config.retention.slice(-1);
    const value = parseInt(this.config.retention.slice(0, -1));
    
    switch (unit) {
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      case 'w': return value * 7 * 24 * 60 * 60 * 1000;
      default: return 24 * 60 * 60 * 1000; // Default 1 day
    }
  }

  private cleanup(): void {
    const now = Date.now();
    const retentionTime = this.getRetentionTime();
    const keysToDelete: string[] = [];

    // Use forEach instead of for...of
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > retentionTime) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  private enforceMaxSize(): void {
    if (this.cache.size <= this.config.maxSize) return;

    // Convert to array, sort, and remove oldest entries
    const entries = Array.from(this.cache, ([key, value]) => ({
      key,
      accessed: value.accessed
    }));

    entries.sort((a, b) => a.accessed - b.accessed);

    while (this.cache.size > this.config.maxSize && entries.length > 0) {
      const oldest = entries.shift();
      if (oldest) {
        this.cache.delete(oldest.key);
      }
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Update access time
    entry.accessed = Date.now();
    this.cache.set(key, entry);

    return entry.data as T;
  }

  async set<T>(key: string, data: T): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      accessed: Date.now()
    };

    this.cache.set(key, entry);
    this.enforceMaxSize();
  }

  async getManifest(hsj_id: string): Promise<HSJManifest | null> {
    return this.get<HSJManifest>(`manifest:${hsj_id}`);
  }

  async setManifest(hsj_id: string, manifest: HSJManifest): Promise<void> {
    await this.set(`manifest:${hsj_id}`, manifest);
  }

  async getHealthData(hsj_id: string): Promise<HSJHealthData | null> {
    return this.get<HSJHealthData>(`health:${hsj_id}`);
  }

  async setHealthData(hsj_id: string, data: HSJHealthData): Promise<void> {
    await this.set(`health:${hsj_id}`, data);
  }

  clear(hsj_id?: string): void {
    if (hsj_id) {
      // Clear specific HSJ data
      this.cache.delete(`manifest:${hsj_id}`);
      this.cache.delete(`health:${hsj_id}`);
    } else {
      // Clear all cache
      this.cache.clear();
    }
  }

  updateConfig(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getStats(): {
    size: number;
    maxSize: number;
    retention: string;
    oldestEntry: number;
    newestEntry: number;
  } {
    let oldestEntry = Date.now();
    let newestEntry = 0;

    this.cache.forEach(entry => {
      oldestEntry = Math.min(oldestEntry, entry.timestamp);
      newestEntry = Math.max(newestEntry, entry.timestamp);
    });

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      retention: this.config.retention,
      oldestEntry,
      newestEntry
    };
  }
}

export const memoryCache = HSJMemoryCache.getInstance();
