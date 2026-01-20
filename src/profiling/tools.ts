import { performance, PerformanceObserver } from 'perf_hooks';
import v8 from 'v8';

export class ProfilingTools {
  static async runAll() {
    console.log('\n🔬 PROFILING TOOLS & TECHNIQUES');
    console.log('='.repeat(50));
    
    this.performanceObserverDemo();
    this.v8ProfilerDemo();
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
    
    // Mark and measure
    performance.mark('start');
    
    // Simulate work
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
  
  static cpuProfilingDemo() {
    console.log('\n⚙️ CPU Profiling Instructions:');
    
    console.log('To profile CPU usage:');
    console.log('  1. node --cpu-prof your-script.js');
    console.log('  2. Creates a .cpuprofile file');
    console.log('  3. Open in Chrome DevTools → Performance tab');
    
    console.log('\nTo profile heap allocation:');
    console.log('  1. node --heap-prof your-script.js');
    console.log('  2. Creates a .heapprofile file');
    console.log('  3. Analyze with clinic.js or Chrome DevTools');
    
    console.log('\nTo trace garbage collection:');
    console.log('  1. node --trace-gc your-script.js');
    console.log('  2. Shows GC events in console');
  }
}

// Run if called directly
if (require.main === module) {
  ProfilingTools.runAll().catch(console.error);
}
