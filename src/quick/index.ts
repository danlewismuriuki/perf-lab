import { LoopBenchmark } from './loop-benchmark';
import { AsyncBenchmark } from './async-loops';
import { DataStructureBenchmark } from './data-structures';
import { StringBenchmark } from './string-operations';
import { FunctionCallBenchmark } from './function-calls';

async function runAllBenchmarks() {
  console.log('🚀 PERFORMANCE LAB - COMPREHENSIVE BENCHMARK SUITE');
  console.log('='.repeat(60));
  console.log(`Node.js ${process.version} on ${process.platform}`);
  console.log('='.repeat(60));
  
  try {
    // Run benchmarks
    LoopBenchmark.run(1_000_000);
    
    await AsyncBenchmark.run(10_000);
    
    DataStructureBenchmark.run(100_000);
    
    StringBenchmark.run(100_000);
    
    FunctionCallBenchmark.run(1_000_000);
    
    console.log('\n✅ All benchmarks completed!');
  } catch (error) {
    console.error('❌ Error running benchmarks:', error);
  }
}

// Run if called directly
if (require.main === module) {
  runAllBenchmarks();
}

export { runAllBenchmarks };