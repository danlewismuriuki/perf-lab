import { performance } from 'perf_hooks';

export class MemoryBenchmarks {
  static runAll() {
    console.log('\n🧠 MEMORY USAGE BENCHMARKS');
    console.log('='.repeat(50));
    
    this.allocationPatterns();
    this.garbageCollectionImpact();
    this.memoryLeakDetection();
    this.typedArraysVsRegular();
  }
  
  static allocationPatterns() {
    console.log('\n📈 Memory Allocation Patterns:');
    
    const size = 100000;
    
    // Pattern 1: Pre-allocate array
    const start1 = performance.now();
    const arr1 = new Array(size);
    for (let i = 0; i < size; i++) arr1[i] = i;
    const time1 = performance.now() - start1;
    const mem1 = process.memoryUsage().heapUsed;
    console.log(`Pre-allocated array: ${time1.toFixed(2)}ms, Memory: ${(mem1 / 1024 / 1024).toFixed(2)}MB`);
    
    // Pattern 2: Push to array
    const start2 = performance.now();
    const arr2: number[] = [];
    for (let i = 0; i < size; i++) arr2.push(i);
    const time2 = performance.now() - start2;
    const mem2 = process.memoryUsage().heapUsed;
    console.log(`Array.push(): ${time2.toFixed(2)}ms, Memory: ${(mem2 / 1024 / 1024).toFixed(2)}MB`);
    
    // Pattern 3: TypedArray
    const start3 = performance.now();
    const arr3 = new Int32Array(size);
    for (let i = 0; i < size; i++) arr3[i] = i;
    const time3 = performance.now() - start3;
    const mem3 = process.memoryUsage().heapUsed;
    console.log(`TypedArray: ${time3.toFixed(2)}ms, Memory: ${(mem3 / 1024 / 1024).toFixed(2)}MB`);
  }
  
  static garbageCollectionImpact() {
    console.log('\n🗑️ Garbage Collection Impact:');
    
    if (typeof global.gc !== 'function') {
      console.log('⚠️ Run with --expose-gc flag for GC measurements');
      return;
    }
    
    const iterations = 10000;
    
    // Without manual GC
    const start1 = performance.now();
    for (let i = 0; i < iterations; i++) {
      const temp = new Array(1000).fill(0);
    }
    const time1 = performance.now() - start1;
    console.log(`Creating objects (no manual GC): ${time1.toFixed(2)}ms`);
    
    // With manual GC
    const start2 = performance.now();
    for (let i = 0; i < iterations; i++) {
      const temp = new Array(1000).fill(0);
      if (i % 1000 === 0) global.gc();
    }
    const time2 = performance.now() - start2;
    console.log(`Creating objects (with periodic GC): ${time2.toFixed(2)}ms`);
  }
  
  static memoryLeakDetection() {
    console.log('\n🔍 Potential Memory Leak Patterns:');
    
    // Pattern that might cause memory leak
    const listeners: Array<() => void> = [];
    
    const start = performance.now();
    for (let i = 0; i < 10000; i++) {
      // Creating closure that captures outer variable
      const data = new Array(100).fill('leak');
      listeners.push(() => console.log(data.length));
    }
    const time = performance.now() - start;
    console.log(`Created ${listeners.length} closures: ${time.toFixed(2)}ms`);
    console.log(`Each closure captures 100-element array`);
    
    // Clear to prevent actual leak
    listeners.length = 0;
  }
  
  static typedArraysVsRegular() {
    console.log('\n🔢 TypedArrays vs Regular Arrays:');
    
    const size = 1000000;
    
    // Float64Array
    const start1 = performance.now();
    const typed = new Float64Array(size);
    for (let i = 0; i < size; i++) typed[i] = Math.random();
    const sum1 = typed.reduce((a, b) => a + b, 0);
    const time1 = performance.now() - start1;
    console.log(`Float64Array operations: ${time1.toFixed(2)}ms`);
    
    // Regular array
    const start2 = performance.now();
    const regular: number[] = [];
    for (let i = 0; i < size; i++) regular.push(Math.random());
    const sum2 = regular.reduce((a, b) => a + b, 0);
    const time2 = performance.now() - start2;
    console.log(`Regular array operations: ${time2.toFixed(2)}ms`);
    
    console.log(`TypedArray is ${(time2 / time1).toFixed(1)}x faster`);
  }
}