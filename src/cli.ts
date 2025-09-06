// Simple CLI REPL implemented in TypeScript
// Supports commands: setdir <path>, showdir, cd <path>, exit
// NOTE: All user-facing strings (console output, help text, errors shown to users)
// must be written in English. Keep messages and tests in English to ensure consistency.
// This file and any new CLI code should follow that rule.

import fs from 'fs';
import fsPromises from 'fs/promises';
import { homedir } from 'os';
import path from 'path';
import readline from 'readline';

// Path to the configuration file stored in the user's home directory
const CONFIG_FILE = path.join(homedir(), '.mycli_config.json');

let currentDir: string = process.cwd();

// Load the saved configuration from disk (if present) and set currentDir
async function loadConfig(): Promise<void> {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = await fsPromises.readFile(CONFIG_FILE, 'utf8');
      const obj = JSON.parse(data);
      if (obj && typeof obj.currentDir === 'string') {
        currentDir = obj.currentDir;
      }
    }
  } catch {
    // ignore config load errors
  }
}

// Persist the current directory to the configuration file
async function saveConfig(): Promise<void> {
  try {
    const obj = { currentDir };
    await fsPromises.writeFile(CONFIG_FILE, JSON.stringify(obj, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save config:', err);
  }
}

// Parse and execute a single command line.
// Returns true when the REPL should exit.
export async function handleCommand(line: string): Promise<boolean> {
  const trimmed = line.trim();
  if (!trimmed) return false;

  // Commands must start with '/'
  if (!trimmed.startsWith('/')) {
    console.log("Prefix commands with '/' (e.g. /help).");
    return false;
  }

  // Remove the leading '/' then parse
  const withoutSlash = trimmed.slice(1).trim();
  if (!withoutSlash) return false;
  const parts = withoutSlash.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  // Exit aliases
  if (cmd === 'exit' || cmd === 'quit' || cmd === 'q') {
    return true;
  }

  // Help
  if (cmd === 'help' || cmd === '?') {
    console.log('Available commands:\n  /help | /?         - show this help\n  /setdir <path>     - set the working directory (persisted)\n  /showdir           - show the configured directory\n  /cd <path>         - change the process working directory\n  /exit | /quit | /q - exit\n  (other planned commands: analyze, extract, annotate, export-sft, train)');
    return false;
  }

  if (cmd === 'showdir') {
    console.log(`Current directory: ${currentDir}`);
    return false;
  }

  if (cmd === 'setdir') {
    if (args.length === 0) {
      console.log('Usage: setdir <path>');
      return false;
    }
    const inputPath = args.join(' ');

    // Expand '~' to the user's home directory and resolve to an absolute path
    // Verify the path exists and is a directory before accepting it
    let expanded = inputPath;
    if (expanded.startsWith('~')) {
      expanded = path.join(homedir(), expanded.slice(1));
    }
    const resolved = path.resolve(expanded);

    try {
      const stat = await fsPromises.stat(resolved);
      if (!stat.isDirectory()) {
        console.log("The specified path is not a directory.");
        return false;
      }
  } catch {
      console.log("The specified path does not exist.");
      return false;
    }

    currentDir = resolved;
    await saveConfig();
    console.log(`Directory saved: ${currentDir}`);
    return false;
  }

  if (cmd === 'cd') {
    if (args.length === 0) {
      console.log('Usage: cd <path>');
      return false;
    }
    const inputPath = args.join(' ');

    let expanded = inputPath;
    if (expanded.startsWith('~')) {
      expanded = path.join(homedir(), expanded.slice(1));
    }
    const resolved = path.resolve(expanded);

    // Change the process current working directory
    try {
      process.chdir(resolved);
      currentDir = process.cwd();
      await saveConfig();
      console.log(`Current directory changed: ${currentDir}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log('Failed to change directory:', msg);
    }
    return false;
  }

  console.log(`Unknown command: /${cmd}`);
  return false;
}

// Initialize the REPL: load config, create readline interface and wire events
async function main(): Promise<void> {
  await loadConfig();
  // Welcome message
  console.log('Welcome to unfiniting CLI. Type /help for the list of commands.');
  console.log(`Current directory: ${currentDir}`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> ',
  });

  rl.prompt();

  // Handle a new input line: execute command and optionally exit
  rl.on('line', line => {
    // Deliberately not returning a promise to the event emitter
    void (async () => {
      try {
        const shouldExit = await handleCommand(line);
        if (shouldExit) {
          rl.close();
        } else {
          rl.prompt();
        }
      } catch (err) {
        console.error('Error handling command:', err);
        rl.prompt();
      }
    })();
  });

  // Handle readline close event: exit the process cleanly
  rl.on('close', () => {
    console.log('Bye.');
    process.exit(0);
  });
}

if (require.main === module) {
  main().catch(error => {
    // retaining variable for logging; rename to avoid earlier 'err' unused variable rule context
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
