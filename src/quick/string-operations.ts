import { performance } from 'perf_hooks';

export class StringBenchmark {
  static run(iterations: number = 100_000) {
    console.log(`\n🔤 STRING OPERATIONS (${iterations.toLocaleString()} iterations)`);
    console.log('='.repeat(50));
    
    const str = 'Hello, World!';
    const results = [];
    
    // Concatenation methods
    const start1 = performance.now();
    let result1 = '';
    for (let i = 0; i < iterations; i++) {
      result1 += str;
    }
    results.push({ name: '+ concatenation', time: performance.now() - start1 });
    
    const start2 = performance.now();
    let result2 = '';
    for (let i = 0; i < iterations; i++) {
      result2 = result2.concat(str);
    }
    results.push({ name: 'String.concat()', time: performance.now() - start2 });
    
    const start3 = performance.now();
    const parts = [];
    for (let i = 0; i < iterations; i++) {
      parts.push(str);
    }
    const result3 = parts.join('');
    results.push({ name: 'Array.join()', time: performance.now() - start3 });
    
    // Template literals
    const start4 = performance.now();
    let result4 = '';
    for (let i = 0; i < iterations; i++) {
      result4 = `${result4}${str}`;
    }
    results.push({ name: 'Template literal', time: performance.now() - start4 });
    
    // Display
    results.forEach((r, i) => {
      console.log(`${i + 1}. ${r.name.padEnd(20)} ${r.time.toFixed(2)}ms`);
    });
  }
}