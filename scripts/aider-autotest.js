#!/usr/bin/env node
// Simple auto-test agent for .aider.conf.yml
// Usage: node scripts/aider-autotest.js
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const chokidar = require('chokidar');
const { spawn } = require('child_process');

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, '.aider.conf.yml');

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
      return yaml.load(raw) || {};
    }
  } catch (err) {
    console.error('Failed to read .aider.conf.yml:', err);
  }
  return {};
}

const cfg = loadConfig();
const testCmd = cfg['test-cmd'] || cfg.test || 'pnpm test';
const autoTest = cfg.auto-test === undefined ? true : !!cfg['auto-test'];
const watchGlobs = cfg.watch || ['src/**', 'tests/**'];
const debounceMs = Number(cfg.debounce_ms || cfg.debounce || 300);
const runOnStart = !!cfg.run_on_start;
const allowExec = cfg.allow_exec === undefined ? false : !!cfg.allow_exec;

if (!allowExec) {
  console.error('aider-autotest: allow_exec is false in .aider.conf.yml — aborting for safety.');
  process.exit(1);
}

let timer = null;
let running = false;
let pending = false;

function runTests() {
  if (running) {
    pending = true;
    return;
  }
  running = true;
  pending = false;

  console.log(`\n[aider-autotest] Running: ${testCmd}`);
  const child = spawn(testCmd, { shell: true, stdio: 'inherit', env: process.env });

  child.on('exit', code => {
    running = false;
    console.log(`[aider-autotest] Test process exited with code ${code}\n`);
    if (pending) {
      // small delay to group rapid changes
      setTimeout(runTests, 50);
    }
  });
  child.on('error', err => {
    running = false;
    console.error('[aider-autotest] Failed to start test command:', err);
  });
}

function scheduleRun() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    runTests();
  }, debounceMs);
}

if (!autoTest) {
  console.log('aider-autotest: auto-test disabled in .aider.conf.yml — exiting.');
  process.exit(0);
}

console.log('[aider-autotest] Watching for changes:', watchGlobs);
const watcher = chokidar.watch(watchGlobs, { ignored: /node_modules|dist/, ignoreInitial: true });

watcher.on('all', (event, p) => {
  console.log(`[aider-autotest] ${event} ${p}`);
  scheduleRun();
});

process.on('SIGINT', () => {
  console.log('\n[aider-autotest] Stopping watcher...');
  watcher.close().then(() => process.exit(0));
});

if (runOnStart) {
  scheduleRun();
}
