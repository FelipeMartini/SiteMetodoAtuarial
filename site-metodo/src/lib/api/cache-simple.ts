import { LRUCache } from 'lru-cache'

export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

export interface CacheStats {
  hits: number
  misses: number
  size: number
  maxSize: number
  sets: number
  deletes: number
}

/**
 * Sistema de cache simplificado para APIs
 */
export class SimpleApiCache {
  private cache: LRUCache<string, any>
  private stats: CacheStats

  constructor(maxSize: number = 1000) {
    this.cache = new LRUCache({
      max: maxSize,
      ttl: 1000 * 60 * 5, // 5 minutes default
    })

    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      maxSize,
      sets: 0,
      deletes: 0,
    }
  }

  get<T>(key: string): T | null {
    const value = this.cache.get(key)

    if (value !== undefined) {
      this.stats.hits++
      return value as T
    }

    this.stats.misses++
    return null
  }

  set<T>(key: string, value: T, ttl?: number): void {
    const options = ttl ? { ttl: ttl * 1000 } : {}
    this.cache.set(key, value, options)
    this.stats.sets++
    this.stats.size = this.cache.size
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key)
    if (deleted) {
      this.stats.deletes++
      this.stats.size = this.cache.size
    }
    return deleted
  }

  clear(): void {
    const sizeBefore = this.cache.size
    this.cache.clear()
    this.stats.size = 0
    console.log(`Cache cleared: ${sizeBefore} entries removed`)
  }

  has(key: string): boolean {
    return this.cache.has(key)
  }

  getStats(): CacheStats {
    return {
      ...this.stats,
      size: this.cache.size,
    }
  }

  invalidatePattern(pattern: RegExp): number {
    let invalidated = 0

    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key)
        invalidated++
      }
    }

    this.stats.size = this.cache.size
    console.log(`Cache pattern invalidation: ${invalidated} entries removed`)

    return invalidated
  }

  prune(): number {
    const sizeBefore = this.cache.size
    this.cache.purgeStale()
    const sizeAfter = this.cache.size
    const pruned = sizeBefore - sizeAfter

    this.stats.size = sizeAfter

    if (pruned > 0) {
      console.log(`Pruned expired entries: ${pruned} removed`)
    }

    return pruned
  }
}

// Instâncias de cache
export const apiCache = {
  normal: new SimpleApiCache(1000), // Cache normal
  fast: new SimpleApiCache(500), // Cache rápido (TTL menor)
  persistent: new SimpleApiCache(2000), // Cache persistente (TTL maior)
}
