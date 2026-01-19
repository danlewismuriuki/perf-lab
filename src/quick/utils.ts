import { performance } from 'perf_hooks';

export class BenchmarkUtils {
  static measure(label: string, fn: () => void, iterations: number = 1): number {
    // Warm up
    for (let i = 0; i < 3; i++) fn();
    
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      fn();
    }
    const end = performance.now();
    
    const total = end - start;
    const avg = total / iterations;
    
    console.log(`${label.padEnd(30)} ${avg.toFixed(2)}ms avg (${total.toFixed(2)}ms total)`);
    return avg;
  }
  
  static createArray(size: number): number[] {
    return Array.from({ length: size }, (_, i) => i);
  }
  
  static formatNumber(num: number): string {
    return num.toLocaleString();
  }
  
  static compareResults(results: Array<{name: string, time: number}>): void {
    results.sort((a, b) => a.time - b.time);
    const fastest = results[0].time;
    
    console.log('\n🏆 COMPARISON:');
    results.forEach((r, i) => {
      const percent = ((r.time / fastest - 1) * 100).toFixed(1);
      console.log(`${i + 1}. ${r.name.padEnd(25)} ${r.time.toFixed(2)}ms ${percent !== '0.0' ? `(+${percent}%)` : '(fastest)'}`);
    });
  }
}