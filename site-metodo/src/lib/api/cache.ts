'use client'

import { LRUCache } from 'lru-cache'
import { simpleLogger } from '../simple-logger'

export interface CacheOptions {
  ttl?: number // Time to live in seconds
  max?: number // Maximum number of items
  stale?: boolean // Allow stale data while revalidating
  updateAgeOnGet?: boolean // Update age on get
}

export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  hits: number
  lastAccessed: number
}

export interface CacheStats {
  hits: number
  misses: number
  sets: number
  deletes: number
  size: number
  maxSize: number
  hitRate: number
  memoryUsage: number
}

/**
 * Advanced caching system for API responses
 * Features: TTL, LRU eviction, stale-while-revalidate, compression
 */
export class ApiCache {
  private cache: LRUCache<string, CacheEntry<any>>
  private logger: typeof simpleLogger
  private stats: Omit<CacheStats, 'hitRate' | 'memoryUsage' | 'size' | 'maxSize'>
  private defaultTtl: number
  private compressionEnabled: boolean

  constructor(options: CacheOptions = {}) {
    const {
      ttl = 300, // 5 minutes default
      max = 1000, // 1000 items max
      stale = true,
      updateAgeOnGet = true,
    } = options

    this.defaultTtl = ttl
    this.compressionEnabled = typeof window !== 'undefined' && 'CompressionStream' in window

    this.cache = new LRUCache({
      max,
      ttl: ttl * 1000, // LRU cache expects milliseconds
      allowStale: stale,
      updateAgeOnGet,
      dispose: (value, key) => {
        simpleLogger.debug('Cache entry disposed', {
          key,
          reason: 'evicted',
        })
      },
    })

    this.logger = simpleLogger
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
    }

    this.logger.info('API Cache initialized', {
      maxSize: max,
      defaultTtl: ttl,
      compressionEnabled: this.compressionEnabled,
    })
  }

  /**
   * Get item from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined

    if (!entry) {
      this.stats.misses++
      this.logger.debug(`Cache miss for key: ${key}`)
      return null
    }

    // Check if entry is expired (additional check beyond LRU cache TTL)
    const now = Date.now()
    if (entry.timestamp + entry.ttl * 1000 < now) {
      this.cache.delete(key)
      this.stats.misses++
      this.logger.debug(`Cache entry expired for key: ${key}, age: ${now - entry.timestamp}ms`)
      return null
    }

    // Update hit statistics
    entry.hits++
    entry.lastAccessed = now
    this.stats.hits++

    return entry.data
  }

  /**
   * Set item in cache
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const effectiveTtl = ttl || this.defaultTtl
    const now = Date.now()

    const entry: CacheEntry<T> = {
      data: value,
      timestamp: now,
      lastAccessed: now,
      hits: 0,
      ttl: effectiveTtl,
    }

    this.cache.set(key, entry)
    this.stats.sets++
    this.logger.debug(`Cache set for key: ${key}`)
  }

  /**
   * Invalidate entries matching pattern
   */
  invalidatePattern(pattern: string | RegExp): number {
    let invalidated = 0
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
        invalidated++
      }
    }

    this.logger.info(
      `Cache pattern invalidation: ${pattern.toString()}, invalidated: ${invalidated}`
    )

    return invalidated
  }

  /**
   * Get cache entry age in seconds
   */
  getAge(key: string): number | null {
    const entry = this.cache.get(key) as CacheEntry<any> | undefined
    if (!entry) return null

    return Math.floor((Date.now() - entry.timestamp) / 1000)
  }

  /**
   * Check if entry is stale but still in cache
   */
  isStale(key: string): boolean {
    const entry = this.cache.get(key) as CacheEntry<any> | undefined
    if (!entry) return false

    const now = Date.now()
    return entry.timestamp + entry.ttl * 1000 < now
  }

  /**
   * Get stale entry (if stale-while-revalidate is enabled)
   */
  getStale<T>(key: string): T | null {
    const entry = this.cache.get(key, { allowStale: true }) as CacheEntry<T> | undefined
    return entry ? entry.data : null
  }

  /**
   * Prune expired entries manually
   */
  prune(): number {
    const sizeBefore = this.cache.size
    this.cache.purgeStale()
    const pruned = sizeBefore - this.cache.size

    if (pruned > 0) {
      this.logger.info(`Pruned expired entries: ${pruned}`)
    }

    return pruned
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear()
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const size = this.cache.size
    const maxSize = this.cache.maxSize || 0
    const hits = this.stats.hits
    const misses = this.stats.misses
    const hitRate = hits + misses > 0 ? hits / (hits + misses) : 0
    const memoryUsage = this.estimateMemoryUsage()

    return {
      hits,
      misses,
      sets: this.stats.sets,
      deletes: this.stats.deletes,
      hitRate,
      size,
      maxSize,
      memoryUsage,
    }
  }

  /**
   * Estimate memory usage of cache
   */
  private estimateMemoryUsage(): number {
    let totalSize = 0

    for (const [key, entry] of this.cache.entries()) {
      totalSize += key.length * 2 // UTF-16 characters
      totalSize += this.estimateSize(entry)
    }

    return totalSize
  }

  /**
   * Estimate size of data in bytes
   */
  private estimateSize(data: Record<string, unknown>): number {
    try {
      return JSON.stringify(data).length * 2 // UTF-16 approximation
    } catch {
      return 0
    }
  }

  /**
   * Create cache key from URL and options
   */
  static createKey(url: string, options?: Record<string, any>): string {
    const base = url.replace(/^https?:\/\/[^\/]+/, '') // Remove domain

    if (!options || Object.keys(options).length === 0) {
      return base
    }

    // Sort options for consistent keys
    const sortedOptions = Object.keys(options)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = options[key]
          return acc
        },
        {} as Record<string, any>
      )

    const optionsStr = JSON.stringify(sortedOptions)
    return `${base}?${Buffer.from(optionsStr).toString('base64')}`
  }

  /**
   * Create cache instance with common patterns
   */
  static create(type: 'fast' | 'normal' | 'persistent' = 'normal'): ApiCache {
    const configs = {
      fast: { ttl: 60, max: 500 }, // 1 minute, small cache
      normal: { ttl: 300, max: 1000 }, // 5 minutes, medium cache
      persistent: { ttl: 3600, max: 2000 }, // 1 hour, large cache
    }

    return new ApiCache(configs[type])
  }
}

// Global cache instances
export const apiCache = {
  fast: ApiCache.create('fast'),
  normal: ApiCache.create('normal'),
  persistent: ApiCache.create('persistent'),
}

// Cache decorator for API methods
export function cached(ttl?: number, cacheInstance: ApiCache = apiCache.normal) {
  return function (
    target: Record<string, unknown>,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: Record<string, unknown>[]) {
      const cacheKey = ApiCache.createKey(`${target.constructor.name}.${propertyKey}`, args)

      // Try to get from cache first
      const cached = cacheInstance.get(cacheKey)
      if (cached !== null) {
        return cached
      }

      // Call original method
      const result = await originalMethod.apply(this, args)

      // Cache the result
      cacheInstance.set(cacheKey, result, ttl)

      return result
    }

    return descriptor
  }
}

export default ApiCache
