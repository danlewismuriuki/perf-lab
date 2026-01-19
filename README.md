Node.js Performance Lab

This repository is a personal performance playground for experimenting with Node.js runtime behavior.
It’s designed to build real intuition about speed, memory, and CPU usage using measurement—not guesses.

The goal is to understand:

How fast different loops, functions, and patterns actually run

Where CPU time is spent in real code

Why memory grows and how to detect leaks

When optimizations matter and when they don’t

What This Repo Is For

This repo is for:

🔬 Micro-benchmarking small pieces of code

📊 Comparing different implementations

🔥 Profiling hot paths with flame graphs

🧠 Learning how V8 and Node behave under load

It is not a product repo.
It is a learning + experimentation lab.

Tooling Used

This repo uses a few focused tools:

perf_hooks – quick local timing

benchmark – repeatable statistical benchmarks

node --prof – low-level CPU profiling

0x – visual flame graphs

clinic.js – system-level analysis

heapdump – memory snapshotting

Structure
perf-lab/
├── quick/ # Simple perf_hooks / console.time tests
├── benchmark/ # Benchmark.js comparisons
├── profiling/ # CPU profiling examples
├── memory/ # Memory growth & leak experiments
└── README.md

Each folder answers one performance question.

How to Use

Run scripts directly with Node:

node quick/perf_hooks.js
node benchmark/loops.js
node profiling/cpu.js

Profile with:

node --prof file.js
0x file.js
clinic doctor -- node file.js

Philosophy

Measure before optimizing

Optimize only hot paths

Don’t rely on opinions—use data

Separate debugging tools from production observability

Why This Exists

Strong engineers build intuition by experimenting with real measurements.
This repo is where that intuition is trained.
