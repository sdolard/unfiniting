// Simple CLI REPL implemented in TypeScript
// Supports commands: setdir <path>, showdir, cd <path>, exit

import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { homedir } from 'os';
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
  } catch (err) {
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
async function handleCommand(line: string): Promise<boolean> {
  const trimmed = line.trim();
  if (!trimmed) return false;

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);

  if (cmd === 'exit' || cmd === 'quit') {
    return true;
  }

  if (cmd === 'help') {
    console.log('Commands: setdir <path>, showdir, cd <path>, exit');
    return false;
  }

  if (cmd === 'showdir') {
    console.log(`Répertoire courant: ${currentDir}`);
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
        console.log("Le chemin spécifié n'est pas un répertoire.");
        return false;
      }
    } catch (err) {
      console.log("Le chemin spécifié n'existe pas.");
      return false;
    }

    currentDir = resolved;
    await saveConfig();
    console.log(`Répertoire enregistré: ${currentDir}`);
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
      console.log(`Répertoire courant changé: ${currentDir}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log('Impossible de changer de répertoire:', msg);
    }
    return false;
  }

  console.log(`Unknown command: ${cmd}`);
  return false;
}

// Initialize the REPL: load config, create readline interface and wire events
async function main(): Promise<void> {
  await loadConfig();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> ',
  });

  rl.prompt();

  // Handle a new input line: execute command and optionally exit
  rl.on('line', async line => {
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
  });

  // Handle readline close event: exit the process cleanly
  rl.on('close', () => {
    console.log('Bye.');
    process.exit(0);
  });
}

if (require.main === module) {
  main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
