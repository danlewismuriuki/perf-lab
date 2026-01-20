import { performance } from 'perf_hooks';
import { EventEmitter } from 'events';

export interface BenchmarkResult {
  name: string;
  times: number[];
  average: number;
  median: number;
  min: number;
  max: number;
  standardDeviation: number;
  opsPerSecond: number;
  memoryUsedMB: number;
}

export class BenchmarkRunner extends EventEmitter {
  private results: Map<string, BenchmarkResult> = new Map();
  private warmupRuns: number = 3;
  private measurementRuns: number = 7;
  
  constructor(options?: { warmupRuns?: number; measurementRuns?: number }) {
    super();
    if (options?.warmupRuns) this.warmupRuns = options.warmupRuns;
    if (options?.measurementRuns) this.measurementRuns = options.measurementRuns;
  }
  
  async benchmark(
    name: string,
    fn: () => any | Promise<any>,
    options?: {
      setup?: () => void | Promise<void>;
      teardown?: () => void | Promise<void>;
      iterations?: number;
    }
  ): Promise<BenchmarkResult> {
    console.log(`⏱️  Benchmarking: ${name}`);
    
    const times: number[] = [];
    const memorySamples: number[] = [];

    if (options?.setup) {
      await options.setup();
    }
    
    for (let i = 0; i < this.warmupRuns; i++) {
      await this.execute(fn);
    }
    
    for (let i = 0; i < this.measurementRuns; i++) {
      if (typeof global.gc === 'function') {
        global.gc();
      }
      
      const memoryBefore = process.memoryUsage().heapUsed;
      const start = performance.now();
      
      const iterations = options?.iterations || 1;
      for (let j = 0; j < iterations; j++) {
        await this.execute(fn);
      }
      
      const end = performance.now();
      const memoryAfter = process.memoryUsage().heapUsed;
      
      times.push((end - start) / iterations);
      memorySamples.push((memoryAfter - memoryBefore) / 1024 / 1024);
      
      this.emit('progress', {
        name,
        run: i + 1,
        total: this.measurementRuns,
        time: times[times.length - 1]
      });
    }
    
    if (options?.teardown) {
      await options.teardown();
    }
    
    const result = this.calculateStats(name, times, memorySamples);
    this.results.set(name, result);
    
    this.emit('complete', result);
    return result;
  }
  
  private async execute(fn: () => any | Promise<any>): Promise<any> {
    const result = fn();
    if (result instanceof Promise) {
      return await result;
    }
    return result;
  }
  
  private calculateStats(
    name: string,
    times: number[],
    memorySamples: number[]
  ): BenchmarkResult {
    const sortedTimes = [...times].sort((a, b) => a - b);
    
    const sum = sortedTimes.reduce((a, b) => a + b, 0);
    const average = sum / sortedTimes.length;
    
    const mid = Math.floor(sortedTimes.length / 2);
    const median = sortedTimes.length % 2 === 0
      ? (sortedTimes[mid - 1] + sortedTimes[mid]) / 2
      : sortedTimes[mid];
    
    const min = Math.min(...sortedTimes);
    const max = Math.max(...sortedTimes);
    
    const squareDiffs = sortedTimes.map(time => {
      const diff = time - average;
      return diff * diff;
    });
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / sortedTimes.length;
    const standardDeviation = Math.sqrt(avgSquareDiff);
    
    const opsPerSecond = 1000 / average;
    
    const memoryUsedMB = memorySamples.reduce((a, b) => a + b, 0) / memorySamples.length;
    
    return {
      name,
      times,
      average,
      median,
      min,
      max,
      standardDeviation,
      opsPerSecond,
      memoryUsedMB
    };
  }
  
  printReport(): void {
    console.log('\n' + '='.repeat(80));
    console.log('BENCHMARK REPORT');
    console.log('='.repeat(80));
    
    const results = Array.from(this.results.values());
    results.sort((a, b) => a.average - b.average);
    
    console.log('\nRank | Benchmark                    | Avg (ms) | Median   | Ops/sec  | Memory (MB)');
    console.log('-'.repeat(80));
    
    results.forEach((result, index) => {
      console.log(
        `${(index + 1).toString().padStart(4)} | ` +
        `${result.name.padEnd(27)} | ` +
        `${result.average.toFixed(3).padStart(8)} | ` +
        `${result.median.toFixed(3).padStart(8)} | ` +
        `${result.opsPerSecond.toFixed(0).padStart(8)} | ` +
        `${result.memoryUsedMB.toFixed(2).padStart(10)}`
      );
    });
    
    // Comparison
    if (results.length >= 2) {
      const fastest = results[0];
      const slowest = results[results.length - 1];
      const speedup = slowest.average / fastest.average;
      
      console.log('\n' + '='.repeat(80));
      console.log(`🏆 ${fastest.name} is ${speedup.toFixed(1)}x faster than ${slowest.name}`);
      console.log('='.repeat(80));
    }
  }
  
  exportJSON(filename: string): void {
    const data = {
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      platform: process.platform,
      architecture: process.arch,
      benchmarks: Array.from(this.results.values())
    };
    
    const fs = require('fs');
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`📁 Results exported to: ${filename}`);
  }
  
  exportCSV(filename: string): void {
    const results = Array.from(this.results.values());
    let csv = 'Benchmark,Average(ms),Median(ms),Min(ms),Max(ms),StdDev(ms),Ops/sec,Memory(MB)\n';
    
    for (const result of results) {
      csv += `"${result.name}",${result.average},${result.median},${result.min},${result.max},${result.standardDeviation},${result.opsPerSecond},${result.memoryUsedMB}\n`;
    }
    
    const fs = require('fs');
    fs.writeFileSync(filename, csv);
    console.log(`📁 CSV exported to: ${filename}`);
  }
}