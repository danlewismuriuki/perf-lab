import { performance } from 'perf_hooks';

// Define an interface for benchmark results
interface BenchmarkResult {
  name: string;
  time: number;
}

export class LoopBenchmark {
  static run(size: number = 1_000_000) {
    console.log(`\n🔁 LOOP BENCHMARKS (${size.toLocaleString()} items)`);
    console.log('='.repeat(50));
    
    const arr = Array.from({ length: size }, (_, i) => i);
    
    // Warm up
    for (let i = 0; i < 3; i++) arr.reduce((a, b) => a + b, 0);
    
    // Add explicit type annotation to fix the error
    const results: BenchmarkResult[] = [];
    
    // Traditional for
    const start1 = performance.now();
    let sum1 = 0;
    for (let i = 0; i < arr.length; i++) sum1 += arr[i]!;
    results.push({ name: 'Traditional for', time: performance.now() - start1 });
    
    // Cached length
    const start2 = performance.now();
    let sum2 = 0;
    const len = arr.length;
    for (let i = 0; i < len; i++) sum2 += arr[i]!;
    results.push({ name: 'Cached length for', time: performance.now() - start2 });
    
    // for...of
    const start3 = performance.now();
    let sum3 = 0;
    for (const num of arr) sum3 += num;
    results.push({ name: 'for...of', time: performance.now() - start3 });
    
    // forEach
    const start4 = performance.now();
    let sum4 = 0;
    arr.forEach(num => { sum4 += num; });
    results.push({ name: 'forEach', time: performance.now() - start4 });
    
    // Sort by time
    results.sort((a, b) => a.time - b.time);
    
    results.forEach((r, i) => {
      const percent = ((r.time / results[0].time - 1) * 100).toFixed(1);
      console.log(`${i + 1}. ${r.name.padEnd(20)} ${r.time.toFixed(2)}ms ${percent !== '0.0' ? `(+${percent}%)` : ''}`);
    });
  }
}