import { performance } from 'perf_hooks';
import fs from 'fs/promises';
import { createReadStream, createWriteStream } from 'fs';
import { promisify } from 'util';
import { gzip, gunzip } from 'zlib';
import { pipeline } from 'stream/promises';

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

export class IOBenchmarks {
  static async runAll() {
    console.log('\n📁 I/O OPERATION BENCHMARKS');
    console.log('='.repeat(50));
    
    await this.fileWriteRead();
    await this.streamVsBuffer();
    await this.compressionBenchmark();
    await this.concurrentIO();
  }
  
  static async fileWriteRead() {
    console.log('\n📝 File Write/Read Operations:');
    
    const testData = 'x'.repeat(1024 * 1024);
    
    const writeStart = performance.now();
    await fs.writeFile('/tmp/test-io.txt', testData);
    const writeTime = performance.now() - writeStart;
    console.log(`Write 1MB file: ${writeTime.toFixed(2)}ms`);
    
    const readStart = performance.now();
    const data = await fs.readFile('/tmp/test-io.txt');
    const readTime = performance.now() - readStart;
    console.log(`Read 1MB file (buffer): ${readTime.toFixed(2)}ms`);
    
    const readStart2 = performance.now();
    const data2 = await fs.readFile('/tmp/test-io.txt', 'utf8');
    const readTime2 = performance.now() - readStart2;
    console.log(`Read 1MB file (string): ${readTime2.toFixed(2)}ms`);
    
    await fs.unlink('/tmp/test-io.txt');
  }
  
  static async streamVsBuffer() {
    console.log('\n🌊 Streams vs Buffers (10MB file):');
    
    const size = 10 * 1024 * 1024;
    const testData = Buffer.alloc(size, 'x');
    
 
    const bufferStart = performance.now();
    await fs.writeFile('/tmp/test-buffer.txt', testData);
    const bufferTime = performance.now() - bufferStart;
    console.log(`Write 10MB (buffer): ${bufferTime.toFixed(2)}ms`);
    
 
    const streamStart = performance.now();
    const writeStream = createWriteStream('/tmp/test-stream.txt');
    await new Promise((resolve, reject) => {
      writeStream.write(testData);
      writeStream.end();
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
    const streamTime = performance.now() - streamStart;
    console.log(`Write 10MB (stream): ${streamTime.toFixed(2)}ms`);
    
    await Promise.all([
      fs.unlink('/tmp/test-buffer.txt'),
      fs.unlink('/tmp/test-stream.txt')
    ]);
  }
  
  static async compressionBenchmark() {
    console.log('\n🗜️ Compression Benchmarks:');
    
    const testData = 'x'.repeat(1024 * 100);   
    


    const gzipStart = performance.now();
    const compressed = await gzipAsync(testData);
    const gzipTime = performance.now() - gzipStart;
    console.log(`Gzip 100KB: ${gzipTime.toFixed(2)}ms (${compressed.length} bytes)`);
    
    const gunzipStart = performance.now();
    await gunzipAsync(compressed);
    const gunzipTime = performance.now() - gunzipStart;
    console.log(`Gunzip 100KB: ${gunzipTime.toFixed(2)}ms`);
  }
  
  static async concurrentIO() {
    console.log('\n⚡ Concurrent vs Sequential I/O:');
    
    const createTempFile = async (i: number) => {
      await fs.writeFile(`/tmp/test-${i}.txt`, `Data ${i}`);
    };
    
    const seqStart = performance.now();
    for (let i = 0; i < 100; i++) {
      await createTempFile(i);
    }
    const seqTime = performance.now() - seqStart;
    console.log(`Create 100 files (sequential): ${seqTime.toFixed(2)}ms`);
    
    const concStart = performance.now();
    await Promise.all(
      Array.from({ length: 100 }, (_, i) => createTempFile(i + 100))
    );
    const concTime = performance.now() - concStart;
    console.log(`Create 100 files (concurrent): ${concTime.toFixed(2)}ms`);
    
    const cleanupPromises = [];
    for (let i = 0; i < 200; i++) {
      cleanupPromises.push(fs.unlink(`/tmp/test-${i}.txt`).catch(() => {}));
    }
    await Promise.all(cleanupPromises);
  }
}