import { performance } from 'perf_hooks';
import os from 'os';

async function runAllBenchmarks() {
  console.log('🚀 PERFORMANCE LAB - COMPLETE SUITE');
  console.log('='.repeat(60));
  console.log(`Node.js ${process.version} on ${process.platform} ${os.arch()}`);
  console.log(`CPU: ${os.cpus().length} cores, ${os.cpus()[0].model}`);
  console.log(`Memory: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(1)}GB total`);
  console.log('='.repeat(60));
  
  try {
    const args = process.argv.slice(2);
    
    if (args.includes('--real-world') || args.includes('--debug')) {
      console.log('\n🎯 RUNNING REAL-WORLD DEBUGGING EXAMPLES');
      console.log('─'.repeat(50));
      const { runRealWorldExamples } = await import('./real-world/index.js');
      await runRealWorldExamples();
      return;
    }
    
    if (args.includes('--quick')) {
      console.log('\n🔧 RUNNING QUICK BENCHMARKS ONLY');
      console.log('─'.repeat(50));
      const { runAllBenchmarks: runQuickBenchmarks } = await import('./quick/index.js');
      await runQuickBenchmarks();
      return;
    }
    
    // Default: Run everything
    console.log('\n1️⃣  QUICK BENCHMARKS (CPU/Micro-optimizations)');
    console.log('─'.repeat(50));
    const { runAllBenchmarks: runQuickBenchmarks } = await import('./quick/index.js');
    await runQuickBenchmarks();
    
    console.log('\n2️⃣  REAL-WORLD DEBUGGING EXAMPLES');
    console.log('─'.repeat(50));
    const { runRealWorldExamples } = await import('./real-world/index.js');
    await runRealWorldExamples();
    
    console.log('\n✅ ALL COMPLETED!');
    console.log('\n💡 For specific runs:');
    console.log('  npm start -- --quick       # Only quick benchmarks');
    console.log('  npm start -- --real-world  # Only real-world examples');
    console.log('  npm run benchmark:io       # I/O benchmarks only');
    console.log('  npm run benchmark:memory   # Memory benchmarks only');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Create results directory if needed
import fs from 'fs';
if (!fs.existsSync('results')) {
  fs.mkdirSync('results');
}

if (require.main === module) {
  runAllBenchmarks().catch(console.error);
}

export { runAllBenchmarks };
