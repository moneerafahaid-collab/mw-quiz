import type { Plugin } from 'vite';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

const execFileAsync = promisify(execFile);
const VOICE = 'ar-SA-ZariyahNeural';

async function synthesize(text: string): Promise<Buffer> {
  const outPath = join(tmpdir(), `mw-tts-${randomUUID()}.mp3`);
  try {
    await execFileAsync(
      'python',
      ['-m', 'edge_tts', '--voice', VOICE, '--text', text, '--write-media', outPath],
      { timeout: 30000 },
    );
    return await readFile(outPath);
  } finally {
    await unlink(outPath).catch(() => {});
  }
}

function ttsMiddleware(
  req: import('http').IncomingMessage,
  res: import('http').ServerResponse,
  next: () => void,
) {
  if (!req.url?.startsWith('/api/tts')) {
    next();
    return;
  }

  const url = new URL(req.url, 'http://localhost');
  const text = url.searchParams.get('text')?.trim();

  if (!text) {
    res.statusCode = 400;
    res.end('Missing text');
    return;
  }

  void synthesize(text)
    .then((buffer) => {
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'no-store');
      res.end(buffer);
    })
    .catch(() => {
      res.statusCode = 500;
      res.end('TTS failed');
    });
}

export function ttsPlugin(): Plugin {
  return {
    name: 'mw-tts',
    configureServer(server) {
      server.middlewares.use(ttsMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(ttsMiddleware);
    },
  };
}
