import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fsPromises from 'fs/promises';
import { handleCommand } from '../src/cli';

describe('cli handleCommand', () => {
  let logSpy: any;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows help for /help', async () => {
    const res = await handleCommand('/help');
    expect(res).toBe(false);
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy.mock.calls[0][0]).toContain('/help');
  });

  it('rejects commands without leading slash', async () => {
    const res = await handleCommand('help');
    expect(res).toBe(false);
    expect(logSpy).toHaveBeenCalledWith("Prefix commands with '/' (e.g. /help).");
  });

  it('/q should signal exit', async () => {
    const shouldExit = await handleCommand('/q');
    expect(shouldExit).toBe(true);
  });

  it('setdir saves an existing directory (stub fs)', async () => {
    const statSpy = vi.spyOn(fsPromises, 'stat').mockResolvedValue({ isDirectory: () => true } as any);
    const writeSpy = vi.spyOn(fsPromises, 'writeFile').mockResolvedValue(undefined as any);

    const res = await handleCommand('/setdir /tmp');
    expect(res).toBe(false);
    expect(writeSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Directory saved'));

    statSpy.mockRestore();
  });
});
