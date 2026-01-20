import { createServer } from 'http';
import { exec } from 'child_process';
import { promisify } from 'util';
import { performance } from 'perf_hooks';

const execAsync = promisify(exec);

export function createDemoServer(port: number = 3004) {
  let dbQueryCount = 0;
  let cacheHits = 0;
  let cacheMisses = 0;
  
  async function simulateDbQuery(): Promise<any> {
    dbQueryCount++;
    await new Promise(resolve => setTimeout(resolve, 50));
    return { id: dbQueryCount, data: `Result ${dbQueryCount}` };
  }
  
  const cache = new Map<string, any>();
  
  async function getCachedData(key: string): Promise<any> {
    if (cache.has(key)) {
      cacheHits++;
      return cache.get(key);
    }
    
    cacheMisses++;
    const data = await simulateDbQuery();
    cache.set(key, data);
    return data;
  }
  
  const server = createServer(async (req, res) => {
    const startTime = performance.now();
    
    try {
      if (req.url === '/db') {
        const data = await simulateDbQuery();
        const duration = performance.now() - startTime;
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          data,
          duration: `${duration.toFixed(2)}ms`,
          dbQueries: dbQueryCount
        }));
        
      } else if (req.url === '/cache') {
        const data = await getCachedData('example');
        const duration = performance.now() - startTime;
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          data,
          duration: `${duration.toFixed(2)}ms`,
          cacheHits,
          cacheMisses,
          hitRate: ((cacheHits / (cacheHits + cacheMisses)) * 100).toFixed(1) + '%'
        }));
        
      } else if (req.url === '/stats') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          dbQueryCount,
          cacheHits,
          cacheMisses,
          cacheSize: cache.size,
          memory: process.memoryUsage()
        }));
        
      } else if (req.url === '/cpu-prof') {
        const { stdout } = await execAsync('curl http://localhost:3004/db');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'CPU load generated', output: stdout }));
        
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    } catch (error: any) {
      res.writeHead(500);
      res.end(JSON.stringify({ 
        error: error?.message || 'Unknown error',
        stack: error?.stack 
      }));
    }
  });
  
  return server;
}

export async function runLoadTest(url: string, concurrent: number = 10, duration: string = '10s') {
  console.log(`🚀 Running load test: ${url}`);
  console.log(`   Concurrent: ${concurrent}, Duration: ${duration}`);
  
  try {
    const { stdout } = await execAsync(
      `npx autocannon -c ${concurrent} -d ${duration} ${url}`
    );
    console.log(stdout);
    return stdout;
  } catch (error: any) {
    console.error('Load test failed:', error?.message || error);
    return null;
  }
}

export async function generateCpuProfile(port: number = 3004) {
  console.log('📊 Generating CPU profile...');
  
  try {
    const { spawn } = require('child_process');
    const serverProcess = spawn('node', ['--cpu-prof', '-e', `
      const { createDemoServer } = require('./dist/real-world/load-test-demo.js');
      const server = createDemoServer(${port});
      server.listen(${port}, () => console.log('Profiling server started'));
    `]);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await runLoadTest(`http://localhost:${port}/db`, 5, '5s');

    serverProcess.kill();
    
    console.log('CPU profile generated (look for .cpuprofile file)');
  } catch (error: any) { 
    console.error('Failed to generate CPU profile:', error?.message || error);
  }
}

if (require.main === module) {
  const server = createDemoServer(3004);
  
  server.listen(3004, () => {
    console.log(' DEMO SERVER: http://localhost:3004');
    console.log('  /db        - Simulated database query (50ms)');
    console.log('  /cache     - Cached endpoint');
    console.log('  /stats     - Server statistics');
    console.log('  /cpu-prof  - Trigger CPU profiling');
    
    console.log('\n💡 Load testing commands:');
    console.log('  npx autocannon -c 10 -d 10 http://localhost:3004/db');
    console.log('  npx autocannon -c 10 -d 10 http://localhost:3004/cache');
    
    console.log('\n💡 Profiling commands:');
    console.log('  node --cpu-prof dist/real-world/load-test-demo.js');
    console.log('  node --heap-prof dist/real-world/load-test-demo.js');
  });
}