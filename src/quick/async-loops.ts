import { performance } from 'perf_hooks';

export class AsyncBenchmark {
  static async run(size: number = 10_000) {
    console.log(`\n⚡ ASYNC BENCHMARKS (${size.toLocaleString()} items)`);
    console.log('='.repeat(50));
    
    const promises = Array.from({ length: size }, (_, i) => 
      Promise.resolve(i)
    );
    
    // Sequential
    const start1 = performance.now();
    let sum1 = 0;
    for (const p of promises) {
      sum1 += await p;
    }
    const time1 = performance.now() - start1;
    
    // Parallel
    const start2 = performance.now();
    const results = await Promise.all(promises);
    const sum2 = results.reduce((a, b) => a + b, 0);
    const time2 = performance.now() - start2;
    
    console.log(`Sequential await: ${time1.toFixed(2)}ms`);
    console.log(`Promise.all:      ${time2.toFixed(2)}ms`);
    console.log(`Speedup: ${(time1 / time2).toFixed(1)}x faster with Promise.all`);
  }
}