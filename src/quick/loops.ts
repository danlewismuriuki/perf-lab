import { performance } from "perf_hooks";

const N = 10_000_000;
const SMALL_N = 100_000;

const numbers = Array.from({ length: N }, (_, i) => i);
const objects = Array.from({ length: SMALL_N }, (_, i) => ({
  id: i,
  value: `item-${i}`,
  data: Math.random() * 1000
}));

const asyncNumbers = Array.from({ length: SMALL_N }, (_, i) => 
  Promise.resolve(i)
);

function time(label: string, fn: () => void, iterations: number = 1) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  const total = end - start;
  const avg = total / iterations;
  console.log(`${label}: ${avg.toFixed(2)} ms (total: ${total.toFixed(2)} ms)`);
}

console.log('=== BASIC LOOPS (N = 10,000,000) ===\n');

time("for loop", () => {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i]!;
  }
  return sum;
});

time("for loop (cached length)", () => {
  let sum = 0;
  const len = numbers.length;
  for (let i = 0; i < len; i++) {
    sum += numbers[i]!;
  }
  return sum;
});

time("while loop", () => {
  let sum = 0;
  let i = 0;
  const len = numbers.length;
  while (i < len) {
    sum += numbers[i]!;
    i++;
  }
  return sum;
});

time("for...of loop", () => {
  let sum = 0;
  for (const num of numbers) {
    sum += num;
  }
  return sum;
});

time("forEach loop", () => {
  let sum = 0;
  numbers.forEach((num) => {
    sum += num;
  });
  return sum;
});

time("reduce loop", () => {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum;
});

console.log('\n=== OBJECT PROPERTY ACCESS (N = 100,000) ===\n');

time("object for loop", () => {
  let sum = 0;
  for (let i = 0; i < objects.length; i++) {
    sum += objects[i]!.data;
  }
  return sum;
});

time("object for...of loop", () => {
  let sum = 0;
  for (const obj of objects) {
    sum += obj.data;
  }
  return sum;
});

time("object map + reduce", () => {
  const sum = objects
    .map(obj => obj.data)
    .reduce((acc, val) => acc + val, 0);
  return sum;
});

console.log('\n=== ARRAY METHODS COMPARISON (N = 100,000) ===\n');

// 10. Map
time("map", () => {
  const doubled = objects.map(obj => obj.data * 2);
  return doubled.length;
});

time("filter", () => {
  const filtered = objects.filter(obj => obj.data > 500);
  return filtered.length;
});

time("find", () => {
  const found = objects.find(obj => obj.id === 50000);
  return found?.id;
});

console.log('\n=== ADVANCED PATTERNS (N = 100,000) ===\n');

time("for loop with destructuring", () => {
  let sum = 0;
  for (let i = 0; i < objects.length; i++) {
    const { data } = objects[i]!;
    sum += data;
  }
  return sum;
});

time("reverse for loop", () => {
  let sum = 0;
  for (let i = numbers.length - 1; i >= 0; i--) {
    sum += numbers[i]!;
  }
  return sum;
});

time("for loop with pre-increment", () => {
  let sum = 0;
  for (let i = 0; i < numbers.length; ++i) {
    sum += numbers[i]!;
  }
  return sum;
});

console.log('\n=== MEMORY AND PERFORMANCE TIPS ===');
console.log('1. for loops with cached length are generally fastest');
console.log('2. for...of is cleaner but slightly slower');
console.log('3. forEach and array methods have function call overhead');
console.log('4. Reduce can be optimized by JS engines');
console.log('5. Consider pre-increment (++i) over post-increment (i++)');
console.log('6. Avoid creating functions inside hot loops');