import { performance } from 'perf_hooks';
import os from 'os';

async function runAllBenchmarks() {
  console.log('🚀 PERFORMANCE LAB - COMPLETE BENCHMARK SUITE');
  console.log('='.repeat(60));
  console.log(`Node.js ${process.version} on ${process.platform} ${os.arch()}`);
  console.log(`CPU: ${os.cpus().length} cores, ${os.cpus()[0].model}`);
  console.log(`Memory: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(1)}GB total`);
  console.log('='.repeat(60));
  
  const startTime = performance.now();
  
  try {
 
    console.log('\n1️  QUICK BENCHMARKS (CPU/Micro-optimizations)');
    console.log('─'.repeat(50));
    const { runAllBenchmarks: runQuickBenchmarks } = await import('./quick/index.js');
    await runQuickBenchmarks();
    

    console.log('\n2️  I/O BENCHMARKS (Files, Streams, Compression)');
    console.log('─'.repeat(50));
    const { IOBenchmarks } = await import('./io/benchmarks.js');
    await IOBenchmarks.runAll();
    

    console.log('\n3️  MEMORY BENCHMARKS (Allocation, GC, Leaks)');
    console.log('─'.repeat(50));
    const { MemoryBenchmarks } = await import('./memory/benchmarks.js');
    MemoryBenchmarks.runAll();
    
    // 4. Profiling tools
    console.log('\n4️ PROFILING TOOLS (Heap, CPU, Performance API)');
    console.log('─'.repeat(50));
    const { ProfilingTools } = await import('./profiling/tools.js');
    await ProfilingTools.runAll();
    

    console.log('\n5️  ADVANCED BENCHMARK FRAMEWORK');
    console.log('─'.repeat(50));
    const { BenchmarkRunner } = await import('./benchmark/runner.js');
    
    const runner = new BenchmarkRunner({ warmupRuns: 2, measurementRuns: 3 });
    
    runner.on('progress', (data) => {
      console.log(`  ${data.name}: Run ${data.run}/${data.total} - ${data.time.toFixed(2)}ms`);
    });
    
    await runner.benchmark('Array.push 10k items', () => {
      const arr: number[] = [];
      for (let i = 0; i < 10000; i++) arr.push(i);
      return arr.length;
    });
    
    await runner.benchmark('String concatenation 1k chars', () => {
      let str = '';
      for (let i = 0; i < 1000; i++) str += 'x';
      return str.length;
    }, { iterations: 10 });
    
    await runner.benchmark('Object property access', () => {
      const obj: any = {};
      for (let i = 0; i < 5000; i++) obj[`key${i}`] = i;
      let sum = 0;
      for (let i = 0; i < 5000; i++) sum += obj[`key${i}`];
      return sum;
    });
    
    console.log('\n' + '='.repeat(60));
    runner.printReport();
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    runner.exportJSON(`results/benchmark-${timestamp}.json`);
    runner.exportCSV(`results/benchmark-${timestamp}.csv`);
    
    const totalTime = performance.now() - startTime;
    
    console.log('\n' + '='.repeat(60));
    console.log('ALL BENCHMARKS COMPLETED!');
    console.log(`Total time: ${(totalTime / 1000).toFixed(1)} seconds`);
    console.log('='.repeat(60));
    
    console.log('\n AVAILABLE COMMANDS:');
    console.log('  npm run benchmark          # Run all benchmarks');
    console.log('  npm run benchmark:quick    # Only CPU benchmarks');
    console.log('  npm run benchmark:io       # Only I/O benchmarks');
    console.log('  npm run benchmark:memory   # Only memory benchmarks');
    console.log('  npm run benchmark:profile  # Only profiling tools');
    console.log('  npm run benchmark:advanced # Only advanced runner');
    console.log('\n Results saved to: results/ folder');
    
  } catch (error) {
    console.error(' Error running benchmarks:', error);
    process.exit(1);
  }
}

import fs from 'fs';
if (!fs.existsSync('results')) {
  fs.mkdirSync('results');
}

if (require.main === module) {
  runAllBenchmarks().catch(console.error);
}

export { runAllBenchmarks };
