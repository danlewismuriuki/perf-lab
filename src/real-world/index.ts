import { createBlockingServer, createWorkerThreadServer } from './slow-server';
import { createMemoryLeakServer, createFixedCacheServer } from './memory-leak';
import { createDemoServer, runLoadTest, generateCpuProfile } from './load-test-demo';

export async function runRealWorldExamples() {
  console.log(' REAL-WORLD PERFORMANCE DEBUGGING EXAMPLES');
  console.log('='.repeat(60));
  
  console.log('\n Common Performance Problems:');
  console.log('1. Event Loop Blocking - CPU-heavy tasks on main thread');
  console.log('2. Memory Leaks - Objects accumulating, never freed');
  console.log('3. Inefficient Algorithms - Wrong data structures');
  console.log('4. I/O Bottlenecks - Serial instead of parallel');
  
  console.log('\n🔧 Debugging Tools:');
  console.log('• autocannon - Load testing');
  console.log('• node --cpu-prof - CPU profiling');
  console.log('• node --heap-prof - Heap profiling');
  console.log('• Chrome DevTools - Visual profiling');
  console.log('• clinic.js - Advanced diagnostics');
  
  console.log('\n📁 Examples Available:');
  console.log('• src/real-world/slow-server.ts - Event loop blocking');
  console.log('• src/real-world/memory-leak.ts - Memory leak patterns');
  console.log('• src/real-world/load-test-demo.ts - Load testing demo');
  
  console.log('\n💡 To run a specific example:');
  console.log('  npx tsc && node dist/real-world/slow-server.js');
  console.log('  npx tsc && node dist/real-world/memory-leak.js');
  console.log('  npx tsc && node dist/real-world/load-test-demo.js');
  
  console.log('\n🎯 Interview Stories You Can Tell:');
  console.log('1. "I debugged event loop blocking using --cpu-prof"');
  console.log('2. "I fixed a memory leak by adding cache eviction"');
  console.log('3. "I improved throughput 100x by adding caching"');
  console.log('4. "I used worker threads for CPU-intensive tasks"');
}

// Export everything
export {
  createBlockingServer,
  createWorkerThreadServer,
  createMemoryLeakServer,
  createFixedCacheServer,
  createDemoServer,
  runLoadTest,
  generateCpuProfile
};

if (require.main === module) {
  runRealWorldExamples().catch(console.error);
}