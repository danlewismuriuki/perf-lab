import { performance } from 'perf_hooks';

export class FunctionCallBenchmark {
  static run(iterations: number = 10_000_000) {
    console.log(`\n📞 FUNCTION CALL PATTERNS (${iterations.toLocaleString()} calls)`);
    console.log('='.repeat(50));
    
    // Different function types
    function regularFunction(x: number): number {
      return x * 2;
    }
    
    const arrowFunction = (x: number): number => x * 2;
    
    const obj = {
      method(x: number): number {
        return x * 2;
      }
    };
    
    class MyClass {
      method(x: number): number {
        return x * 2;
      }
    }
    
    const instance = new MyClass();
    
    const results = [];
    
    // Regular function
    const start1 = performance.now();
    let sum1 = 0;
    for (let i = 0; i < iterations; i++) {
      sum1 += regularFunction(i);
    }
    results.push({ name: 'Regular function', time: performance.now() - start1 });
    
    // Arrow function
    const start2 = performance.now();
    let sum2 = 0;
    for (let i = 0; i < iterations; i++) {
      sum2 += arrowFunction(i);
    }
    results.push({ name: 'Arrow function', time: performance.now() - start2 });
    
    // Object method
    const start3 = performance.now();
    let sum3 = 0;
    for (let i = 0; i < iterations; i++) {
      sum3 += obj.method(i);
    }
    results.push({ name: 'Object method', time: performance.now() - start3 });
    
    // Class method
    const start4 = performance.now();
    let sum4 = 0;
    for (let i = 0; i < iterations; i++) {
      sum4 += instance.method(i);
    }
    results.push({ name: 'Class method', time: performance.now() - start4 });
    
    // Display
    results.forEach((r, i) => {
      console.log(`${i + 1}. ${r.name.padEnd(20)} ${r.time.toFixed(2)}ms`);
    });
  }
}