import { performance } from 'perf_hooks';

export class DataStructureBenchmark {
  static run(size: number = 100_000) {
    console.log(`\n🏗️  DATA STRUCTURE BENCHMARKS (${size.toLocaleString()} items)`);
    console.log('='.repeat(50));
    
    // Setup
    const array = Array.from({ length: size }, (_, i) => i);
    const set = new Set(array);
    const map = new Map(array.map(i => [i, i]));
    const object = Object.fromEntries(array.map(i => [i, i]));
    
    const results = [];
    
    // Array iteration
    const start1 = performance.now();
    let sum1 = 0;
    array.forEach(x => sum1 += x);
    results.push({ name: 'Array.forEach', time: performance.now() - start1 });
    
    // Set iteration
    const start2 = performance.now();
    let sum2 = 0;
    set.forEach(x => sum2 += x);
    results.push({ name: 'Set.forEach', time: performance.now() - start2 });
    
    // Map iteration
    const start3 = performance.now();
    let sum3 = 0;
    map.forEach(x => sum3 += x);
    results.push({ name: 'Map.forEach', time: performance.now() - start3 });
    
    // Object iteration
    const start4 = performance.now();
    let sum4 = 0;
    Object.values(object).forEach(x => sum4 += x);
    results.push({ name: 'Object.values', time: performance.now() - start4 });
    
    // Lookup test
    const target = Math.floor(size / 2);
    
    const start5 = performance.now();
    const inArray = array.includes(target);
    results.push({ name: 'Array.includes', time: performance.now() - start5 });
    
    const start6 = performance.now();
    const inSet = set.has(target);
    results.push({ name: 'Set.has', time: performance.now() - start6 });
    
    const start7 = performance.now();
    const inMap = map.has(target);
    results.push({ name: 'Map.has', time: performance.now() - start7 });
    
    const start8 = performance.now();
    const inObject = target in object;
    results.push({ name: 'Object "in"', time: performance.now() - start8 });
    
    // Display
    results.forEach((r, i) => {
      console.log(`${i + 1}. ${r.name.padEnd(20)} ${r.time.toFixed(2)}ms`);
    });
  }
}