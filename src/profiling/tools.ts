import { performance, PerformanceObserver } from 'perf_hooks';
import v8 from 'v8';
import fs from 'fs';
import { Readable } from 'stream';

export class ProfilingTools {
  static async runAll() {
    console.log('\n🔬 PROFILING TOOLS & TECHNIQUES');
    console.log('='.repeat(50));
    
    this.performanceObserverDemo();
    this.v8ProfilerDemo();
    await this.memorySnapshotDemo();
    this.cpuProfilingDemo();
  }
  
  static performanceObserverDemo() {
    console.log('\n👀 Performance Observer API:');
    
    const obs = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        console.log(`  ${entry.name}: ${entry.duration.toFixed(2)}ms`);
      }
    });
    
    obs.observe({ entryTypes: ['measure'] });
    
    performance.mark('start');
    
    let sum = 0;
    for (let i = 0; i < 1000000; i++) sum += i;
    
    performance.mark('end');
    performance.measure('Calculation', 'start', 'end');
    
    obs.disconnect();
  }
  
  static v8ProfilerDemo() {
    console.log('\n📊 V8 Profiler Statistics:');
    
    const stats = v8.getHeapStatistics();
    console.log(`Heap Size Limit: ${(stats.heap_size_limit / 1024 / 1024 / 1024).toFixed(2)}GB`);
    console.log(`Used Heap Size: ${(stats.used_heap_size / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Total Available Size: ${(stats.total_available_size / 1024 / 1024).toFixed(2)}MB`);
    
    const spaceStats = v8.getHeapSpaceStatistics();
    console.log('\nHeap Space Breakdown:');
    for (const space of spaceStats) {
      console.log(`  ${space.space_name}: ${(space.space_size / 1024 / 1024).toFixed(2)}MB`);
    }
  }
  
  static async memorySnapshotDemo() {
    console.log('\n📸 Memory Snapshot Demo:');
    
    try {
      const snapshotStream = v8.getHeapSnapshot();
      
      console.log('Taking heap snapshot...');
      
      const chunks: Buffer[] = [];
      let totalSize = 0;
      
      for await (const chunk of snapshotStream) {
        chunks.push(chunk);
        totalSize += chunk.length;
      }
      
      console.log(`Snapshot size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
      
      const objects = [];
      for (let i = 0; i < 10000; i++) {
        objects.push({ id: i, data: new Array(100).fill('x') });
      }
      
      console.log(`Allocated ${objects.length} objects`);
      
      const snapshotStream2 = v8.getHeapSnapshot();
      const chunks2: Buffer[] = [];
      let totalSize2 = 0;
      
      for await (const chunk of snapshotStream2) {
        chunks2.push(chunk);
        totalSize2 += chunk.length;
      }
      
      console.log(`After allocations: ${(totalSize2 / 1024 / 1024).toFixed(2)}MB`);
      console.log(`Difference: ${((totalSize2 - totalSize) / 1024 / 1024).toFixed(2)}MB`);
      
      const timestamp = Date.now();
      const filename = `heap-snapshot-${timestamp}.heapsnapshot`;
      
      const snapshotBuffer = Buffer.concat(chunks2);
      fs.writeFileSync(filename, snapshotBuffer);
      
      console.log(`Snapshot saved to: ${filename}`);
      console.log(`Analyze with: chrome://inspect → Memory → Load`);
      
      objects.length = 0;
      
      setTimeout(() => {
        fs.unlinkSync(filename);
        console.log(`Cleaned up: ${filename}`);
      }, 3000);
      
    } catch (error) {
      console.error('Error taking heap snapshot:', error);
    }
  }
  
  static cpuProfilingDemo() {
    console.log('\n CPU Profiling Demo:');
    
    console.log('Start CPU profiling for 3 seconds...');
    
    console.log('To profile CPU:');
    console.log('  1. node --cpu-prof your-script.js');
    console.log('  2. Creates .cpuprofile file');
    console.log('  3. Open in Chrome DevTools → Performance');
    
    console.log('\nTo profile heap:');
    console.log('  1. node --heap-prof your-script.js');
    console.log('  2. Creates .heapprofile file');
    console.log('  3. Analyze with clinic.js or Chrome DevTools');
  }
}

if (require.main === module) {
  ProfilingTools.runAll().catch(console.error);
}