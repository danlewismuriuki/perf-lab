# Node.js Performance Lab

This repository is a personal performance playground for experimenting with Node.js runtime behavior.  
It’s designed to build real intuition about speed, memory, and CPU usage using **measurement—not guesses**.

---

## Goals

Understand:

- How fast different loops, functions, and patterns actually run
- Where CPU time is spent in real code
- Why memory grows and how to detect leaks
- When optimizations matter and when they don’t

---

## Purpose

This repo is for:

- **Micro-benchmarking** small pieces of code
- **Comparing** different implementations
- **Profiling** hot paths with flame graphs
- **Learning** how V8 and Node behave under load

> This is **not a product repo**.  
> It is a **learning and experimentation lab**.

---

## Tooling Used

- **perf_hooks** – quick local timing
- **benchmark** – repeatable statistical benchmarks
- **node --prof** – low-level CPU profiling
- **0x** – visual flame graphs
- **clinic.js** – system-level analysis
- **heapdump** – memory snapshotting

---

## Project Structure

perf-lab/
├── quick/ # Simple perf_hooks / console.time tests
├── benchmark/ # Benchmark.js comparisons
├── profiling/ # CPU profiling examples
├── memory/ # Memory growth & leak experiments
└── README.md

yaml
Copy code

Each folder answers one performance question.

---

## How to Use

Run scripts directly with Node:

```bash
node quick/perf_hooks.js
node benchmark/loops.js
node profiling/cpu.js
Profile with:

bash
Copy code
node --prof file.js
0x file.js
clinic doctor -- node file.js
Philosophy
Measure before optimizing

Optimize only hot paths

Don’t rely on opinions—use data

Separate debugging tools from production observability
```
