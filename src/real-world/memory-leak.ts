import { createServer } from 'http';

class LeakyCache {
  private cache: Map<string, any> = new Map();
  private maxSize = 1000;
  
  set(key: string, value: any) {
    this.cache.set(key, value);
  }
  
  get(key: string) {
    return this.cache.get(key);
  }
  
  get size() {
    return this.cache.size;
  }
}

class FixedCache {
  private cache: Map<string, any> = new Map();
  private maxSize: number;
  
  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }
  
  set(key: string, value: any) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }
  
  get(key: string) {
    const value = this.cache.get(key);
    if (value) {
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }
  
  get size() {
    return this.cache.size;
  }
}

function createMemoryLeakServer(port: number = 3002) {
  const leakyCache = new LeakyCache();
  let requestCount = 0;
  
  const server = createServer((req, res) => {
    requestCount++;
    
    if (req.url === '/leak') {
      const largeObject = {
        id: requestCount,
        data: Buffer.alloc(1024 * 10, 'x'),
        timestamp: Date.now(),
        nested: { a: 1, b: 2, c: { d: 3, e: 4 } }
      };
      
      leakyCache.set(`item-${requestCount}`, largeObject);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'added',
        cacheSize: leakyCache.size,
        memory: process.memoryUsage(),
        requestCount
      }));
    } else if (req.url === '/memory') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        cacheSize: leakyCache.size,
        memory: process.memoryUsage(),
        requestCount
      }));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });
  
  return server;
}

function createFixedCacheServer(port: number = 3003) {
  const fixedCache = new FixedCache(1000);
  let requestCount = 0;
  
  const server = createServer((req, res) => {
    requestCount++;
    
    if (req.url === '/cache') {
      const largeObject = {
        id: requestCount,
        data: Buffer.alloc(1024 * 10, 'x'),
        timestamp: Date.now()
      };
      
      fixedCache.set(`item-${requestCount}`, largeObject);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'added',
        cacheSize: fixedCache.size,
        memory: process.memoryUsage(),
        requestCount
      }));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });
  
  return server;
}

class BetterLRUCache {
  private cache: Map<string, any>;
  private maxSize: number;
  
  constructor(maxSize: number = 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }
  
  set(key: string, value: any): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(key, value);
  }
  
  get(key: string): any {
    if (!this.cache.has(key)) {
      return undefined;
    }
    
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  
  has(key: string): boolean {
    return this.cache.has(key);
  }
  
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  get size(): number {
    return this.cache.size;
  }
  
  get stats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      usage: ((this.cache.size / this.maxSize) * 100).toFixed(1) + '%'
    };
  }
}

function demonstrateMemoryLeak() {
  console.log('🧪 Demonstrating Memory Leak Pattern');
  console.log('='.repeat(50));
  
  const leakyCache = new LeakyCache();
  const fixedCache = new FixedCache(100);
  const betterCache = new BetterLRUCache(100);
  
  console.log('\n1. Leaky Cache (no eviction):');
  for (let i = 0; i < 150; i++) {
    leakyCache.set(`item-${i}`, Buffer.alloc(1024, 'x'));
  }
  console.log(`   Size: ${leakyCache.size} (should be 150, keeps growing)`);
  
  console.log('\n2. Fixed Cache (LRU eviction):');
  for (let i = 0; i < 150; i++) {
    fixedCache.set(`item-${i}`, Buffer.alloc(1024, 'x'));
  }
  console.log(`   Size: ${fixedCache.size} (max 100, old items evicted)`);
  
  console.log('\n3. Better LRU Cache:');
  for (let i = 0; i < 150; i++) {
    betterCache.set(`item-${i}`, Buffer.alloc(1024, 'x'));
  }
  console.log(`   Stats:`, betterCache.stats);
  
  console.log('\n Key Insight:');
  console.log('Leaky cache grows indefinitely → memory leak');
  console.log('Fixed cache evicts old entries → stable memory');
}

if (require.main === module) {
  const leakServer = createMemoryLeakServer(3002);
  const fixedServer = createFixedCacheServer(3003);
  
  leakServer.listen(3002, () => {
    console.log(' MEMORY LEAK Server: http://localhost:3002');
    console.log('  /leak    - Add items to leaky cache');
    console.log('  /memory  - Check memory usage');
  });
  
  fixedServer.listen(3003, () => {
    console.log(' FIXED CACHE Server: http://localhost:3003');
    console.log('  /cache   - Add items to fixed cache (LRU eviction)');
  });
  
  console.log('\n Test memory leak:');
  console.log('  for i in {1..100}; do curl http://localhost:3002/leak; done');
  console.log('  curl http://localhost:3002/memory');
  console.log('\n Test fixed cache:');
  console.log('  for i in {1..2000}; do curl http://localhost:3003/cache; done');
  
  console.log('\n Run demonstration:');
  console.log('  node -e "const { demonstrateMemoryLeak } = require(\'./dist/real-world/memory-leak.js\'); demonstrateMemoryLeak();"');
}

export { 
  LeakyCache, 
  FixedCache, 
  BetterLRUCache, 
  createMemoryLeakServer, 
  createFixedCacheServer, 
  demonstrateMemoryLeak
};