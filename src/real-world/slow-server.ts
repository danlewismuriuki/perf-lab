import { createServer } from 'http';
import { Worker } from 'worker_threads';

function cpuHeavyTask(iterations: number = 50_000_000): number {
  let result = 0;
  for (let i = 0; i < iterations; i++) {
    result += Math.sqrt(i) * Math.sin(i);
  }
  return result;
}

export function createBlockingServer(port: number = 3000) {
  const server = createServer((req, res) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    
    if (req.url === '/blocking') {
      console.time('blockingRequest');
      const result = cpuHeavyTask(10_000_000);
      console.timeEnd('blockingRequest');
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'done',
        result: result.toString().substring(0, 10) + '...',
        pid: process.pid
      }));
    } else if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'healthy', pid: process.pid }));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });
  
  return server;
}

export function createWorkerThreadServer(port: number = 3001) {
  function runInWorker(iterations: number): Promise<number> {
    return new Promise((resolve, reject) => {
      const workerCode = `
        const { parentPort } = require('worker_threads');
        let result = 0;
        for (let i = 0; i < ${iterations}; i++) {
          result += Math.sqrt(i) * Math.sin(i);
        }
        parentPort.postMessage(result);
      `;
      
      const worker = new Worker(workerCode, { eval: true });
      
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }
  
  const server = createServer(async (req, res) => {
    if (req.url === '/worker') {
      console.time('workerRequest');
      const result = await runInWorker(10_000_000);
      console.timeEnd('workerRequest');
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'done',
        result: result.toString().substring(0, 10) + '...',
        pid: process.pid,
        method: 'worker_thread'
      }));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });
  
  return server;
}

if (require.main === module) {
  const blockingServer = createBlockingServer(3000);
  const workerServer = createWorkerThreadServer(3001);
  
  blockingServer.listen(3000, () => {
    console.log('BLOCKING Server (Problem): http://localhost:3000');
    console.log('  /blocking - CPU blocking endpoint');
    console.log('  /health   - Health check');
  });
  
  workerServer.listen(3001, () => {
    console.log('WORKER THREAD Server (Solution): http://localhost:3001');
    console.log('  /worker   - Non-blocking worker thread endpoint');
  });
  
  console.log('\n Test with:');
  console.log('  npx autocannon -c 5 -d 10 http://localhost:3000/blocking');
  console.log('  npx autocannon -c 5 -d 10 http://localhost:3001/worker');
}